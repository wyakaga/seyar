import * as React from "react";
import { Text as RNText, type TextProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

const textVariants = tv({
	base: "text-foreground text-base font-jakarta",
	variants: {
		variant: {
			default: "",
			h1: "text-center text-4xl font-bold tracking-tight leading-snug",
			h2: "text-3xl font-semibold tracking-tight",
			h3: "text-2xl font-semibold tracking-tight",
			h4: "text-xl font-semibold tracking-tight",
			p: "",
			lead: "text-muted-foreground text-xl",
			large: "text-lg font-semibold",
			small: "text-sm font-medium",
			muted: "text-muted-foreground text-sm",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type TextVariantProps = VariantProps<typeof textVariants>;

export function Text({ className, variant = "default", ...props }: TextProps & TextVariantProps) {
	return <RNText className={textVariants({ variant, className })} {...props} />;
}
