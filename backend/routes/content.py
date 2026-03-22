"""
Content API Routes - Protected Medical Content Delivery
========================================================

This module serves medical content (formulary, renal adjustments, etc.)
from the database to authenticated, subscribed users.

Security:
- All endpoints require authentication
- Formulary content requires active subscription OR admin status
- Content is never exposed in the frontend bundle

Endpoints:
- GET /api/content/formulary - Full drug formulary (subscription required)
- GET /api/content/formulary/{drug_id} - Single drug details
- GET /api/content/renal-adjustments - Renal dosing adjustments
- GET /api/content/drug-categories - List of drug categories
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Import auth dependencies
from routes.auth import require_auth, require_subscription

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/content", tags=["Medical Content"])

# Database connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]


# =============================================================================
# DRUG FORMULARY ENDPOINTS
# =============================================================================

@router.get("/formulary")
async def get_formulary(
    category: Optional[str] = Query(None, description="Filter by drug category"),
    search: Optional[str] = Query(None, description="Search drug name"),
    limit: int = Query(200, ge=1, le=500, description="Max results"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    user = Depends(require_subscription)
):
    """
    Get the full drug formulary.
    
    Requires active subscription or admin status.
    
    Args:
        category: Optional category filter (e.g., "Antibiotic")
        search: Optional search term for drug name
        limit: Maximum number of results (1-500)
        offset: Pagination offset
    
    Returns:
        List of drug entries with dosing information
    """
    try:
        # Build query
        query = {}
        
        if category:
            query["category"] = {"$regex": category, "$options": "i"}
        
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"id": {"$regex": search, "$options": "i"}}
            ]
        
        # Get total count
        total = await db.formulary.count_documents(query)
        
        # Get drugs with pagination
        cursor = db.formulary.find(query, {"_id": 0}).skip(offset).limit(limit)
        drugs = await cursor.to_list(length=limit)
        
        return {
            "drugs": drugs,
            "total": total,
            "limit": limit,
            "offset": offset,
            "has_more": offset + len(drugs) < total
        }
    
    except Exception as e:
        logger.error(f"Error fetching formulary: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch formulary")


@router.get("/formulary/{drug_id}")
async def get_drug_by_id(
    drug_id: str,
    user = Depends(require_subscription)
):
    """
    Get a single drug by its ID.
    
    Requires active subscription or admin status.
    
    Args:
        drug_id: The drug's unique identifier (e.g., "acetaminophen")
    
    Returns:
        Complete drug entry with all dosing information
    """
    try:
        drug = await db.formulary.find_one({"id": drug_id}, {"_id": 0})
        
        if not drug:
            raise HTTPException(status_code=404, detail=f"Drug '{drug_id}' not found")
        
        return drug
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching drug {drug_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch drug")


@router.get("/drug-categories")
async def get_drug_categories(
    user = Depends(require_auth)  # Only requires auth, not subscription
):
    """
    Get list of all drug categories.
    
    This is a lightweight endpoint that returns just category names,
    useful for populating filter dropdowns.
    
    Requires authentication (not subscription).
    """
    try:
        # Get distinct categories
        categories = await db.formulary.distinct("category")
        categories.sort()
        
        return {
            "categories": categories,
            "count": len(categories)
        }
    
    except Exception as e:
        logger.error(f"Error fetching drug categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")


# =============================================================================
# RENAL ADJUSTMENTS ENDPOINTS
# =============================================================================

@router.get("/renal-adjustments")
async def get_renal_adjustments(
    drug_id: Optional[str] = Query(None, description="Filter by drug ID"),
    user = Depends(require_subscription)
):
    """
    Get renal dose adjustment data.
    
    Requires active subscription or admin status.
    
    Args:
        drug_id: Optional drug ID to get adjustments for a specific drug
    
    Returns:
        Renal adjustment data including antimicrobial and non-antimicrobial tables
    """
    try:
        if drug_id:
            # Get single drug's renal adjustment
            adjustment = await db.renal_adjustments.find_one(
                {"drugId": drug_id.lower()},
                {"_id": 0}
            )
            
            if not adjustment:
                return {"found": False, "drugId": drug_id}
            
            return {"found": True, "adjustment": adjustment}
        
        # Get all renal adjustments
        cursor = db.renal_adjustments.find({}, {"_id": 0})
        adjustments = await cursor.to_list(length=500)
        
        # Separate into antimicrobial and non-antimicrobial
        antimicrobial = [a for a in adjustments if a.get("type") == "antimicrobial"]
        non_antimicrobial = [a for a in adjustments if a.get("type") == "non_antimicrobial"]
        
        return {
            "antimicrobial": antimicrobial,
            "non_antimicrobial": non_antimicrobial,
            "total": len(adjustments),
            "drug_aliases": await get_drug_aliases()
        }
    
    except Exception as e:
        logger.error(f"Error fetching renal adjustments: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch renal adjustments")


async def get_drug_aliases():
    """Get drug name aliases from the database"""
    try:
        aliases_doc = await db.content_metadata.find_one(
            {"type": "drug_aliases"},
            {"_id": 0, "aliases": 1}
        )
        return aliases_doc.get("aliases", {}) if aliases_doc else {}
    except Exception:
        return {}


# =============================================================================
# CONTENT METADATA
# =============================================================================

@router.get("/metadata")
async def get_content_metadata(
    user = Depends(require_auth)
):
    """
    Get content metadata (counts, last updated, etc.)
    
    Useful for displaying stats and checking if content needs refresh.
    """
    try:
        formulary_count = await db.formulary.count_documents({})
        renal_count = await db.renal_adjustments.count_documents({})
        
        # Get last updated timestamp
        metadata = await db.content_metadata.find_one(
            {"type": "content_info"},
            {"_id": 0}
        )
        
        return {
            "formulary_count": formulary_count,
            "renal_adjustments_count": renal_count,
            "last_updated": metadata.get("last_updated") if metadata else None,
            "version": metadata.get("version") if metadata else "1.0.0"
        }
    
    except Exception as e:
        logger.error(f"Error fetching content metadata: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch metadata")
