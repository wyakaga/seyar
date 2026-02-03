import Svg, { SvgProps, Path } from "react-native-svg";

const ShieldIcon = (props: SvgProps) => (
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
		<Path d="M11.467 20.82a.88.88 0 0 0 1.066 0C14.168 19.593 19 15.586 19 11.016v-4.93a.514.514 0 0 0-.457-.515 12.05 12.05 0 0 1-5.582-2.046l-.61-.417a.62.62 0 0 0-.702 0l-.61.417a12.05 12.05 0 0 1-5.582 2.046.514.514 0 0 0-.457.515v4.93c0 4.57 4.832 8.577 6.467 9.802" />
	</Svg>
);
export default ShieldIcon;
