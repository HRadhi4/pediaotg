/**
 * Offline Storage Service
 * 
 * Handles offline storage for user preferences and layouts
 * Uses IndexedDB for persistent storage with localStorage fallback
 * 
 * Designed to work with both web and mobile (Capacitor/React Native)
 */

const DB_NAME = 'pediaotg_offline';
const DB_VERSION = 1;
const STORE_NAME = 'layouts';

class OfflineStorage {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      this.db = await this.openDB();
      this.isInitialized = true;
    } catch (error) {
      console.warn('IndexedDB not available, falling back to localStorage');
      this.isInitialized = true;
    }
  }

  openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create layouts store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  async getItem(key) {
    await this.init();

    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          resolve(request.result ? request.result.value : null);
        };
      });
    } else {
      // localStorage fallback
      const item = localStorage.getItem(`offline_${key}`);
      return item ? JSON.parse(item) : null;
    }
  }

  async setItem(key, value) {
    await this.init();

    const record = {
      key,
      value,
      updatedAt: new Date().toISOString()
    };

    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(record);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } else {
      // localStorage fallback
      localStorage.setItem(`offline_${key}`, JSON.stringify(value));
    }
  }

  async removeItem(key) {
    await this.init();

    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } else {
      localStorage.removeItem(`offline_${key}`);
    }
  }

  async getAllItems() {
    await this.init();

    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          resolve(request.result.map(r => ({ key: r.key, value: r.value })));
        };
      });
    } else {
      // localStorage fallback
      const items = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('offline_')) {
          items.push({
            key: key.replace('offline_', ''),
            value: JSON.parse(localStorage.getItem(key))
          });
        }
      }
      return items;
    }
  }

  async clear() {
    await this.init();

    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } else {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('offline_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }
}

// Singleton instance
const offlineStorage = new OfflineStorage();

/**
 * Layout Manager
 * 
 * Handles saving and syncing user layouts with offline support
 */
export const layoutManager = {
  API_URL: process.env.REACT_APP_BACKEND_URL || '',

  // Save layout locally (for offline-first)
  async saveLocalLayout(layoutType, config) {
    await offlineStorage.setItem(`layout_${layoutType}`, {
      layout_type: layoutType,
      layout_config: config,
      updated_at: new Date().toISOString(),
      synced: false
    });
  },

  // Get layout from local storage
  async getLocalLayout(layoutType) {
    return await offlineStorage.getItem(`layout_${layoutType}`);
  },

  // Sync local layouts to server
  async syncToServer(authHeaders) {
    const allItems = await offlineStorage.getAllItems();
    const layouts = allItems
      .filter(item => item.key.startsWith('layout_'))
      .filter(item => !item.value.synced)
      .map(item => ({
        layout_type: item.value.layout_type,
        layout_config: item.value.layout_config
      }));

    if (layouts.length === 0) return;

    try {
      const response = await fetch(`${this.API_URL}/api/layouts/sync`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(layouts)
      });

      if (response.ok) {
        // Mark as synced
        for (const item of allItems.filter(i => i.key.startsWith('layout_'))) {
          await offlineStorage.setItem(item.key, {
            ...item.value,
            synced: true
          });
        }
      }
    } catch (error) {
      console.warn('Failed to sync layouts:', error);
    }
  },

  // Fetch layouts from server
  async fetchFromServer(authHeaders) {
    try {
      const response = await fetch(`${this.API_URL}/api/layouts`, {
        credentials: 'include',
        headers: authHeaders
      });

      if (response.ok) {
        const serverLayouts = await response.json();
        
        // Update local storage with server data
        for (const layout of serverLayouts) {
          const localLayout = await this.getLocalLayout(layout.layout_type);
          
          // "Last updated wins" strategy
          if (!localLayout || new Date(layout.updated_at) > new Date(localLayout.updated_at)) {
            await offlineStorage.setItem(`layout_${layout.layout_type}`, {
              ...layout,
              synced: true
            });
          }
        }

        return serverLayouts;
      }
    } catch (error) {
      console.warn('Failed to fetch layouts from server:', error);
    }
    return null;
  },

  // Save layout (offline-first with sync)
  async saveLayout(layoutType, config, authHeaders) {
    // Always save locally first
    await this.saveLocalLayout(layoutType, config);

    // Try to sync to server if online
    if (navigator.onLine) {
      try {
        await fetch(`${this.API_URL}/api/layouts`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify({
            layout_type: layoutType,
            layout_config: config
          })
        });

        // Mark as synced
        const local = await this.getLocalLayout(layoutType);
        if (local) {
          await offlineStorage.setItem(`layout_${layoutType}`, {
            ...local,
            synced: true
          });
        }
      } catch (error) {
        console.warn('Failed to save layout to server:', error);
      }
    }
  },

  // Get layout (local first, then server)
  async getLayout(layoutType, authHeaders) {
    // Try local first
    const local = await this.getLocalLayout(layoutType);

    // If online, try to fetch from server
    if (navigator.onLine && authHeaders) {
      try {
        const response = await fetch(`${this.API_URL}/api/layouts/${layoutType}`, {
          credentials: 'include',
          headers: authHeaders
        });

        if (response.ok) {
          const serverLayout = await response.json();
          
          // "Last updated wins"
          if (!local || new Date(serverLayout.updated_at) > new Date(local.updated_at)) {
            await offlineStorage.setItem(`layout_${layoutType}`, {
              ...serverLayout,
              synced: true
            });
            return serverLayout.layout_config;
          }
        }
      } catch (error) {
        console.warn('Failed to fetch layout from server:', error);
      }
    }

    return local?.layout_config || null;
  }
};

export default offlineStorage;
