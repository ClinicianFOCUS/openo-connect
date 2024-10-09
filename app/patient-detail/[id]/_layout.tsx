import { Tabs, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

/**
 * TabLayout component renders a tab navigation layout with three tabs: Detail, Camera, and Appointments.
 * Each tab is configured with a title and an icon that changes based on whether the tab is focused.
 * The `id` parameter is passed to each tab screen as an initial parameter.
 *
 * @returns {JSX.Element} The rendered tab layout component.
 */
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
          title: 'Detail',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'reader' : 'reader-outline'}
              color={color}
            />
          ),
        }}
        initialParams={{ id }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'camera' : 'camera-outline'}
              color={color}
            />
          ),
        }}
        initialParams={{ id }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'calendar' : 'calendar-outline'}
              color={color}
            />
          ),
        }}
        initialParams={{ id }}
      />
    </Tabs>
  );
}
