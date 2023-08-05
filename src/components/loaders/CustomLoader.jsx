import { Button, Text } from 'native-base';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, StatusBar, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setCustomLoader } from '../../redux/reducers/userState';

const { width, height } = Dimensions.get('window');

const CustomLoader = () => {
  const loading = useSelector((state) => state.userState.customLoader);
  const dispatch = useDispatch();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={loading}
      style={{ flex: 1, width: '100%', height: height }} 
    >
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.8)" barStyle="light-content" />
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F1F1FA" />
        {/* <Button 
          style={{ marginTop: 100, backgroundColor: '#F1F1FA', width: 100, justifyContent: 'center', borderRadius: 10 }}
          onPress={() => dispatch(setCustomLoader(false))}
        >
          <Text>Close</Text>
        </Button> */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
  },
});

export default CustomLoader;
