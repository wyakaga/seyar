import Svg, { SvgProps, Path } from "react-native-svg";

const XIcon = (props: SvgProps) => (
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
    <Path d="M18 6 6 18M6 6l12 12" />
  </Svg>
);

export default XIcon;
