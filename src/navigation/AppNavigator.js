/**
 * AppNavigator
 * Manages app navigation structure
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import MapSnapshotScreen from '../screens/MapSnapshotScreen';
import ThreeDViewScreen from '../screens/ThreeDViewScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Map Drawing' }}
        />
        <Stack.Screen 
          name="MapSnapshot" 
          component={MapSnapshotScreen}
          options={{ title: 'Capturing Map...' }}
        />
        <Stack.Screen 
          name="ThreeDView" 
          component={ThreeDViewScreen}
          options={{ title: '3D View' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

