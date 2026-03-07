import { openDB } from 'idb';

const DB_NAME = 'pedotg-session';
const DB_VERSION = 1;
const STORE_NAME = 'saved-results';

/**
 * Initialize the IndexedDB database
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the saved results store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    },
  });
}

/**
 * Save a calculation result
 * @param {Object} result - The result to save
 * @param {string} result.type - Type of calculation (e.g., 'GCS', 'PRAM', 'Sodium')
 * @param {string} result.title - Display title
 * @param {Object} result.inputs - Input values used
 * @param {Object} result.output - Calculated output
 * @param {string} result.notes - Optional notes
 */
export async function saveResult(result) {
  const db = await initDB();
  const savedResult = {
    ...result,
    timestamp: new Date().toISOString(),
  };
  return db.add(STORE_NAME, savedResult);
}

/**
 * Get all saved results, sorted by most recent first
 */
export async function getAllResults() {
  const db = await initDB();
  const results = await db.getAll(STORE_NAME);
  return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Get results by type
 * @param {string} type - The type of calculation to filter by
 */
export async function getResultsByType(type) {
  const db = await initDB();
  const index = db.transaction(STORE_NAME).store.index('type');
  const results = await index.getAll(type);
  return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Get a single result by ID
 * @param {number} id - The result ID
 */
export async function getResult(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

/**
 * Delete a single result
 * @param {number} id - The result ID to delete
 */
export async function deleteResult(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

/**
 * Clear all saved results
 */
export async function clearAllResults() {
  const db = await initDB();
  return db.clear(STORE_NAME);
}

/**
 * Get the count of saved results
 */
export async function getResultCount() {
  const db = await initDB();
  return db.count(STORE_NAME);
}

/**
 * Export all results as JSON (for backup)
 */
export async function exportResults() {
  const results = await getAllResults();
  return JSON.stringify(results, null, 2);
}

/**
 * Import results from JSON (for restore)
 * @param {string} json - JSON string of results to import
 */
export async function importResults(json) {
  const db = await initDB();
  const results = JSON.parse(json);
  const tx = db.transaction(STORE_NAME, 'readwrite');
  
  for (const result of results) {
    // Remove id to let IndexedDB auto-generate new ones
    const { id, ...resultWithoutId } = result;
    await tx.store.add(resultWithoutId);
  }
  
  await tx.done;
  return results.length;
}
