import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = (theme:any, sizes:any) =>
    StyleSheet.create({
        header: {
            backgroundColor: theme.primary,
            height: height * 0.22,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingTop: height * 0.03,
        },
        userInfo: {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: width * 0.05,
            justifyContent: "space-between",
        },
        userImgContainer: {
            backgroundColor: "#fff", 
            borderRadius: 50,
        },
        userImg: {
            width: width * 0.15,
            height: width * 0.15,
            borderRadius: 50,
        },
        salutation: {
            color: "#fff",
            fontSize: sizes.title,
            fontWeight: "700",
            lineHeight: height * 0.04,
        },
        userName: {
            color: "#fff",
            fontSize: sizes.subtitle,
            fontWeight: "700",
        },
        recommendedContainer: {
            marginTop: -height * 0.16,
            backgroundColor: theme.secondary,
            paddingTop: height * 0.1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            minHeight: height * 0.8,
            paddingBottom: height * 0.08,
          },
        subContainer:{
            flexDirection:'row',
            alignItems:'center',
            marginBottom:5
        },
        recommendedText: {
              color: theme.primaryText,
              lineHeight: height * 0.04,
              fontSize: sizes.title,
              fontWeight: '700',
              fontFamily: 'DM Sans',
              paddingLeft: 20,
              fontStyle: 'normal',
              marginRight:15
            }
    })

export default createStyles;