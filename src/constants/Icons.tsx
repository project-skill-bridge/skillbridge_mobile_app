import { Image } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { theme } from "./Theme";
import { images } from "./Images";

export const icons = {
  home: <FontAwesome6 name="house" size={24} color="white" />,
  progress: <FontAwesome6 name="chart-line" size={24} color="white" />,
  profile: <FontAwesome6 name="user-circle" size={24} color="white" />,
  settings: <FontAwesome6 name="gear" size={24} color="white" />,
  user: (
    <FontAwesome6 name="user" size={24} color={theme.colors.secondaryText} />
  ),
  email: (
    <FontAwesome6
      name="envelope"
      size={24}
      color={theme.colors.secondaryText}
    />
  ),
  mobile: (
    <Octicons
      name="device-mobile"
      size={24}
      color={theme.colors.secondaryText}
    />
  ),
  lock: (
    <MaterialIcons
      name="lock-outline"
      size={24}
      color={theme.colors.secondaryText}
    />
  ),
  eye: <Octicons name="eye" size={24} color={theme.colors.secondaryText} />,
  eyeOff: (
    <Octicons name="eye-closed" size={24} color={theme.colors.secondaryText} />
  ),
  backArrow: <FontAwesome6 name="arrow-left" size={24} color="black" />,
  google: <Image source={images.google} resizeMode="contain" />,
} as const;
