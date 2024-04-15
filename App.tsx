import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { StatusBar } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierWrapper } from 'react-native-notifier';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import AndroidBadge from 'react-native-android-badge';

import store from './src/redux/store';
import BootScreen from './src/screens/Boot/BootScreen';
import NavigationService from './src/services/NavigationService';

import 'react-native-gesture-handler';

AndroidBadge.setBadge(5);

const App = () => {
  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide();
    }, 500);
  });
  const linking = {
    prefixes: ['academically://', 'https://app.getacademically.co/', 'https://getacademically.co'],
    config:{
      screens: {
        Recents: {
          path: 'Recents'
        }
      }
    }
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <SafeAreaView style={{ flex: 1 }}>
        <NativeBaseProvider>
          <Provider store={store}>
          <StatusBar
            backgroundColor={'#6360FF'}
            barStyle="light-content"
          />
            <NavigationContainer ref={NavigationService.navigationRef} linking={linking} >
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
