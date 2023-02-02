import 'react-native-gesture-handler';
import React from 'react';
import Providers from './src/router';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { NativeBaseProvider } from "native-base";

const App = () => {
  return (
    <NativeBaseProvider>
    <Provider store={store}>
    <NavigationContainer>
      <Providers />
      </NavigationContainer>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
