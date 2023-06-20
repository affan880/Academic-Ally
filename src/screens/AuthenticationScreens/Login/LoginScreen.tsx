import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Toast } from 'native-base';
import React, { useMemo, useRef } from 'react';
import { Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
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

interface IProps {
  navigation: NavigationProp<ParamListBase>;
}

const LoginScreen: React.FC<IProps> = ({ navigation }) => {
  const formRef: any = useRef();
  const styles = useMemo(() => createStyles(), []);
  const initialValues = { email: '', password: '' };
  const dispatch: any = useDispatch();

  const forgotPasswordHandler = (): void => {
    if (formRef.current && formRef.current.errors?.email) {
      Toast.show({
        title: 'Please Enter a Valid Email',
        duration: 4000,
        backgroundColor: '#FF0101',
      });
    } else {
      dispatch(AuthAction.forgotPassword(formRef.current.values.email));
    }
  };

  return (
    <>
      <CustomLoader />
      <View style={styles.container}>
        <StatusBar
          animated={true}
          translucent={true}
          backgroundColor={'#6360FF'}
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
                  dispatch(AuthAction.signIn(values.email, values.password))
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
