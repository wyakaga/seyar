import * as SecureStore from 'expo-secure-store';

export interface UserSettings {
  salary: number;
  workDaysPerMonth: number;
  workHoursPerDay: number;
  hourlyRate: number;
  currency: string;
  isOnboarded: boolean;
  updatedAt?: string;
}

const SETTINGS_KEY = 'user_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  salary: 0,
  workDaysPerMonth: 20,
  workHoursPerDay: 8,
  hourlyRate: 0,
  currency: 'USD',
  isOnboarded: false,
};

/**
 * Retrieves the user settings securely from Expo SecureStore.
 * Returns default settings if none are found.
 */
export async function getUserSettings(): Promise<UserSettings> {
  try {
    const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to read user settings from SecureStore', e);
  }
  return DEFAULT_SETTINGS;
}

/**
 * Saves the user settings securely to Expo SecureStore.
 */
export async function saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
  try {
    const current = await getUserSettings();
    const updated = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save user settings to SecureStore', e);
    throw e;
  }
}
