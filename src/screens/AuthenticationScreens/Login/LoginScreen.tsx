import { Toast } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Animated, { useDispatch } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';

import { LOGINILLUSTRATION } from '../../../assets';
import { CustomBtn, NavBtn } from '../../../components/CustomFormComponents/CustomBtn';
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput';
import Form from '../../../components/Forms/form';
import CustomLoader from '../../../components/loaders/CustomLoader';
import NavigationService from '../../../services/NavigationService';
import { LoginvalidationSchema } from '../../../utilis/validation';
import AuthAction from '../authActions';
import createStyles from './styles';

const {width, height} = Dimensions.get('window');

type props = {
  onPress: any
}

const LoginScreen = ({onPress}: props) => {
  const formRef: any = useRef();
  const styles = useMemo(() => createStyles(), []);
  const initialValues = { email: '', password: '' };
  const dispatch: any = useDispatch();


  const signInFields = [
    {
      leftIcon: 'user',
      placeholder:'Email',
      name: 'email',
      id: 1,
      handlePasswordVisibility: false
    },
    {
      leftIcon: 'lock',
      placeholder:'Password',
      name: 'password',
      id: 2,
      handlePasswordVisibility: true
    }
  ]

  const animatedValue = useRef(new Animated.Value(0)).current
  const signInButtons = [
    {
      btn: <CustomBtn title="Log In" color="#6360FF" />,
      id: 1,
    },
    {
      btn: <> 
      <Animated.View style={[styles.CreatAccount, 
      {
        transform: [
          {
            perspective:400
          },
          {
            rotateY: animatedValue.interpolate({
              inputRange: [0, 0.5,1],
              outputRange: ['0deg', '-90deg', '-180deg']
            })
          }, 
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 0.5,1],
              outputRange: [1,8,1]
            })
          }
        ]
      }
      ]}>
      <TouchableOpacity
      style={[{ backgroundColor: "#FF8181",    
      width: width - 50,
      height: height * 0.07,
      borderRadius: 10,
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center', }]}
      onPress={() => {
        // NavigationService.navigate(NavigationService.screens.SignUp);
        onPress()
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false
        }).start()
      }}>
      <Text style={{fontWeight: '900',
        fontSize: 16,
        color: '#fff',
        lineHeight: 37,}}>
          Create an Account</Text>
    </TouchableOpacity>
      </Animated.View></>,
      id: 2,
    },
  ]

  return (
    <>
      <Text style={styles.loginText}>Please, Log In.</Text>
      <Form
        initialValues={initialValues}
        innerRef={formRef}
        validationSchema={LoginvalidationSchema}
        onSubmit={values => {
          dispatch(AuthAction.signIn(values.email, values.password))
        }}>
          {
            signInFields.map((item: any) =>(
              <View key={item?.id}>
                <CustomTextInput
                  leftIcon={item?.leftIcon}
                  placeholder={item?.placeholder}
                  name={item?.name}
                />
              </View>
            ))
          }
        <TouchableOpacity
          style={styles.formContainer}
          touchSoundDisabled={false}>
          <Text
            onPress={() => {
              if (formRef.current.values.email) {
                AuthAction.forgotPasswordHandler(formRef);
              } else {
                Toast.show({
                  title: 'Please Enter a Valid Email',
                  duration: 4000,
                  backgroundColor: '#FF0101',
                });
              }
            }}
            style={styles.forgotPasswordText}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <View>
            {
              signInButtons.map((item)=>(
                <View key={item?.id} style={{
                  position: 'relative'
                }} >
                  {item.btn}
                </View>
              ))
            }
        </View>
      </Form>
    </>
  );
};

export default LoginScreen;
