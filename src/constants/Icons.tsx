import * as React from "react";

import { Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { images } from "./Images";

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = "black" }) => {
  switch (name) {
    case "home":
      return <FontAwesome6 name="house" size={size} color={color} />;
    case "progress":
      return <FontAwesome6 name="chart-line" size={size} color={color} />;
    case "profile":
      return <FontAwesome6 name="circle-user" size={size} color={color} />;
    case "settings":
      return <FontAwesome6 name="gear" size={size} color={color} />;
    case "check":
      return <FontAwesome name="check" size={size} color={color} />;
    case "person":
      return <FontAwesome5 name="user" size={size} color={color} />;
    case "email":
      return <FontAwesome6 name="envelope" size={size} color={color} />;
    case "mobile":
      return <Octicons name="device-mobile" size={size} color={color} />;
    case "lock":
      return <MaterialIcons name="lock-outline" size={size} color={color} />;
    case "eyeOff":
      return <Ionicons name="eye-off-outline" size={size} color={color} />;
    case "eye":
      return <Ionicons name="eye-outline" size={size} color={color} />;
    case "logout":
      return <SimpleLineIcons name="logout" size={size} color={color} />;
    case "edit":
      return <FontAwesome6 name="edit" size={size} color={color} />;
    case "left-arrow":
      return <FontAwesome5 name="angle-left" size={size} color={color} />;
    case "google":
      return (
        <Image
          source={images.google}
          resizeMode="contain"
          style={{ width: size, height: size }}
        />
      );
    default:
      return null;
  }
};

export default Icon;
