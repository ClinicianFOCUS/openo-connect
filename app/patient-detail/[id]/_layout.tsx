import { Tabs, useLocalSearchParams } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  const { id } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Detail",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "reader" : "reader-outline"}
              color={color}
            />
          ),
        }}
        initialParams={{ id }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "camera" : "camera-outline"}
              color={color}
            />
          ),
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "calendar" : "calendar-outline"}
              color={color}
            />
          ),
        }}
        initialParams={{ id }}
      />
    </Tabs>
  );
}
