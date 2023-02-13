import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#6360FF"
        },
        headerContainer: {
            height: height * 0.15,
            width: width,
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexDirection: "row",
            paddingHorizontal: 20,
            position: "relative",
            paddingBottom: 20
        },
        body: {
            flex: 1,
            backgroundColor: "#F5F5F5",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            width: width,
        },
        bodyContent: {
            paddingTop: 30,
        },
    })

export default createStyles;