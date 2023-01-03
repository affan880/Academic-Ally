import 'react-native-gesture-handler';
import React from 'react';
import Providers from './src/router';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';

const App = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Providers />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
