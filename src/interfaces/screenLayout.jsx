import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const ScreenLayout = (props) => {
    const height = Dimensions.get("screen").height;
    const width = Dimensions.get("screen").width;
    const theme = useSelector(state => state.theme);
    const statusBarHeight = StatusBar.currentHeight;
    return (
        <View
        //enable potrait and landscape
        // style={{ flex: 1, width: '100%', height: height }}
        style={{
            flex: 1,
            width: '100%',
            height: height,
            backgroundColor: theme.colors.primary,
            marginTop:statusBarHeight 
        }} >
            <StatusBar
                translucent={true}
                backgroundColor={theme.colors.primary}
                barStyle={'light-content'}

            />
                <View style={{
                    flex: 1,
                    backgroundColor: '#F1F1FA',
                    height: height,
                    width: width,
                }}
                >
                    {props.children}
                </View>
        </View>
    )
}

export default ScreenLayout

const styles = StyleSheet.create({})