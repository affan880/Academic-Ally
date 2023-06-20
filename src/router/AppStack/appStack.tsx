import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerActions, NavigationProp, ParamListBase } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect, useReducer, useRef, useState } from 'react'
import { Dimensions, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import Svg, { G, Path } from "react-native-svg"
import Feather from "react-native-vector-icons/Feather"
import Fontisto from "react-native-vector-icons/Fontisto"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useSelector } from 'react-redux'

import { UploadIcon } from '../../assets/images/icons'
import Bookmark from '../../screens/Bookmark/Bookmark'
import HomeScreen from '../../screens/Home/homeScreen'
import NotesList from '../../screens/Notes/NotesList'
import PdfViewer from '../../screens/PdfViewer/pdfViewerScreen'
import SubjectResources from '../../screens/SubjectResources/SubjectResourcesScreen'
import UploadScreen from '../../screens/Notes/uploadScreen'
import UpdateInformation from '../../screens/Profile/AccountSettings/UpdateInformation'
import Profile from '../../screens/Profile/profile'
import AboutUs from '../../screens/Profile/Support/AboutUs'
import PrivacyPolicy from '../../screens/Profile/Support/PrivacyPolicy'
import TermsAndConditions from '../../screens/Profile/Support/Terms&Conditions'
import Search from '../../screens/Search/searchScreen'
import Upload from '../../screens/Upload/uploadScreen'

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;
const drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
interface IProps {
    navigation: NavigationProp<ParamListBase>
}

const DrawerScreen: FC<IProps> = ({ navigation }) => {
    return (
        <drawer.Navigator>
            <drawer.Screen name="Home" component={HomeScreen} options={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: '#6360FF',
                    elevation: 0,
                },
                headerLeft: ({ props }: any) => (
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <Pressable onPress={() => {
                            navigation.dispatch(DrawerActions.openDrawer());
                        }} >
                            <Feather name='menu' color={"#ffffff"} size={20} />
                        </Pressable>
                    </View>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 20 }} >
                        <Pressable onPress={() => {
                            navigation.navigate('Notes')
                        }} >
                            <Ionicons name='ios-notifications-outline' color={"#ffffff"} size={20} />
                        </Pressable>
                    </View>
                )
            }} />
        </drawer.Navigator>
    )
}
export const BottomTabBar = () => {
    const theme = useSelector((state: any) => state.theme)
    return (
        <>
            <StatusBar barStyle="light-content" />
            <Tab.Navigator
                screenOptions={{
                    tabBarHideOnKeyboard: false,
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        height: height * 0.08,
                        backgroundColor: theme.colors.quaternary,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        elevation: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        overflow: "hidden",
                        borderTopWidth: 0,
                    }
                }
                }
            >
                <Tab.Screen
                    name="HomeScreen"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * 0.23 }}>
                                    <Feather name='home' size={theme.sizes.iconMedium} color={focused ? '#FF8181' : theme.colors.primaryText} style={{
                                        bottom: focused ? 3 : 0,
                                    }} />
                                    {
                                        focused ? <Text style={{ color: '#FF8181', fontSize: theme.sizes.textSmall, fontWeight: '400', textAlign: "center", bottom: 0 }}>Home</Text> : null
                                    }
                                </View>

                            )
                        })
                    }}
                    // component={DrawerScreen}
                    component={HomeScreen}
                />
                <Tab.Screen
                    name="Search"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * 0.23 }}>
                                    <Feather name='search' size={theme.sizes.iconMedium} color={focused ? '#FF8181' : theme.colors.primaryText} style={{
                                        bottom: focused ? 3 : 0,
                                    }} />
                                    {
                                        focused ? <Text style={{ color: '#FF8181', fontSize: 10, fontWeight: '400', textAlign: "center", bottom: 0 }}>Search</Text> : null
                                    }
                                </View>

                            )
                        })
                    }}
                    component={Search}
                />
                <Tab.Screen
                    name="Upload"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * 0.23 }}>
                                    <Feather name='upload' size={theme.sizes.iconMedium} color={focused ? '#FF8181' : theme.colors.primaryText} style={{
                                        bottom: focused ? 3 : 0,
                                    }} />
                                    {
                                        focused ? <Text style={{ color: '#FF8181', fontSize: 10, fontWeight: '400', textAlign: "center", bottom: 0 }}>Upload</Text> : null
                                    }
                                </View>

                            )
                        })
                    }}
                    component={Upload}
                />
                <Tab.Screen
                    name="BookMark"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * 0.23 }}>
                                    <Fontisto name={focused ? 'bookmark-alt' : 'bookmark'} size={theme.sizes.iconMedium} color={focused ? '#FF8181' : theme.colors.primaryText} style={{
                                        bottom: focused ? 3 : 0,
                                    }} />
                                    {
                                        focused ? <Text style={{ color: '#FF8181', fontSize: 10, fontWeight: '400', textAlign: "center", bottom: 0 }}>Saved</Text> : null
                                    }
                                </View>

                            )
                        })
                    }}
                    component={Bookmark}
                />
                <Tab.Screen
                    name="Profile"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: width * 0.23 }}>
                                    <Feather name="user" size={theme.sizes.iconMedium} color={focused ? '#FF8181' : theme.colors.primaryText} style={{
                                        bottom: focused ? 3 : 0,
                                    }} />
                                    {
                                        focused ? <Text style={{ color: '#FF8181', fontSize: 10, fontWeight: '400', textAlign: "center", bottom: 0 }}>Account</Text> : null
                                    }
                                </View>

                            )
                        })
                    }}
                    component={Profile}
                />
            </Tab.Navigator>
        </>
    )
}

const AppStack = () => {
    return (
        <Stack.Navigator initialRouteName={"BottomTabBar"} screenOptions={{
            headerShown: false,
            animationEnabled: false
        }} >
            <Stack.Screen name="BottomTabBar" component={BottomTabBar} />
            <Stack.Screen name="SubjectResources" component={SubjectResources} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="NotesList" component={NotesList} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="UploadScreen" component={UploadScreen} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="PdfViewer" component={PdfViewer} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="UpdateInformation" component={UpdateInformation} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="AboutUs" component={AboutUs} options={{
                headerShown: false,
            }} />
        </Stack.Navigator>
    )
}

export default AppStack



const PlaceholderScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#011638' }} />
    )
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff'
    },
    activeBackground: {
        position: 'absolute'
    },
    tabBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    component: {
        height: 60,
        width: 60,
        marginTop: -5,
    },
    componentCircle: {
        flex: 1,
        borderRadius: 30,
        backgroundColor: "#ffffff",
    },
    iconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        height: 25,
        width: 25,
        color: "#ffffff"
    }
})
