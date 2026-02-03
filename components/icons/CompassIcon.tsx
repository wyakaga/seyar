import Svg, { SvgProps, Path } from "react-native-svg";

const CompassIcon = (props: SvgProps) => (
	<Svg
		width={props.width || 24}
		height={props.height || 24}
		fill="none"
		stroke={props.color || "white"}
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		viewBox="0 0 24 24"
		{...props}
	>
		<Path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" />
		<Path d="m9 15 1.5-4.5L15 9l-1.5 4.5z" />
	</Svg>
);
export default CompassIcon;
