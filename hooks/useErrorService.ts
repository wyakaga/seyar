import { useToast } from "heroui-native";
import { useCallback } from "react";

export const useErrorService = () => {
	const { toast } = useToast();

	const handleError = useCallback(
		(error: unknown, title = "Error") => {
			console.error(error);
			const message = error instanceof Error ? error.message : "An unexpected error occurred";

			toast.show({
				variant: "danger",
				label: title,
				description: message,
				placement: "bottom",
			});
		},
		[toast],
	);

	const showSuccess = useCallback(
		(message: string, title = "Success") => {
			toast.show({
				variant: "success",
				label: title,
				description: message,
				placement: "bottom",
			});
		},
		[toast],
	);

	return { handleError, showSuccess };
};
