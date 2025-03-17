import * as React from "react";
import { BackHandler, Keyboard, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Keyboard, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { hp, wp } from "@/src/utils/common";
import { theme } from "@/src/constants/Theme";
import TabBarButton from "./tab-bar-button";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const [dimensions, setDimensions] = React.useState({ height: 20, width: 10 });
  const [isTabBarVisible, setIsTabBarVisible] = React.useState(true);
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  const buttonWidth = dimensions.width / state.routes.length;
  const tabPositionX = useSharedValue(0);

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  React.useEffect(() => {
    tabPositionX.value = withSpring(buttonWidth * state.index, {
      duration: 1500,
    });
  }, [state.index]);

  

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

   if (!isTabBarVisible || isKeyboardVisible) {
    return null;
  }

  return (
    <View onLayout={onTabBarLayout} style={[styles.tabBar, theme.shadowStyle]}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: theme.colors.secondary,
            borderRadius: 50,
            marginHorizontal: 16,
            height: dimensions.height - 20,
            width: buttonWidth - 32,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            routeName={route.name}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: hp(2.5),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryText,
    marginHorizontal: wp(7),
    paddingVertical: hp(3),
    borderRadius: 100,
  },
});
