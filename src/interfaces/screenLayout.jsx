import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView } from 'react-native'
import React, { Children, useState } from 'react'

const ScreenLayout = (props) => {
    const height = Dimensions.get("screen").height;
    const width = Dimensions.get("screen").width;

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#D2D5DD',
        }} >
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            />
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={{
                    flex: 1,
                    backgroundColor: '#D2D5DD',
                    height: height,
                    width: width,
                }}
                >
                    {props.children}
                </View>

            </ScrollView>
        </View>
    )
}

export default ScreenLayout

const styles = StyleSheet.create({})