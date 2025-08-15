import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN = "@token";
export const AUTH_DATA = "@authdata";

export const StorageServices = {
  setItem: async (key: string, value: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in AsyncStorage: ${error}`);
    }
  },

  getItem: async <T = any>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting item from AsyncStorage: ${error}`);
      return null;
    }
  },

  removeAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(`Error clearing AsyncStorage: ${error}`);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from AsyncStorage: ${error}`);
    }
  }
};
