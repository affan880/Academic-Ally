import { Dimensions, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');
const statusBarHeight :any = StatusBar.currentHeight;
const createStyles = (theme: any, sizes:any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primary,
        },
        headerContainer: {
            height: height * 0.45,
            width: width,
            alignItems: "flex-start",
            flexDirection: "column",
            paddingHorizontal: 20,
            paddingBottom: height * 0.05,
            paddingTop: statusBarHeight + 20,
            alignContent: "flex-start",
        },
        headerText: {
            fontSize: sizes.title,
            color: theme.white,
            fontWeight: "700",
            marginLeft: 10,
        },
        body: {
            flex: 1, 
            backgroundColor: theme.secondary,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            width: width,
            paddingBottom: height * 0.15,
        },
        bodyContent: {
            // flex: 1,
            paddingTop: height * 0.05,
        },
        name: {
            fontSize: 24,
            color: theme.white,
            fontWeight: "700",
            alignSelf: "center",
            marginBottom: 5,
            paddingTop: 5,
        },
        email: {
            fontSize: 16,
            color: theme.white,
            fontWeight: "400",
            alignSelf: "center",
        },
        menuContainer: {
            backgroundColor: theme.sec,
            width: '90%',
            alignSelf: "center",
        },
        settingsTitleText: {
            fontSize: sizes.textSmall,
            color: theme.text,
        },
        settingsText: {
            fontSize: sizes.subtitle,
            color: theme.primaryText,
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