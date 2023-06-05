import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Toast } from 'native-base';
import React, { useMemo, useRef } from 'react';
import { Alert, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';

import { LOGINILLUSTRATION } from '../../../assets';
import { CustomBtn, NavBtn } from '../../../components/CustomFormComponents/CustomBtn';
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput';
import Form from '../../../components/Forms/form';
import CustomLoader from '../../../components/loaders/CustomLoader';
import { forgotPassword, getCurrentUser, logIn, ResendVerification } from '../../../Modules/auth/firebase/firebase';
import { setCustomLoader } from '../../../redux/reducers/userState';
import NavigationService from '../../../services/NavigationService';
import { LoginvalidationSchema } from '../../../utilis/validation';
import createStyles from './styles';

interface IProps {
  navigation: NavigationProp<ParamListBase>;
}

const LoginScreen: React.FC<IProps> = ({ navigation }) => {
  const formRef: any = useRef();
  const styles = useMemo(() => createStyles(), []);
  const initialValues = { email: '', password: '' };
  const dispatch = useDispatch();

  const userLogin = (email: string, password: string): void => {
    logIn(email, password);
    const currentUser: any = getCurrentUser();
    if (currentUser?.emailVerified === false) {
      Alert.alert('Error', 'Please Verify Your Email, Before Login', [
        {
          text: 'Ok',
          onPress: () => { },
        },
        {
          text: 'Resend Verification Email',
          onPress: () => {
            ResendVerification(
              formRef.current.values.email,
              formRef.current.values.password,
            );
          },
          style: 'cancel',
        },
      ]);
    }
  };

  const forgotPasswordHandler = (): void => {
    if (formRef.current && formRef.current.errors?.email) {
      Toast.show({
        title: 'Please Enter a Valid Email',
        duration: 4000,
        backgroundColor: '#FF0101',
      });
    } else {
      forgotPassword(formRef.current.values.email);
      Toast.show({
        title: 'Password Reset Email Sent',
        description: 'Please Check Your Email',
        duration: 4000,
        backgroundColor: '#6360ff',
      });
    }
  };

  return (
    <>
      <CustomLoader />
      <View style={styles.container}>
        <StatusBar
          animated={true}
          translucent={true}
          backgroundColor={'transparent'}
        />
        <LinearGradient
          colors={['#6360ff', '#FF8181']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.LinearGradient}>
          <KeyboardAwareScrollView style={{ flex: 1 }}>
            <Image source={LOGINILLUSTRATION} style={styles.rocketIcon} />
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.loginText}>Please, Log In.</Text>
            <View style={styles.inputContainer}>
              <Form
                initialValues={initialValues}
                innerRef={formRef}
                validationSchema={LoginvalidationSchema}
                onSubmit={values => {
                  dispatch(setCustomLoader(true));
                  logIn(values.email, values.password, dispatch)
                }}>
                <CustomTextInput
                  leftIcon="user"
                  placeholder="Email"
                  name="email"
                />
                <CustomTextInput
                  leftIcon="lock"
                  placeholder="Password"
                  handlePasswordVisibility
                  name="password"
                />
                <TouchableOpacity
                  style={styles.formContainer}
                  touchSoundDisabled={false}>
                  <Text
                    onPress={() => {
                      if (formRef.current.values.email) {
                        forgotPasswordHandler();
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
                <CustomBtn title="Log In" color="#6360FF" />
                <Text style={styles.orText}>Or</Text>
                <View style={styles.CreatAccount}>
                  <NavBtn
                    title="Create an Account"
                    onPress={() => {
                      NavigationService.navigate(NavigationService.screens.SignUp);
                    }}
                    color="#FF8181"
                  />
                </View>
              </Form>
            </View>
          </KeyboardAwareScrollView>
        </LinearGradient>
      </View>
    </>
  );
};

export default LoginScreen;
