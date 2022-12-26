import { Text, View, StatusBar, Image, Alert, TouchableOpacity} from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import React, { FC, useMemo, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import createStyles from './styles'
import { LOGINILLUSTRATION } from '../../../assets'
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput'
import { CustomBtn, NavBtn} from '../../../components/CustomFormComponents/CustomBtn'
import Form from '../../../components/Forms/form'
import { LoginvalidationSchema } from '../../../utilis/validation'
import { logIn, forgotPassword, getCurrentUser, logOut, ResendVerification } from '../../../Modules/auth/firebase/firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
interface IProps {
    navigation: NavigationProp<ParamListBase>
}

const LoginScreen: React.FC<IProps> = ({ navigation }) => {
  const formRef: any = useRef();
  // console.log(formRef.current.values)
    const styles = useMemo(() => createStyles(), []);
    const initialValues = { 
        email: '',
        password: ''
  }
  
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
            ResendVerification(formRef.current.values.email, formRef.current.values.password)
           },
          style: 'cancel',
        },
      ]);
    }
  }

  const forgotPasswordHandler = (): void => {
    forgotPassword(formRef.current.values.email);
    Alert.alert('Password reset link has been sent to your email',
      'Please check your email and follow the instructions to reset your password',
      [
        { text: 'OK' },

      ],
      { cancelable: false }
    );
  }

  return (
      <View style={styles.container} >
          <StatusBar
              animated={true}
              translucent={true}
              backgroundColor={'transparent'}
          />
          <LinearGradient colors={['#1A6B6B', '#A094E3']}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.LinearGradient}
          >
            <KeyboardAwareScrollView  style={{flex: 1}}>
              <Image source={LOGINILLUSTRATION} style={styles.rocketIcon} />
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.loginText}>Please, Log In.</Text>
              <View style={styles.inputContainer}>
            <Form initialValues={initialValues} innerRef = {formRef} validationSchema={LoginvalidationSchema} onSubmit={(values) => 
                       logIn(values.email, values.password)
                   } >
                    <CustomTextInput leftIcon="user" placeholder="email" name='email' />
                    <CustomTextInput leftIcon="lock" placeholder="Password" handlePasswordVisibility name="password" />
              <TouchableOpacity style={styles.formContainer} touchSoundDisabled={false} >
                    <Text onPress={() => forgotPasswordHandler()} style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
                    <CustomBtn title="Log In" color="#19647E" />
                    <Text style={styles.orText} >Or</Text>
                    <View style={styles.CreatAccount}>
                      <NavBtn title="Create an Account" onPress={() => { navigation.navigate('SignUpScreen') }} color="#A094E3" />
                    </View>  
                  </Form>
              </View>
            </KeyboardAwareScrollView>
          </LinearGradient>
      </View>
  )
}

export default LoginScreen;