import LottieView from 'lottie-react-native';
import { ScrollView, Toast } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

import { LOGINILLUSTRATION } from '../../assets';
import { CustomBtn, NavBtn } from '../../components/CustomFormComponents/CustomBtn';
import { CustomTextInput } from '../../components/CustomFormComponents/CustomTextInput';
import Form from '../../components/Forms/form';
import CustomLoader from '../../components/loaders/CustomLoader';
import NavigationService from '../../services/NavigationService';
import { LoginvalidationSchema } from '../../utilis/validation';
import AuthAction from './authActions';
import LoginScreen from './Login/LoginScreen';
import createStyles from './Login/styles';
import SignUpScreen from './SignUp/SignUpScreen';

const { width, height } = Dimensions.get('window');

const AuthScreen: React.FC = () => {
  const styles = useMemo(() => createStyles(), []);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [mode, setMode] = useState('logIn');

  const illustrationScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8], // Modify these values as needed
  });

  const illustrationWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.6, width * 0.3], // Modify these values as needed
  });

  const illustrationHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.4, height * 0.2], // Modify these values as needed
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: mode === 'logIn' ? 0 : 1,
      duration: 800, // Increase the duration to slow down the animation
      useNativeDriver: false,
    }).start();
  }, [mode]);
  return (
    <>
      <CustomLoader />
      <Animated.View style={[styles.container]}>
        <StatusBar animated={true} translucent={true} backgroundColor={'#6360FF'} />
        <View style={{ backgroundColor: '#6360FF', flex: 1 }}>
          <Animated.View style={{ flex: 1 }}>
            <Animated.View
              style={{
                alignSelf: 'center',
                height: illustrationHeight,
                width: illustrationWidth,
                marginBottom: 15
              }}
            >
              <LottieView
                style={{
                  height: '100%',
                  width: '100%',
                }}
                source={require('../../assets/lottie/hat.json')}
                autoPlay
                loop
              />
            </Animated.View>
            <Animated.View style={styles.inputContainer}>
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {mode === 'logIn' ? <LoginScreen onPress={() => setMode('signIn')} /> : <SignUpScreen onPress={() => setMode('logIn')} />}
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>
    </>
  );
};


export default AuthScreen