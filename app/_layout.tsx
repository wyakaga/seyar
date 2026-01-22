import { useEffect, useState } from "react";
import { ActivityIndicator, DeviceEventEmitter, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { eq } from "drizzle-orm";
import * as SQLite from "expo-sqlite";
import {
	PlusJakartaSans_400Regular,
	PlusJakartaSans_500Medium,
	PlusJakartaSans_700Bold,
	useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useColorScheme } from "nativewind";
import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

import "../global.css";

import { db } from "@/db/client";
import { userSettings } from "@/db/schema";
import migrations from "../src/drizzle/migrations";
import { NAV_THEME } from "@/lib/theme";

const dbase = SQLite.openDatabaseSync("app.db");

export default function RootLayout() {
	const router = useRouter();
	const segments = useSegments();
	const insets = useSafeAreaInsets();
	const { colorScheme, setColorScheme } = useColorScheme();
	const { success: migrationSuccess } = useMigrations(db, migrations);

	useDrizzleStudio(dbase);

	const [fontsLoaded] = useFonts({
		PlusJakartaSans_400Regular,
		PlusJakartaSans_500Medium,
		PlusJakartaSans_700Bold,
	});

	const [isReady, setIsReady] = useState(false);
	const [hasOnboarded, setHasOnboarded] = useState(false);

	useEffect(() => {
		if (colorScheme !== "dark") {
			setColorScheme("dark");
		}
	}, [colorScheme, setColorScheme]);

	useEffect(() => {
		if (!migrationSuccess) return;

		const checkUserStatus = async () => {
			try {
				const result = await db.select().from(userSettings).where(eq(userSettings.id, 1));
				if (result.length > 0 && result[0].isOnboarded) {
					setHasOnboarded(true);
				} else {
					setHasOnboarded(false);
				}
			} catch (e) {
				console.error("Error reading settings:", e);
				setHasOnboarded(false);
			} finally {
				setIsReady(true);
			}
		};

		checkUserStatus();

		const subscription = DeviceEventEmitter.addListener("onboarding_completed", () => {
			console.log("Event received: Refreshing user status...");
			checkUserStatus();
		});

		return () => {
			subscription.remove();
		};
	}, [migrationSuccess]);

	const inAuthGroup = segments[0] === "(tabs)";
	const isRedirecting =
		isReady && ((hasOnboarded && !inAuthGroup) || (!hasOnboarded && inAuthGroup));

	useEffect(() => {
		if (!isReady) return;

		if (!hasOnboarded && inAuthGroup) {
			router.replace("/onboarding");
		} else if (hasOnboarded && !inAuthGroup) {
			router.replace("/");
		}
	}, [isReady, hasOnboarded, segments, router, inAuthGroup]);

	if (!migrationSuccess || !isReady || !fontsLoaded || isRedirecting) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "#121212",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator size="large" color="#5B67CA" />
			</View>
		);
	}

	return (
		<ThemeProvider value={NAV_THEME.dark}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<StatusBar style="light" />

				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: {
							backgroundColor: "#121212",
							paddingTop: insets.top,
							paddingBottom: insets.bottom,
						},
					}}
				>
					<Stack.Screen name="(tabs)/index" />
					<Stack.Screen name="onboarding/index" />
				</Stack>

				<PortalHost />
			</GestureHandlerRootView>
		</ThemeProvider>
	);
}
