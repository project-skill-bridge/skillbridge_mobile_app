import { Pressable, StyleSheet } from "react-native"
import type { TabBarButtonProps } from "@/src/types/type"
import { Icons } from "@/src/constants/Icons"

const TabBarButton = ({ onPress, routeName, onLongPress }: TabBarButtonProps) => {
  const iconMapping: Record<string, JSX.Element> = {
    home: <Icons.House color="white" />,
    profile: <Icons.CircleUser color="white" />,
    progress: <Icons.ChartLine color="white" />,
    settings: <Icons.Settings color="white" />,
    streak: <Icons.Flame color="white" />,
  }

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabBarItem}>
      {iconMapping[routeName]}
    </Pressable>
  )
}