import { Transaction } from '../types';

const DB_NAME = 'brimo_pwa_db';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

/**
 * Open or upgrade the IndexedDB database.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('by_date', 'date', { unique: false });
        store.createIndex('by_category', 'category', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Sort transactions in descending chronological order (newest first).
 */
export function sortTransactionsDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateTimeA = `${a.date} ${a.time || '00:00'}`;
    const dateTimeB = `${b.date} ${b.time || '00:00'}`;
    return dateTimeB.localeCompare(dateTimeA);
  });
}

/**
 * Initialize IndexedDB with initial mock transactions if the store is currently empty.
 * Returns the up-to-date transaction list from the database.
 */
export async function initTransactionsDB(initialData: Transaction[]): Promise<Transaction[]> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        if (countRequest.result === 0) {
          // Store is empty, seed initial data
          for (const item of initialData) {
            store.put(item);
          }
          tx.oncomplete = () => {
            resolve(sortTransactionsDesc(initialData));
          };
          tx.onerror = () => reject(tx.error);
        } else {
          // Read all existing transactions
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = () => {
            const data = (getAllRequest.result as Transaction[]) || [];
            resolve(sortTransactionsDesc(data));
          };
          getAllRequest.onerror = () => reject(getAllRequest.error);
        }
      };

      countRequest.onerror = () => reject(countRequest.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Fallback to in-memory initial transactions:', err);
    return sortTransactionsDesc(initialData);
  }
}

/**
 * Retrieve all transactions from IndexedDB.
 */
export async function getAllTransactionsFromDB(): Promise<Transaction[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const data = (request.result as Transaction[]) || [];
        resolve(sortTransactionsDesc(data));
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Failed to load transactions:', err);
    return [];
  }
}

/**
 * Save or update a single transaction in IndexedDB.
 */
export async function addTransactionToDB(transaction: Transaction): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(transaction);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Failed to save transaction:', err);
  }
}

/**
 * Clear all transactions from IndexedDB (e.g. for reset/testing).
 */
export async function clearTransactionsFromDB(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Failed to clear transactions:', err);
  }
}
