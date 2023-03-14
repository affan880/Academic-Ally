import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

const createStyles = (theme: string, sizes:string) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            width: '100%',
            height: '100%'
        },
        LinearGradient: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        studyIcon: {
            top: 50,
            width: 320,
            height: 320,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        title: {
            color: '#fff',
            fontSize: 15,
            fontWeight: 'bold',
            margin: height * 0.02
        },
        buttonContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        LoginBtn: {
            backgroundColor: '#000000',
            width: 150,
            height: 200,
            borderRadius: 16,
            elevation: 8,
        },
        LoginBtnText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            alignSelf: 'center',
            top: 80
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
            color: '#fff',
            alignSelf: 'center',
            marginTop: 15,
            lineHeight: 37,
            textAlign: 'center'
        },
        loginText: {
            fontWeight: '900',
            width: 600,
            fontSize: 34,
            color: '#fff',
            alignSelf: 'center',
            lineHeight: 41,
            textAlign: 'center'
        },
        inputContainer: {
            width: '100%',
            marginTop: 20,
            alignItems: 'center',
        },
        input: {
            backgroundColor: '#fff',
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
            color: '#fff',
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
            color: '#fff',
            lineHeight: 37,
        },
        orText: {
            fontWeight: '100',
            fontSize: 12,
            color: '#fff',
            lineHeight: 37,
            alignSelf: 'center',
            marginTop: 10,
        },
        createButton: {
            backgroundColor: "#000000",
            width: 342,
            height: 60,
            borderRadius: 20,
            elevation: 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            opacity: 0.8
        },
        createButtonText: {
            fontWeight: '700',
            fontSize: 16,
            color: '#fff',
            lineHeight: 19,
        },
        LoginButton: {
            marginBottom: 20,
        },
        SignupButton: {
            marginTop: 20,
        },

        disabledIp: {
             width: width - 50,
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: height * 0.02,
            height: height * 0.07,
            backgroundColor: '#FFF',
            borderRadius: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 2,
            flexDirection: 'row',
            paddingLeft: 20,
        },
        gridContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            paddingHorizontal: width * 0.02,
            paddingTop: height * 0.02,
            gridTemplateColumn: "repeat(2, 1fr)",
        },
        gridItem: {
            margin: width * 0.025,
            alignItems: "center",
        },
    }
    )

export default createStyles;