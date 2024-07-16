import { Dimensions, StyleSheet } from 'react-native';

const {width, height} = Dimensions.get('window');
const createStyles = (theme: any, sizes: any, isPotrait: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
    },
    headerContainer: { 
      height: sizes.height * 0.07,
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexDirection: 'row',
      paddingHorizontal: 20,
      position: 'relative',
      paddingBottom: 15,
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
