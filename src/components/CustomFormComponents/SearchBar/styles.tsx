import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const createStyles = () =>
    StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: screenWidth * 0.9,
        height: screenHeight * 0.07,
        marginTop: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        }   
    },
    leftIcon: {
        height: 20,
        width: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    input: {
        height: 60,
        width: '78%',
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular'
    },

    })
export default createStyles;