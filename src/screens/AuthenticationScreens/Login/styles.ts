import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');

const createStyles = () =>
  StyleSheet.create({
    container: {
      height: height,
    },
    LinearGradient: {
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    rocketIcon: {
      width: width * 0.6,
      height: height * 0.30,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    title: {
      color: '#F1F1FA',
      fontSize: 15,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
    LoginBtn: {
      backgroundColor: '#161719',
      width: 150,
      height: 200,
      borderRadius: 16,
      elevation: 8,
    },
    LoginBtnText: {
      color: '#F1F1FA',
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
      top: 80,
    },
    SignUp: {
      backgroundColor: '#DDCECD',
      width: 150,
      height: 200,
      borderRadius: 16,
      elevation: 8,
    },
    welcomeText: {
      fontWeight: '100',
      fontSize: 16,
      color: '#161719',
      alignSelf: 'center',
      lineHeight: 37,
      textAlign: 'center',
    },
    loginText: {
      fontWeight: '900',
      fontSize: 30,
      color: '#161719',
      alignSelf: 'center',
      lineHeight: 41,
      textAlign: 'center',
      paddingVertical:15
    },
    inputContainer: {
      alignItems: 'center',
      backgroundColor: '#F1F1FA',
      flex: 1,
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 30,
    },
    input: {
      backgroundColor: '#F1F1FA',
      width: 342,
      height: 60,
      borderRadius: 20,
      elevation: 8,
      paddingLeft: 20,
      marginTop: 10,
      alignItems: 'center',
      flexDirection: 'row',
    },
    formContainer: {
      alignSelf: 'flex-end',
    },
    forgotPasswordText: {
      fontWeight: '300',
      fontSize: 14,
      color: '#161719',
      lineHeight: 37,
      marginRight: 10
    },
    CreatAccount: {
      marginTop: 20
    },
    orText: {
      fontWeight: '400',
      fontSize: 12, 
      color: '#F1F1FA',
      lineHeight: 37,
      alignSelf: 'center',
      marginTop: 5,
    },
  });

export default createStyles;
