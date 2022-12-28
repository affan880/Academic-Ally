import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import ScreenLayout from '../../interfaces/screenLayout';

const Profile = () => {
    const height = Dimensions.get("screen").height;
    const width = Dimensions.get("screen").width;

    return (
        <ScreenLayout>
            <View style={{
                flex: 1,
                backgroundColor: '#D2D5DD',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#000000',
                    }} >Home Screen</Text>
            </View>
        </ScreenLayout>
    )
}


export default Profile

const styles = StyleSheet.create({})