import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = (theme:any, sizes:any) =>
    StyleSheet.create({
        categories: {
            width: width / 1.1,
            height: height / 6,
            backgroundColor: theme.quaternary,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            position: 'relative',
            shadowColor: "#000",
            top: -height * 0.09,
            zIndex: 1,
            alignSelf: "center",
        },

        itemContainer: {
            width: width / 4.5,
            height: width / 4.5,
            flexDirection: "column",
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        syllabusIconContainer: {
            width: '70%',
            height: '70%',
            backgroundColor: theme.tertiary,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        iconLabel: {
            color: theme.terinaryText,
            fontSize: sizes.textSmall,
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
        },
        selectedIconContainer: {
          transform: [{scale: 1.2}],
          borderColor: '#6360FF',
          borderWidth: 2,
          padding: height * 0.01,
        }
    })

export default createStyles;