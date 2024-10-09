import * as SecureStore from "expo-secure-store";
import { CustomKeyType } from "../types/types";

/**
 * SecureKeyStore class provides methods to save, retrieve, and delete keys securely.
 */
export class SecureKeyStore {
  /**
   * Saves a key securely.
   * @param {CustomKeyType} keyType - The type of the key to be saved.
   * @param {string} key - The key value to be saved.
   * @returns {void}
   */
  static saveKey(keyType: CustomKeyType, key: string): void {
    try {
      // Save the key securely using SecureStore
      SecureStore.setItem(keyType, key);
    } catch (error) {
      // Log an error message if saving fails
      console.error(`Failed to save ${keyType} key:`, error);
    }
  }

  /**
   * Retrieves a key securely.
   * @param {CustomKeyType} keyType - The type of the key to be retrieved.
   * @returns {string | null} - The retrieved key value or null if retrieval fails.
   */
  static getKey(keyType: CustomKeyType): string | null {
    try {
      // Retrieve the key securely using SecureStore
      return SecureStore.getItem(keyType);
    } catch (error) {
      // Log an error message if retrieval fails
      console.error(`Failed to retrieve ${keyType} key:`, error);
      return null;
    }
  }

  /**
   * Deletes a key securely.
   * @param {CustomKeyType} keyType - The type of the key to be deleted.
   * @returns {Promise<void>}
   */
  static async deleteKey(keyType: CustomKeyType): Promise<void> {
    try {
      // Delete the key securely using SecureStore
      await SecureStore.deleteItemAsync(keyType);
    } catch (error) {
      // Log an error message if deletion fails
      console.error(`Failed to delete ${keyType} key:`, error);
    }
  }
}
