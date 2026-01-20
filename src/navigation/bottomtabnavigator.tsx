import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SavedRoutesScreen from '../screens/SavedRoutesScreen';
import ChatScreen from '../screens/ChatScreen';
import AccountScreen from '../screens/AccountScreen';
import { Colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
        },
        headerStyle: {
          backgroundColor: Colors.yellow,
        },
        headerTintColor: Colors.brown,
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