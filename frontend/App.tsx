import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/bottomtabnavigator';
import { colors } from './src/theme/colors';

const App = () => {
    return (
        <NavigationContainer>
            <BottomTabNavigator />
        </NavigationContainer>
    );
};

export default App;