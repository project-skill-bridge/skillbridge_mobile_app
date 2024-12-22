import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const icons = {
  home: <FontAwesome6 name="house" size={24} color="black" />,
  chart: <FontAwesome6 name="chart-line" size={24} color="black" />,
  profile: <FontAwesome6 name="circle-user" size={24} color="black" />,
  settings: <FontAwesome6 name="gear" size={24} color="black" />,
  check: <FontAwesome name="check" size={24} color="black" />,
} as const;
