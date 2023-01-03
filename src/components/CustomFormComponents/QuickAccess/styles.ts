import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = () =>
    StyleSheet.create({
        categories: {
            width: width / 1.1,
            height: height / 6,
            backgroundColor: '#fff',
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            position: 'relative',
            shadowColor: "#000",
            top: -60,
            zIndex: 1,
            alignSelf: "center",
        },

        itemContainer: {
            width: '22%',
            height: "60%",
            flexDirection: "column",
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        syllabusIconContainer: {
            width: '70%',
            height: '70%',
            backgroundColor: '#FF8181',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        iconLabel: {
            color: '#706f6f',
            fontSize: 12,
            fontWeight: 'bold'
        },
        notesIconContainer: {
            width: '70%',
            height: "70%",
            backgroundColor: '#47682c',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        questionsIconContainer: {
            width: '70%',
            height: "70%",
            backgroundColor: '#2c497f',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        otherResourcesIconContainer: {
            width: '70%',
            height: "70%",
            backgroundColor: '#2f7f4c',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        }
    })

export default createStyles;