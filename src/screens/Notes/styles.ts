import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#6360FF"
        },
        headerContainer : {
            height: height * 0.15,
            width: width,
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexDirection: "row",
            paddingHorizontal: 20,
            position: "relative",
            paddingBottom: 30
        },
        body: {
            flex: 1,
            backgroundColor: "#F5F5F5",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            width: width,
            justifyContent: "space-around",
        },
        bodyContent: {
            flex: 1,
            justifyContent: "space-around",
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 20,
            paddingTop: 20
        },
        categoryBtns: {
            width: width * 0.4,
            height: height * 0.25,
            backgroundColor: "#fff",
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 0,
            marginVertical: 10,
            //change btn position on hover
            transform: [{ scale: 1 }],
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,

        },
        //change btn position on hover
        categoryBtnClicked: {
            transform: [{ scale: 1.1 }],
            borderColor: "#6360FF",
            borderWidth: 2,
            
        },
        selectBtn: {
            width: width,
            height: height * 0.25,
            justifyContent: "center",
            alignItems: "center",
        },
        btnText: {
            fontSize: 16,
            fontWeight: "600",
            color: "#161719",
            textAlign: "center",
            lineHeight: 20,
            marginTop: 10
        },
    })

export default createStyles;