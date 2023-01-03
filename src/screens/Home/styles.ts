import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = () =>
    StyleSheet.create({
        header: {
            flex: 1,
            backgroundColor: '#6360FF',
            height: height / 4,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingTop:30
        },
        userInfo: {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            justifyContent: "space-between",
        },
        userImgContainer: {
            backgroundColor: "#fff",
            borderRadius: 50,
        },
        userImg: {
            width: 60,
            height: 60,
            borderRadius: 50,
        },
        salutation: {
            color: "#fff",
            fontSize: 12,
            fontWeight: "700",
            lineHeight: 30
        },
        userName: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "700",
        }
    })

export default createStyles;