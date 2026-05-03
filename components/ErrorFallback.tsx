import { View } from "react-native";
import { Text } from "@/components/Text";
import { Button } from "heroui-native";
import { FallbackProps } from "react-error-boundary";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<View className="flex-1 items-center justify-center bg-background p-6 gap-y-4">
			<Text className="text-foreground font-bold text-2xl text-center">Something went wrong</Text>
			<Text className="text-muted-foreground text-center">
				{error instanceof Error ? error.message : String(error)}
			</Text>
			<Button onPress={resetErrorBoundary} variant="primary" className="mt-4">
				<Button.Label>Try Again</Button.Label>
			</Button>
		</View>
	);
}

