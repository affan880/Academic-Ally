import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView } from 'react-native'
import React, { Children, useState } from 'react'

const ScreenLayout = (props) => {
    const height = Dimensions.get("screen").height;
    const width = Dimensions.get("screen").width;

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#F1F1FA',
            height: height*3,
        }} >
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
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