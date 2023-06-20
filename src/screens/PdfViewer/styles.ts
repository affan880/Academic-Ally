import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');
const createStyles = (theme: any, sizes: any, isPotrait: any) =>
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
      paddingHorizontal: 20,
      position: 'relative',
      paddingBottom: 20,
    },
    body: {
      flex: 1,
      backgroundColor: theme.secondary,
      borderTopLeftRadius: isPotrait ? 40 : 0,
      borderTopRightRadius: isPotrait ? 40 : 0,
    },
    pdf: {
      width: '100%',
      height: '100%',
    },
  });

export default createStyles;
