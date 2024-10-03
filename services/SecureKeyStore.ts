import * as SecureStore from "expo-secure-store";
import { CustomKeyType } from "../types/types";

export class SecureKeyStore {
  static saveKey(keyType: CustomKeyType, key: string): void {
    try {
      SecureStore.setItem(keyType, key);
    } catch (error) {
      console.error(`Failed to save ${keyType} key:`, error);
    }
  }

  static getKey(keyType: CustomKeyType): string | null {
    try {
      return SecureStore.getItem(keyType);
    } catch (error) {
      console.error(`Failed to retrieve ${keyType} key:`, error);
      return null;
    }
  }

  static async deleteKey(keyType: CustomKeyType): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(keyType);
    } catch (error) {
      console.error(`Failed to delete ${keyType} key:`, error);
    }
  }
}
