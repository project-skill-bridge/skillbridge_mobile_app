import { Pressable, StyleSheet } from "react-native";
import { TabBarButtonProps } from "@/src/types/type";
import { icons } from "@/src/constants/Icons";

const TabBarButton = ({
  onPress,
  routeName,
  onLongPress,
}: TabBarButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      {icons[routeName]}
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
