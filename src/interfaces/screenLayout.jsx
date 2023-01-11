import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView } from 'react-native'
import React, { Children, useState } from 'react'

const ScreenLayout = (props) => {
    const height = Dimensions.get("screen").height;
    const width = Dimensions.get("screen").width;
    const statusBarHeight = StatusBar.currentHeight;
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#6360FF',
            marginTop:statusBarHeight 
        }} >
            <StatusBar
                translucent={true}
                backgroundColor={'#6360FF'}
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