import { Image, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { theme } from "@/src/constants/Theme";
import { icons } from "@/src/constants/Icons";

interface TabIconProps {
  focused: boolean;
  icon: any;
}

const TansLayout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 78,
          paddingBottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          overflow: "hidden",
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.chart} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.profile} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.settings} />
          ),
        }}
      />
    </Tabs>
  );
};

const TabIcon = ({ focused, icon }: TabIconProps) => (
  <View
    style={[
      styles.tabIconContainer,
      focused && { backgroundColor: theme.colors.secondary },
    ]}
  >
    <View
      style={[
        styles.tabIconImageContainer,
        focused && { backgroundColor: theme.colors.secondary },
      ]}
    >
      <Image
        source={icon}
        tintColor="white"
        resizeMode="contain"
        style={styles.icon}
      />
    </View>
  </View>
);

export default TansLayout;

const styles = StyleSheet.create({
  tabIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  tabIconImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    width: 12,
    height: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
