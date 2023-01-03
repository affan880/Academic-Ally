import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = () =>
    StyleSheet.create({
        body: {
            backgroundColor: '#F1F1FA',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginBottom:10
        },
        reccomendationContainer: {
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            width: width / 1.1,
            height: height / 7,
            alignSelf: "center",
            borderRadius:10
        },
        reccomendationStyle: {
            width: width / 1.1,
            height: height / 7,
            backgroundColor: '#FCFCFF',
            borderColor: '#0000000',
            borderRadius: 10,
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        containerText: {
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255, 255, 255, 0.17)',
            width: 30,
            height: 30,
            borderRadius: 20,
            textAlign: 'center',
            textAlignVertical: 'center',
            position: 'absolute',
        },
        container: {
            backgroundColor: '#FF8181',
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            shadowColor: "#000",
        },
        subjectContainer: {
            width: width / 1.1,
            height: height / 7,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            shadowColor: "#000",
            borderRadius: 10,
            paddingHorizontal: 15,
        },
        subjectName: {
            fontSize: 18,
            fontWeight: '700',
            color: '#161719',
            fontFamily: 'DM Sans',
            fontStyle: "normal",
        }
    })

export default createStyles;