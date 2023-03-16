import { StyleSheet, Dimensions, TouchableHighlight, Linking } from 'react-native';

const { width, height } = Dimensions.get('window');
const createStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#6360FF',
            marginBottom: 70,
        },
        headerContainer: {
            height: height * 0.15,
            width: width,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexDirection: 'row',
            paddingHorizontal: 20,
            position: 'relative',
            paddingBottom: 30,
        },
        body: {
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            width: width,
        },
        bodyContent: {
            flex: 1,
            paddingTop: 10,
            flexDirection: 'column',
            borderRadius: 30,
        },
        title: {
            fontSize: 24,
            color: '#000',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
        },
        subTitle: {
            fontSize: 16,
            color: '#91919C',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
        },
        content: {
            flex: 1,
            flexDirection: 'column',
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        label: {
            fontSize: 16,
            color: '#000',
            fontWeight: 'bold',
            textAlign: 'left',
            paddingBottom: 5,
            paddingTop: 10,
        },
        normalText: {
            fontSize: 16,
            color: '#000',
            textAlign: 'left',
            paddingBottom: 5,
            flexWrap: 'wrap',
            flex: 1,
        },
        headerText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#FFFFFF',
            textAlign: 'center',
            paddingLeft: 5,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        linkText: {
            fontSize: 16,
            color: '#6360FF',
            textAlign: 'left',
            paddingBottom: 5,
            textDecorationColor: '#6360FF',
            textDecorationLine: 'underline',
        },
        privacyPolicyiesLinks: {
            fontSize: 16,
            color: '#6360FF',
            textAlign: 'left',
            paddingBottom: 5,
            textDecorationColor: '#6360FF',
            textDecorationLine: 'underline',
        },
        image: {
            alignSelf: 'center',
            width: width * 0.6,
            height: height * 0.2,
            resizeMode: 'contain',
            marginVertical: 20,
        }
    });

export default createStyles;
