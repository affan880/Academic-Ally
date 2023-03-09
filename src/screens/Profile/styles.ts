import { StyleSheet, Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get('window');
const statusBarHeight :any = StatusBar.currentHeight;
const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#6360FF"
        },
        headerContainer: {
            height: height * 0.45,
            width: width,
            alignItems: "flex-start",
            flexDirection: "column",
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: statusBarHeight + 20,
            alignContent: "flex-start",
        },
        headerText: {
            fontSize: 18,
            color: "#FCFCFF",
            fontWeight: "700",
            marginLeft: 10,
        },
        body: {
            flex: 1,
            backgroundColor: "#FCFCFF",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            width: width,
            paddingBottom: 80,
        },
        bodyContent: {
            flex: 1,
            paddingTop: 50,
        },
        name: {
            fontSize: 24,
            color: "#FCFCFF",
            fontWeight: "700",
            alignSelf: "center",
            marginBottom: 5,
            paddingTop: 5,
        },
        email: {
            fontSize: 16,
            color: "#FCFCFF",
            fontWeight: "400",
            alignSelf: "center",
        },
        menuContainer: {
            backgroundColor: "#FCFCFF",
            width: '90%',
            alignSelf: "center",
        },
        settingsTitleText: {
            fontSize: 12,
            color: "#91919F",
        },
        settingsText: {
            fontSize: 16,
            color: "#161719",
            fontWeight: "500",
        },
        settingsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
        },
        gridContainer: {
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: 20,
        },
        gridItem: {
            margin: 5,
            marginBottom: 20,
        },
    })

export default createStyles;