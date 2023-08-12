import LottieView from 'lottie-react-native';
import { Button, Text } from 'native-base';
import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, Modal, StatusBar, StyleSheet, View } from 'react-native';
import { color } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import { setCustomLoader } from '../../redux/reducers/userState';

const {width, height} = Dimensions.get('window');

const ResourceLoader = () => {
  const loading = useSelector(state => state.userState.resourceLoader);
  const theme = useSelector(state => state.theme);

  return (
    <Modal
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      transparent={true}
      visible={loading}
      style={{flex: 1, width: '100%', height: height}}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundColor: theme.colors.secondary,
        }}>
        {theme.theme !== 'dark' ? (
          <LottieView
            source={require('../../assets/lottie/loading-doc-light.json')}
            autoPlay
            loop
          />
        ) : (
          <LottieView
            source={require('../../assets/lottie/loading-doc.json')}
            autoPlay
            loop
          />
        )}
        <LottieView
          style={{
            position: 'absolute',
            width: 100,
            bottom: 80,
          }}
          source={require('../../assets/lottie/loading-text.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};

export default ResourceLoader;
