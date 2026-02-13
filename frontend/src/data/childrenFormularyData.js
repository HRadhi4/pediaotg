/**
 * CHILDREN'S DRUG FORMULARY - Data Wrapper
 * 
 * This module provides access to the formulary data stored in formulary.json.
 * The JSON format improves load performance and allows for easier data updates.
 * 
 * Based on Harriet Lane Handbook & Clinical Formulary Guidelines
 * Total: 114 medications with comprehensive dosing information
 */

import formularyData from './formulary.json';

// Export the main formulary array
export const childrenFormulary = formularyData;

// Export helper to get drug by ID
export const getDrugById = (id) => childrenFormulary.find(drug => drug.id === id);

// Export unique drug categories (sorted alphabetically)
export const drugCategories = [...new Set(childrenFormulary.map(d => d.category))].sort();

// Export drug count for reference
export const drugCount = childrenFormulary.length;

// Default export for convenience
export default childrenFormulary;
