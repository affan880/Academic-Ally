import { Button, Text } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal, Dimensions, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCustomLoader } from '../../redux/reducers/userState';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const ResourceLoader = () => {
  const loading = useSelector((state) => state.userState.resourceLoader);
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
        backgroundColor: '#fff',
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
  },
});

export default ResourceLoader;
