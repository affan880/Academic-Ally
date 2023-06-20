import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');
const createStyles = (theme: any, sizes: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
    },
    headerContainer: {
      height: height * 0.08,
      width: width,
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexDirection: 'row',
      position: 'relative',
      paddingBottom: height * 0.02,
    },
    body: {
      flex: 1,
      backgroundColor: theme.secondary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      width: width,
    },
    bodyContent: {
      flex: 1,
      paddingTop: 3,
    },
    header: {
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    headerText: {
      color: theme.white,
      fontWeight: 'bold',
      fontSize: sizes.title,
      flexWrap: 'nowrap',
      marginTop: 2,
      width: '80%',
      textAlign: 'center',
    },
    backBtn: {
      width: height * 0.05,
      height: height * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default createStyles;
