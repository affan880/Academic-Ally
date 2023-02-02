import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ScreenLayout from '../../interfaces/screenLayout';
import createStyles from './styles';
import { Avatar, VStack } from 'native-base'
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux'
const User = require('../../assets/images/user.jpg');

type MyStackParamList = {
    UpdateInformation: { itemId: number };
}
const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;

const Profile = () => {
    const styles = createStyles();
    type MyScreenNavigationProp = StackNavigationProp< MyStackParamList ,'UpdateInformation'>
    const navigation = useNavigation<MyScreenNavigationProp>();

    const userFirestoreData = useSelector((state: any) => {
        return state.usersData;
    })
    console.log(userFirestoreData.usersData);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => {
                navigation.goBack()
            }} >
            <View style={{
                    flexDirection: 'row',
                }}>
                <Ionicons name='chevron-back-outline' size={20} color="#ffffff" /> 
                <Text style={styles.headerText}>Account</Text>
            </View>
            <Avatar source={User} size={'2xl'} alignSelf={'center'} mt={10} />
                <Text style={styles.name}>{userFirestoreData.usersData.Name}</Text>
                <Text style={styles.email}>{userFirestoreData.usersData.Email}</Text>    
            </TouchableOpacity>
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <View style={styles.menuContainer}>
                            <VStack>
                                <View>
                                    <Text style={styles.settingsTitleText} >Account Settings</Text>
                                </View>
                                <TouchableOpacity style={styles.settingsContainer} onPress={() => {
                                    navigation.navigate('UpdateInformation', {
                                        itemId: 86,
                                    })
                                }} >
                                    <Text style={styles.settingsText}>Update Information</Text>
                                    <Ionicons name='chevron-forward-outline' size={20} color="#91919F" /> 
                                </TouchableOpacity>
                            </VStack>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}


export default Profile

const styles = StyleSheet.create({})