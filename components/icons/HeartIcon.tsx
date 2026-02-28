import Svg, { SvgProps, Path } from "react-native-svg";

const HeartIcon = (props: SvgProps) => (
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
		<Path d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547 3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79-.78-1.654-2.39-2.79-4.25-2.79" />
	</Svg>
);

export default HeartIcon;
