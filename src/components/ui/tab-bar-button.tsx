import * as React from "react";
import { Pressable, StyleSheet } from "react-native";
import { TabBarButtonProps } from "@/src/types/type";
import { Icons } from "@/src/constants/Icons";

const TabBarButton = ({
  onPress,
  routeName,
  onLongPress,
}: TabBarButtonProps) => {
  const iconMapping: Record<string, JSX.Element> = {
    home: <Icons.House color="white" />,
    progress: <Icons.ChartLine color="white" />,
    forum : <Icons.MessageSquare color="white" />,
    settings: <Icons.Settings color="white" />,
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      {iconMapping[routeName]}
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
