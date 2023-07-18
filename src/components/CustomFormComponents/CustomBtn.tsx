import { useFormikContext } from 'formik';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  title: any;
  onPress?: () => any;
  color?: string;
  width?: any;
};

const screenWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const CustomBtn = ({ title, onPress, color, width }: Props) => {
  const { handleSubmit } = useFormikContext();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, width && { width: width }]}
      onPress={handleSubmit}
      onMagicTap={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const NavBtn = ({ title, onPress, color, width }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }, width && { width: width }]}
      onPress={onPress}
      onMagicTap={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: screenWidth - 50,
    height: height * 0.07,
    borderRadius: 10,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '900',
    fontSize: 16,
    color: '#fff',
    lineHeight: 37,
  },
});
