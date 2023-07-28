import { Dimensions, StyleSheet } from 'react-native';

const width = (number: any) => {
  let fullWidth = Dimensions.get("window").width;
  if (number >= 100) return fullWidth;
  else if (number <= 0) return 0;
  else return fullWidth * (number / 100);
};
const height = (number: any) => {
  let fullHeight = Dimensions.get("window").height;
  if (number >= 100) return fullHeight;
  else if (number <= 0) return 0;
  else return fullHeight * (number / 100);
};
export { height, width };
const createStyles = (theme: any, sizes: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    container: {
      paddingHorizontal: width(2),
      position: 'absolute',
      bottom: 0,
      zIndex: 0,
      alignSelf:'baseline',
      // backgroundColor: 'red',
      overflow: 'hidden',
      width: width(100),
    },
    avatarImg: {
      height: height(5),
      width: height(5),
      borderRadius: height(4),
      marginTop: height(2)
    },
    avatarImg2: {
      height: height(5),
      width: height(5),
      borderRadius: height(4),
      marginLeft: width(2)
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    mssgImage: {
      height: height(15),
      width: height(15),
    },
    textContainer: {
      paddingHorizontal: width(4),
      paddingVertical: height(1.5),
    },
    contentContainer: {
      paddingTop: height(2),
    },
  
    ///////MESSAGE STYLES
    mssgContainer: {
      backgroundColor: theme.mainTheme,
      maxWidth: width(72),
      // alignSelf: 'baseline',
      borderRadius: width(4),
      marginLeft: width(2),
      marginVertical: height(2),
    },
    mssgTimeText: {
      color: theme.white,
      fontSize: width(2.8),
      marginTop: height(1),
    },
    mssgText: {
      color: theme.black,
      fontSize: width(3.7),
      fontWeight: '300',
    },
    /////////
    //////MY MESSAGE
    myMssgContainer: {
      backgroundColor: theme.tertiary,
      maxWidth: width(72),
      borderRadius: width(4),
      marginRight: width(2),
      marginVertical: height(2),
    },
    myMssgText: {
      color: theme.white,
      fontSize: width(3.7),
      fontWeight: '100',
    },
    container2: {
      backgroundColor: theme.white,
      width: width(100),
      height: height(9),
      justifyContent: 'center',
      alignItems: 'center',
      // shadowColor: AppColors.grey,
      // shadowOffset: {width: 0, height: 3},
      // shadowOpacity: 0.22,
      // shadowRadius: 2.22,
  
      // elevation: 3,
    },
    chatHeader: {
      width: width(100),
      flexDirection: 'row',
      zIndex: 1,
      backgroundColor: theme.white,
      height: height(8),
      alignItems: 'center',
      paddingHorizontal: width(3),
      // borderBottomRightRadius: width(3),
      // borderBottomLeftRadius: width(3),
  
      elevation: 3,
    },
    nameText: {
      fontFamily: 'semiBold',
      color: theme.white,
      fontSize: width(4.5),
      marginLeft: width(5),
    },
    status: {
      height: height(1.5),
      width: height(1.5),
      borderRadius: height(0.75),
      backgroundColor: theme.greenSuccess,
      marginLeft: width(3),
    },
    btn: {
      width: '45%',
      position: 'absolute',
      right: width(5),
    },
    //// SIMPLE HEADER
    simpleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: height(9),
      width: width(100),
    },
    // corner: {
    //   height: '100%',
    //   width: width(20),
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    simpleTitle: {
      fontFamily: 'semiBold',
      color: theme.mainTheme,
      fontSize: width(4.5),
    },
    simpleMiddle: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },

    mainViewContainer: {
      flex: 1,
      overflow: 'hidden',
    },
    statusContainer: {
      marginRight: width(3),
    },
    footerContainer: {
      height: height(10.5),
      backgroundColor: theme.white,
      flexDirection: 'row',
      borderTopRightRadius: width(5),
      borderTopLeftRadius: width(5),
      alignItems: 'center',
      paddingBottom: 0,
    },
    corner: {
      width: width(16),
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: width(4),
    },
    input: {
      minHeight: '60%',
      maxHeight: '100%',
      width: '60%',
      marginHorizontal: width(5),
      borderRadius: height(20),
      paddingHorizontal: width(4),
      color: theme.black,
      backgroundColor: theme.terinaryText,
    },
    mic: {
      width: width(4),
      marginLeft: width(2),
    },
    star: {
      width: width(10),
      marginBottom: height(0.5),
    },
    overlayText: {
      color: theme.white,
      textAlign: 'center',
      fontWeight: '500',
      fontSize: width(4),
    },
    overlayTextContainer: {
      width: width(65),
      position: 'absolute',
      bottom: height(18),
      left: width(2),
      marginLeft: width(3),
    },
    overlayTextContainer2: {
      width: width(65),
      position: 'absolute',
      bottom: height(25),
      marginLeft: width(5),
    },
    overlayTextDescr: {
      color: theme.white,
      fontWeight: '500',
      fontSize: width(4),
    },
    btn2: {
      width: '60%',
      paddingVertical: height(1.2),
      marginTop: height(2),
    },
    arrowDown: {
      width: width(15),
      position: 'absolute',
      left: width(70),
      bottom: height(18),
    },
    arrowDown2: {
      width: width(15),
      position: 'absolute',
      left: width(75),
      bottom: height(18),
    },
    bgFooter: {
      backgroundColor: theme.white,
      paddingBottom: 0,
    },
    flashMessage: {
      backgroundColor: theme.white,
      paddingVertical: height(1.5),
      borderRadius: width(5),
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: width(5),
      marginTop: height(5),
    },
    flashText: {
      color: theme.black,
      fontWeight: '300',
    },
    tick: {
      width: width(7),
      marginRight: width(3),
    },
    hole1: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 7,
    },
  })

export default createStyles;