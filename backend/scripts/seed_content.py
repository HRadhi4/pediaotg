#!/usr/bin/env python3
"""
Content Migration Script - Seed Medical Content to Database
============================================================

This one-time script migrates static medical content from frontend files
to the MongoDB database. Run this during initial deployment.

Collections created:
- formulary: Drug dosing data (from formulary.json)
- renal_adjustments: Renal dosing adjustments (from renalAdjustments.js)
- content_metadata: Metadata and aliases

Usage:
    python scripts/seed_content.py

Environment:
    MONGO_URL: MongoDB connection string
    DB_NAME: Database name
"""

import asyncio
import json
import os
import sys
import re
from datetime import datetime, timezone
from pathlib import Path

# Add backend to path
sys.path.insert(0, '/app/backend')

from motor.motor_asyncio import AsyncIOMotorClient
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

# Source files
FRONTEND_DATA_DIR = Path('/app/frontend/src/data')
FORMULARY_JSON = FRONTEND_DATA_DIR / 'formulary.json'


def parse_renal_adjustments_js():
    """
    Parse the renalAdjustments.js file and extract the adjustment data.
    
    This file contains JavaScript objects that we need to convert to Python dicts.
    We'll extract DRUG_ALIASES, ANTIMICROBIAL_RENAL_ADJUSTMENTS, and 
    NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS.
    """
    js_file = FRONTEND_DATA_DIR / 'renalAdjustments.js'
    
    if not js_file.exists():
        logger.warning(f"Renal adjustments file not found: {js_file}")
        return [], {}
    
    content = js_file.read_text()
    
    # Extract DRUG_ALIASES
    drug_aliases = {}
    aliases_match = re.search(r'export const DRUG_ALIASES\s*=\s*\{([^}]+)\}', content)
    if aliases_match:
        aliases_str = aliases_match.group(1)
        for line in aliases_str.strip().split('\n'):
            match = re.match(r"\s*'([^']+)'\s*:\s*'([^']+)'", line)
            if match:
                drug_aliases[match.group(1)] = match.group(2)
    
    logger.info(f"Parsed {len(drug_aliases)} drug aliases")
    
    # Parse antimicrobial adjustments
    antimicrobial = parse_adjustment_section(content, 'ANTIMICROBIAL_RENAL_ADJUSTMENTS', 'antimicrobial')
    logger.info(f"Parsed {len(antimicrobial)} antimicrobial adjustments")
    
    # Parse non-antimicrobial adjustments
    non_antimicrobial = parse_adjustment_section(content, 'NON_ANTIMICROBIAL_RENAL_ADJUSTMENTS', 'non_antimicrobial')
    logger.info(f"Parsed {len(non_antimicrobial)} non-antimicrobial adjustments")
    
    return antimicrobial + non_antimicrobial, drug_aliases


def parse_adjustment_section(content: str, section_name: str, adj_type: str) -> list:
    """Parse a section of renal adjustments from the JS file."""
    
    adjustments = []
    
    # Find the section
    pattern = rf"export const {section_name}\s*=\s*\{{"
    match = re.search(pattern, content)
    if not match:
        logger.warning(f"Section {section_name} not found")
        return []
    
    start = match.end()
    
    # Find matching closing brace (simplified - won't handle nested braces perfectly)
    # For production, consider using a proper JS parser
    brace_count = 1
    end = start
    while brace_count > 0 and end < len(content):
        if content[end] == '{':
            brace_count += 1
        elif content[end] == '}':
            brace_count -= 1
        end += 1
    
    section_content = content[start:end-1]
    
    # Extract drug entries using regex
    # Pattern matches: 'drugname': { ... }
    drug_pattern = r"'([^']+)':\s*\{\s*drugName:\s*'([^']+)'[^}]+\}"
    
    for match in re.finditer(drug_pattern, section_content, re.DOTALL):
        drug_id = match.group(1)
        drug_name = match.group(2)
        drug_block = match.group(0)
        
        # Extract route
        route_match = re.search(r"route:\s*'([^']+)'", drug_block)
        route = route_match.group(1) if route_match else None
        
        # Extract notes
        notes_match = re.search(r"notes:\s*'([^']*)'", drug_block)
        notes = notes_match.group(1) if notes_match else None
        
        # Check for special flags
        level_guided = 'levelGuidedDosing: true' in drug_block
        no_guidelines = 'noGuidelinesEstablished: true' in drug_block
        no_adjustment = 'noAdjustmentRequired: true' in drug_block
        loading_dose = 'loadingDose: true' in drug_block
        
        # Extract warnings array
        warnings = []
        warnings_match = re.search(r"warnings:\s*\[([^\]]*)\]", drug_block)
        if warnings_match:
            for w in re.findall(r"'([^']+)'", warnings_match.group(1)):
                warnings.append(w)
        
        adjustment = {
            "drugId": drug_id,
            "drugName": drug_name,
            "type": adj_type,
            "route": route,
            "notes": notes,
            "levelGuidedDosing": level_guided,
            "noGuidelinesEstablished": no_guidelines,
            "noAdjustmentRequired": no_adjustment,
            "loadingDose": loading_dose,
            "warnings": warnings if warnings else None,
            # Note: Full adjustment rules would need more complex parsing
            # For now, we include raw markers; full parsing can be added later
        }
        
        adjustments.append(adjustment)
    
    return adjustments


