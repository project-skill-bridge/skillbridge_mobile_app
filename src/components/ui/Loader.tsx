import * as React from "react";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { theme } from "@/src/constants/Theme";
import { Icons } from "@/src/constants/Icons";
import { LucideProps } from "lucide-react-native";

const AnimatedLoader = Animated.createAnimatedComponent(Icons.Loader);

const Loader = ({ color = theme.colors.primary, ...props }: LucideProps) => {
  const rotate = useSharedValue(0);

  React.useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.inOut(Easing.linear) }),
      -1, // Infinite loop
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  return <AnimatedLoader color={color} {...props} style={animatedStyle} />;
};

export default Loader;
