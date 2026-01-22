import AnchorIcon from "@/components/icons/AnchorIcon";
import CompassIcon from "@/components/icons/CompassIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import { Tabs } from "expo-router";

const COLORS = {
	background: "#1A1A1D",
	active: "#E6E2D3",
	inactive: "#3F3F46",
	border: "#2B2B2F",
};
export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: COLORS.active,
				tabBarInactiveTintColor: COLORS.inactive,

				tabBarStyle: {
					backgroundColor: COLORS.background,
					borderTopColor: COLORS.border,
					borderTopWidth: 1,
					height: 60,
					paddingTop: 10,
					paddingBottom: 10,
				},

				headerShown: false,

				tabBarShowLabel: false,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: ({ color }) => <HomeIcon fontSize={40} color={color} />,
				}}
			/>

			<Tabs.Screen
				name="anchor"
				options={{
					tabBarIcon: ({ color }) => <AnchorIcon fontSize={40} color={color} />,
				}}
			/>

			<Tabs.Screen
				name="compass"
				options={{
					tabBarIcon: ({ color }) => <CompassIcon fontSize={40} color={color} />,
				}}
			/>
		</Tabs>
	);
}
