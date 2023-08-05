import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');
const createStyles = (theme:any, sizes:any) =>
  StyleSheet.create({
    body: {
      backgroundColor: theme.secondary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginBottom: height * 0.02,
    },
    reccomendationContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: height * 0.02,
      width: width / 1.1,
      height: height / 7,
      alignSelf: 'center',
      borderRadius: 10,
    },
    reccomendationStyle: {
      width: '100%',
      height: height / 7,
      backgroundColor: theme.quaternary,
      borderRadius: 10,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    containerText: {
      fontSize: sizes.text,
      color: '#F1F1FA',
      fontWeight: '400',
      backgroundColor: 'rgba(255, 255, 255, 0.17)',
      width: width * 0.08,
      height: width * 0.08,
      borderRadius: 20,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    container: {
      backgroundColor: theme.tertiary,
      width: height * 0.1,
      height: height * 0.1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      shadowColor: '#161719719',
    },
    subjectContainer: {
      width: width / 1.1,
      height: height / 7,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      shadowColor: '#161719719',
      borderRadius: 10,
      paddingHorizontal: width * 0.02,
    },
    subjectName: {
      fontSize: sizes.title,
      fontWeight: '700',
      color: theme.primaryText,
      fontFamily: 'DM Sans',
      fontStyle: 'normal',
    },
    subjectCategory: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: height * 0.01,
    },
    main:{
      width: width * 0.6,
      height: '100%',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
      margin: height * 0.006,
      paddingVertical: height * 0.01,
    },
    subjectCategoryText: {color: theme.terinaryText, fontSize: sizes.textSmall, fontWeight: '700'},
    subjectCategoryCheckIcon: {color: theme.greenSuccess},
    subjectCategoryUnCheckIcon: {color: theme.redError},
  });

export default createStyles;
