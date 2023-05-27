import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = (theme:any, sizes:any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primary
        },
        headerContainer: {
            height: height * 0.1,
            width: width,
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexDirection: "row",
            paddingHorizontal: 20,
            position: "relative",
            paddingBottom: 20,
            marginTop: 10
        },
        body: {
            flex: 1,
            backgroundColor:theme.secondary,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            width: width,
        },
    })

export default createStyles;