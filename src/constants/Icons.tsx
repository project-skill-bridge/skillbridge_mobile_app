import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "./Theme";
import { Image } from "react-native";
import { images } from "./Images";

export const icons = {
  home: <FontAwesome6 name="house" size={24} color="white" />,
  progress: <FontAwesome6 name="chart-line" size={24} color="white" />,
  profile: <FontAwesome6 name="circle-user" size={24} color="white" />,
  settings: <FontAwesome6 name="gear" size={24} color="white" />,
  check: <FontAwesome name="check" size={24} color="black" />,
  person: (
    <FontAwesome5 name="user" size={22} color={theme.colors.primaryText} />
  ),
  email: (
    <FontAwesome6 name="envelope" size={22} color={theme.colors.primaryText} />
  ),
  mobile: (
    <Octicons name="device-mobile" size={22} color={theme.colors.primaryText} />
  ),
  lock: (
    <MaterialIcons
      name="lock-outline"
      size={24}
      color={theme.colors.primaryText}
    />
  ),
  eyeOff: (
    <Ionicons
      name="eye-off-outline"
      size={24}
      color={theme.colors.primaryText}
    />
  ),
  eye: (
    <Ionicons name="eye-outline" size={24} color={theme.colors.primaryText} />
  ),
  google: <Image source={images.google} resizeMode="contain" />,
} as const;
