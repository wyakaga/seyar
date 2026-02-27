import Svg, { SvgProps, Path } from "react-native-svg";

const WaveIcon = (props: SvgProps) => (
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
		<Path d="m3 5.918 1.764-.887a4.97 4.97 0 0 1 4.472 0l.528.266a4.97 4.97 0 0 0 4.472 0l.528-.266a4.97 4.97 0 0 1 4.472 0L21 5.918M3 10.446l1.764-.888a4.97 4.97 0 0 1 4.472 0l.528.266a4.97 4.97 0 0 0 4.472 0l.528-.266a4.97 4.97 0 0 1 4.472 0l1.764.888M3 14.973l1.764-.888a4.97 4.97 0 0 1 4.472 0l.528.266a4.97 4.97 0 0 0 4.472 0l.528-.266a4.97 4.97 0 0 1 4.472 0l1.764.888M3 19.5l1.764-.887a4.97 4.97 0 0 1 4.472 0l.528.265a4.97 4.97 0 0 0 4.472 0l.528-.265a4.97 4.97 0 0 1 4.472 0L21 19.5" />
	</Svg>
);

export default WaveIcon;
