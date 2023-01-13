import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from './screens/OrdersScreen';
import MenuScreen from './screens/MenuScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator useLegacyImplementation initialRouteName='Orders'>
            <Stack.Screen name="Orders" component={OrdersScreen}/>
            <Stack.Screen name="Menu" component={MenuScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}