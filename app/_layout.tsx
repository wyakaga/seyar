import { db } from '@/db/client';
import { NAV_THEME } from '@/lib/theme';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import migrations from '../src/drizzle/migrations';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import { getUserSettings, saveUserSettings } from '@/lib/secureStore';

import '../global.css';

SplashScreen.preventAutoHideAsync();
Uniwind.setTheme('dark');

const dbase = SQLite.openDatabaseSync('app.db');

function AppContent() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { success: migrationSuccess } = useMigrations(db, migrations);

  const hasOnboarded = useAuthStore((state) => state.hasOnboarded);
  const setHasOnboarded = useAuthStore((state) => state.setHasOnboarded);
  const isReady = useAuthStore((state) => state.isReady);
  const setIsReady = useAuthStore((state) => state.setIsReady);

  useDrizzleStudio(dbase);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (!migrationSuccess) return;

    const checkUserStatus = async () => {
      try {
        const settings = await getUserSettings();
        if (settings && settings.isOnboarded) {
          setHasOnboarded(true);
        } else {
          setHasOnboarded(false);
        }
      } catch (e) {
        console.error('Error reading settings:', e);
        setHasOnboarded(false);
      } finally {
        setIsReady(true);
      }
    };

    checkUserStatus();
  }, [migrationSuccess, setHasOnboarded, setIsReady]);

  useEffect(() => {
    if (isReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isReady, fontsLoaded]);

  useEffect(() => {
    if (!isReady || !fontsLoaded || !migrationSuccess) return;

    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!hasOnboarded && !inOnboardingGroup) {
      router.replace('/onboarding');
    } else if (hasOnboarded && inOnboardingGroup) {
      router.replace('/');
    }
  }, [isReady, hasOnboarded, segments, router, fontsLoaded, migrationSuccess]);

  if (!migrationSuccess || !isReady || !fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: '#121212',
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="setting" />
    </Stack>
  );
}

export default function RootLayout() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        const migratedKey = await SecureStore.getItemAsync('sqlite_settings_migrated');
        if (!migratedKey) {
          const tableCheck = dbase.getFirstSync<{ count: number }>(
            "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='user_settings';",
          );

          if (tableCheck && tableCheck.count > 0) {
            const row = dbase.getFirstSync<any>('SELECT * FROM user_settings WHERE id = 1;');
            if (row) {
              await saveUserSettings({
                salary: Number(row.salary),
                workDaysPerMonth: Number(row.work_days_per_month ?? 20),
                workHoursPerDay: Number(row.work_hours_per_day ?? 8),
                hourlyRate: Number(row.hourly_rate),
                currency: row.currency ?? 'USD',
                isOnboarded: row.is_onboarded === 1 || row.is_onboarded === true,
              });
            }
          }
          await SecureStore.setItemAsync('sqlite_settings_migrated', 'true');
        }
      } catch (e) {
        console.error('Migration to SecureStore failed:', e);
      } finally {
        setIsInitialized(true);
      }
    }
    initialize();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: NAV_THEME.dark.colors.background }}
      >
        <HeroUINativeProvider>
          <ThemeProvider value={NAV_THEME.dark}>
            <BottomSheetModalProvider>
              <StatusBar style="light" />
              <AppContent />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