async def seed_formulary(db):
    """Seed the formulary collection from formulary.json"""
    
    if not FORMULARY_JSON.exists():
        logger.error(f"Formulary file not found: {FORMULARY_JSON}")
        return 0
    
    # Load formulary data
    with open(FORMULARY_JSON, 'r', encoding='utf-8') as f:
        drugs = json.load(f)
    
    logger.info(f"Loaded {len(drugs)} drugs from formulary.json")
    
    # Drop existing collection and create fresh
    await db.formulary.drop()
    
    # Insert all drugs
    if drugs:
        result = await db.formulary.insert_many(drugs)
        logger.info(f"Inserted {len(result.inserted_ids)} drugs into formulary collection")
        
        # Create indexes for efficient querying
        await db.formulary.create_index("id", unique=True)
        await db.formulary.create_index("name")
        await db.formulary.create_index("category")
        await db.formulary.create_index([("name", "text"), ("id", "text")])
        
        logger.info("Created indexes on formulary collection")
    
    return len(drugs)


async def seed_renal_adjustments(db):
    """Seed the renal adjustments collection"""
    
    adjustments, drug_aliases = parse_renal_adjustments_js()
    
    if not adjustments:
        logger.warning("No renal adjustments parsed")
        return 0
    
    # Drop existing collection
    await db.renal_adjustments.drop()
    
    # Insert adjustments
    result = await db.renal_adjustments.insert_many(adjustments)
    logger.info(f"Inserted {len(result.inserted_ids)} renal adjustments")
    
    # Create indexes
    await db.renal_adjustments.create_index("drugId", unique=True)
    await db.renal_adjustments.create_index("type")
    
    # Store drug aliases in metadata
    await db.content_metadata.update_one(
        {"type": "drug_aliases"},
        {"$set": {"aliases": drug_aliases, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True
    )
    logger.info(f"Stored {len(drug_aliases)} drug aliases in metadata")
    
    return len(adjustments)


async def update_metadata(db, formulary_count: int, renal_count: int):
    """Update content metadata"""
    
    await db.content_metadata.update_one(
        {"type": "content_info"},
        {
            "$set": {
                "formulary_count": formulary_count,
                "renal_adjustments_count": renal_count,
                "last_updated": datetime.now(timezone.utc).isoformat(),
                "version": "1.0.0",
                "source": "frontend_migration"
            }
        },
        upsert=True
    )
    logger.info("Updated content metadata")


async def main():
    """Main migration function"""
    
    logger.info("=" * 60)
    logger.info("CONTENT MIGRATION SCRIPT")
    logger.info("=" * 60)
    logger.info(f"MongoDB URL: {MONGO_URL[:50]}...")
    logger.info(f"Database: {DB_NAME}")
    logger.info(f"Source directory: {FRONTEND_DATA_DIR}")
    logger.info("=" * 60)
    
    # Connect to database
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    try:
        # Test connection
        await db.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Seed formulary
        formulary_count = await seed_formulary(db)
        
        # Seed renal adjustments
        renal_count = await seed_renal_adjustments(db)
        
        # Update metadata
        await update_metadata(db, formulary_count, renal_count)
        
        logger.info("=" * 60)
        logger.info("MIGRATION COMPLETE")
        logger.info(f"  Formulary drugs: {formulary_count}")
        logger.info(f"  Renal adjustments: {renal_count}")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Migration failed: {e}", exc_info=True)
        raise
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
