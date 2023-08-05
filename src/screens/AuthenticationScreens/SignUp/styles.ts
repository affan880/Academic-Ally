import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');
const createStyles = () =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    LinearGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    studyIcon: {
      width: width * 0.6,
      height: height * 0.30 ,
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
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
      width: '100%',
      color: '#161719'
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
      width: '100%',
      marginTop: 20,
      alignItems: 'center',
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
    forgotPasswordText: {
      fontWeight: '100',
      fontSize: 12,
      color: '#F1F1FA',
      lineHeight: 37,
      alignSelf: 'flex-end',
      marginRight: 25,
    },
    loginButton: {
      backgroundColor: '#19647E',
      width: 342,
      height: 60,
      borderRadius: 20,
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    loginButtonText: {
      fontWeight: '900',
      fontSize: 16,
      color: '#F1F1FA',
      lineHeight: 37,
    },
    orText: {
      fontWeight: '100',
      fontSize: 12,
      color: '#F1F1FA',
      lineHeight: 37,
      alignSelf: 'center',
      marginTop: 10,
    },
    createButton: {
      backgroundColor: '#161719',
      width: 342,
      height: 60,
      borderRadius: 20,
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      opacity: 0.8,
    },
    createButtonText: {
      fontWeight: '700',
      fontSize: 16,
      color: '#F1F1FA',
      lineHeight: 19,
    },
    LoginButton: {
      marginBottom: 40,
    },
    SignupButton: {
      marginVertical: 20,
    },
  });

export default createStyles;
