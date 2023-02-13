import 'react-native-gesture-handler';
import React from 'react';
import Providers from './src/router';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {NativeBaseProvider} from 'native-base';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide();
    }, 1000);
  });
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={'#6360FF'} />
          <Providers />
        </NavigationContainer>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App;
