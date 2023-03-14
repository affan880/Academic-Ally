import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const createStyles = (theme:any, sizes:any) =>
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
      paddingBottom: height * 0.025,
    },
    body: {
      flex: 1,
      backgroundColor: theme.secondary,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      width: width,
    },
    bodyContent: {
      flex: 1,
      paddingTop: 10,
    },
    header: {
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    headerText: {
      color: theme.quaternary,
      fontWeight: 'bold',
      fontSize: sizes.title,
      flexWrap: 'nowrap',
      marginTop: 2,
    },
    backBtn: {
      width: height * 0.05,
      height: height * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default createStyles;
