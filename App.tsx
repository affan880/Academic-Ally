import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <GestureHandlerRootView style={{ flex: 1 }} >
      <SafeAreaView style={{ flex: 1 }}>
        <NativeBaseProvider>
          <Provider store={store}>
            <NavigationContainer ref={NavigationService.navigationRef} >
              <NotifierWrapper>
                <BootScreen />
              </NotifierWrapper>
            </NavigationContainer>
          </Provider>
        </NativeBaseProvider>
      </SafeAreaView>
    </GestureHandlerRootView>

  );
};

export default App;
