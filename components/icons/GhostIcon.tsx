import Svg, { SvgProps, Path } from "react-native-svg";

const GhostIcon = (props: SvgProps) => (
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
		<Path d="M9 16c.85-.63 1.885-1 3-1s2.15.37 3 1m-5.5-5.5V10m5 .5V10" />
		<Path d="M3 18.562v-6.518C3 7.05 7.03 3 12 3s9 4.05 9 9.044v6.517c0 1.162-.967 2.519-2 2-.835-.42-2.223-.52-3 0-.874.585-2.126.585-3 0-.885-.593-1.649-.57-2.5 0-.874.585-2.126.585-3 0-.777-.52-1.665-.42-2.5 0-1.033.519-2-.838-2-2" />
	</Svg>
);

export default GhostIcon;
