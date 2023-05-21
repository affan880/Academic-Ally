import LottieView from 'lottie-react-native';
import { Button, Text } from 'native-base';
import React, { useMemo } from 'react';
import { ActivityIndicator, Dimensions, Modal, StatusBar, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setCustomLoader } from '../../redux/reducers/userState';

const { width, height } = Dimensions.get('window');

const ResourceLoader = () => {
  const loading = useSelector((state) => state.userState.resourceLoader);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <Modal
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      transparent={true}
      visible={loading}
      style={{ flex: 1, width: '100%', height: height }} 
    >
      {/* <StatusBar backgroundColor="#fff" barStyle="light-content" /> */}
     <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: theme.colors.secondary,
      }}>
      <LottieView
        source={require('../../assets/lottie/loading-doc.json')}
        autoPlay
        loop
      />
      <LottieView
        style={{position: 'absolute', bottom: 0, marginTop: height/2.5}}
        source={require('../../assets/lottie/loading-text.json')}
        autoPlay
        loop
      />
    </View>
    </Modal>
  );
};

export default ResourceLoader;
