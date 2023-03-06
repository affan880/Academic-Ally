import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Modal } from 'react-native';

const CustomLoader = ({ loading }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={loading}
    >
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomLoader;
