import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/homescreen';
import SavedRoutesScreen from '../screens/savedroutes';
import ChatScreen from '../screens/chatscreens';
import AccountScreen from '../screens/account';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
        },
        headerStyle: {
          backgroundColor: colors.yellow,
        },
        headerTintColor: colors.brown,
      }}
    >
      <Tab.Screen 
        name="Map" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedRoutesScreen}
        options={{
          tabBarLabel: 'Saved',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;