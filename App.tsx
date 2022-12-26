import 'react-native-gesture-handler';
import React from 'react';
import Providers from './src/router';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <NavigationContainer>
      <Providers />
    </NavigationContainer>
  );
};

export default App;
