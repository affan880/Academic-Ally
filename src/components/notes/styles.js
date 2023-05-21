import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const createStyles = (theme, sizes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
    },
    headerContainer: {
      height: height * 0.15,
      width: width,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexDirection: 'row',
      paddingHorizontal: height * 0.02,
      position: 'relative',
      paddingBottom: height * 0.02,
    },
    body: {
      flex: 1,
      backgroundColor: theme.quaternary,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      width: width,
      justifyContent: 'space-around',
    },
    bodyContent: {
      flex: 1,
      justifyContent: 'space-around',
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    categoryBtns: {
      width: width * 0.4,
      height: height * 0.25,
      backgroundColor: '#fff',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 0,
      marginVertical: 10,
      //change btn position on hover
      transform: [{ scale: 1 }],
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    categoryBtnClicked: {
      transform: [{ scale: 1.1 }],
      borderColor: theme.primary,
      borderWidth: 2,
    },
    selectBtn: {
      width: width,
      height: height * 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 120,
    },
    btnText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#161719',
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 10,
    },
    disabledBtn: {
      width: width * 0.4,
      height: height * 0.25,
      backgroundColor: '#D3D3D3',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 0,
      marginVertical: 10,
      //change btn position on hover
      transform: [{ scale: 1 }],
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 3.84,
      elevation: 2,
    },
    disabledBtnClicked: {
      transform: [{ scale: 1.1 }],
      borderColor: '#FF8181',
      borderWidth: 2,
      backgroundColor: '#fff',
    },

    notesContainer: {
      alignItems: 'center',
      marginTop: height * 0.02,
      width: width / 1.1,
      height: height / 4.3,
      alignSelf: 'center',
      borderRadius: 10,
      marginBottom: height * 0.02,
      backgroundColor: theme.primary,
    },
    reccomendationStyle: {
      width: width / 1.1,
      height: "75%",
      backgroundColor: theme.quaternary,
      borderRadius: 10,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    containerText: {
      fontSize: sizes.title,
      color: theme.primaryText,
      fontWeight: 'bold',
      backgroundColor: 'rgba(255, 255, 255, 0.17)',
      width: 30,
      height: 30,
      borderRadius: 50,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: '45deg' }],
    },
    containerBox: {
      backgroundColor: theme.tertiary,
      width: height * 0.1,
      height: height * 0.1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      shadowColor: '#000',
    },
    subjectName: {
      fontSize: theme.title,
      fontWeight: '700',
      color: theme.primaryText,
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
      width: '90%',
    },
    subjectContainer: {
      width: width / 1.1,
      height: height / 7,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      shadowColor: '#000',
      borderRadius: 10,
      paddingHorizontal: height * 0.02,
    },
    header: {
      width: width,
      height: height * 0.08,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    headerText: {
      fontSize: sizes.title,
      fontWeight: 'bold',
      color: theme.primaryText,
      textDecorationLine: 'underline',
    },
    cardOptions: {
      width: '100%',
      height: height * 0.06,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: width * 0.05,
    },
    cardOptionContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    cardOptionText: {
      color: theme.white,
      fontSize: sizes.subtitle,
      fontWeight: '600',
      paddingRight: 5,
    }

  });

export default createStyles;
