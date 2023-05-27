import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { StatusBar } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import BootScreen from './src/screens/Boot/BootScreen';
import NavigationService from './src/services/NavigationService';

import 'react-native-gesture-handler';

const App = () => {
  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide();
    }, 500);
  });
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <NavigationContainer ref={NavigationService.navigationRef} >
          <StatusBar barStyle="light-content" backgroundColor={'#6360FF'} />
          <BootScreen />
        </NavigationContainer>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
