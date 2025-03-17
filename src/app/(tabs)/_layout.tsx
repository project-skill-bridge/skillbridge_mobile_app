import * as React from "react";

import { Tabs } from "expo-router";
import TabBar from "@/src/components/ui/tab-bar";

const TabsLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="forum"
        options={{
          title: "forum",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
