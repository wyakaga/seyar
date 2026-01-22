import Svg, { SvgProps, Path } from "react-native-svg";

const AnchorIcon = (props: SvgProps) => (
	<Svg
		width={24}
		height={24}
		fill="none"
		stroke={props.color || "white"}
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		{...props}
	>
		<Path d="M12 21a9 9 0 0 1-9-9h2m7 9a9 9 0 0 0 9-9h-2m-7 9V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
	</Svg>
);

export default AnchorIcon;
