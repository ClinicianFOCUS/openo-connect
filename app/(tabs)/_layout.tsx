import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

/**
 * TabLayout component renders the tab navigation for the application.
 * It uses the Tabs component from expo-router to define the tab screens.
 *
 * @returns {JSX.Element} The rendered TabLayout component.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all tabs
      }}
    >
      {/* Home tab screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home', // Title for the Home tab
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'} // Icon changes based on focus state
              color={color} // Color of the icon
            />
          ),
        }}
      />
      {/* Setting tab screen */}
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting', // Title for the Setting tab
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'settings' : 'settings-outline'} // Icon changes based on focus state
              color={color} // Color of the icon
            />
          ),
        }}
      />
    </Tabs>
  );
}
