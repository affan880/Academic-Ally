import React, { useEffect, useReducer, useRef, FC, useState } from 'react'
import {
    Pressable,
    StatusBar,
    StyleSheet,
    View,
    Text,
    Dimensions,
} from 'react-native'
import { NavigationProp, ParamListBase, DrawerActions } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Svg, { G, Path } from "react-native-svg"
import HomeScreen from '../../screens/Home/homeScreen'
import Upload from '../../screens/Upload/upload'
import Bookmark from '../../screens/Bookmark/Bookmark'
import Profile from '../../screens/Profile/profile'
import SubjectResources from '../../screens/Notes/SubjectResources'
import { createStackNavigator } from '@react-navigation/stack'
import Feather from "react-native-vector-icons/Feather"
import Fontisto from "react-native-vector-icons/Fontisto"
import Ionicons from "react-native-vector-icons/Ionicons"
import NotesList from '../../screens/Notes/NotesList'
import UploadScreen from '../../screens/Notes/uploadScreen'
import PdfViewer from '../../screens/Notes/PdfViewer/pdfViewer'
import SavedPdfViewer from '../../screens/Notes/PdfViewer/savedPdfViewer'
import UpdateInformation from '../../screens/Profile/AccountSettings/UpdateInformation'
import Search from '../../screens/Search/searchScreen'
import SharedPdfViewer from '../../screens/Notes/PdfViewer/sharedPdfViewer'

const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;
const drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
interface IProps {
    navigation: NavigationProp<ParamListBase>
}

const DrawerScreen: FC<IProps> = ({navigation}) => {
    return (
        <drawer.Navigator>
            <drawer.Screen name="Home" component={HomeScreen} options={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: '#6360FF',
                    elevation: 0,
                },
                headerLeft: ({props}:any) => (
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <Pressable onPress={() => {
                            navigation.dispatch(DrawerActions.openDrawer());
                        }} >
                            <Svg
                                width="20px"
                                height="20px"
                                viewBox="-2.4 -2.4 28.80 28.80"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#fff"
                                {...props}
                            >
                                <G strokeWidth={1.5}>
                                    <Path d="M3.297 5.234a2.599 2.599 0 011.937-1.937v0a5.544 5.544 0 012.532 0v0a2.599 2.599 0 011.937 1.937v0c.195.833.195 1.7 0 2.532v0a2.599 2.599 0 01-1.937 1.937v0c-.833.195-1.7.195-2.532 0v0a2.599 2.599 0 01-1.937-1.937v0a5.545 5.545 0 010-2.532v0zM3.297 16.234a2.599 2.599 0 011.937-1.937v0a5.546 5.546 0 012.532 0v0a2.599 2.599 0 011.937 1.937v0c.195.833.195 1.7 0 2.532v0a2.599 2.599 0 01-1.937 1.937v0c-.833.195-1.7.195-2.532 0v0a2.599 2.599 0 01-1.937-1.937v0a5.545 5.545 0 010-2.532v0zM14.297 5.234a2.599 2.599 0 011.937-1.937v0a5.544 5.544 0 012.532 0v0a2.599 2.599 0 011.937 1.937v0c.195.833.195 1.7 0 2.532v0a2.599 2.599 0 01-1.937 1.937v0c-.833.195-1.7.195-2.532 0v0a2.599 2.599 0 01-1.937-1.937v0a5.546 5.546 0 010-2.532v0zM14.297 16.234a2.599 2.599 0 011.937-1.937v0a5.546 5.546 0 012.532 0v0a2.599 2.599 0 011.937 1.937v0c.195.833.195 1.7 0 2.532v0a2.599 2.599 0 01-1.937 1.937v0c-.833.195-1.7.195-2.532 0v0a2.599 2.599 0 01-1.937-1.937v0a5.546 5.546 0 010-2.532v0z" />
                                </G>
                            </Svg>
                        </Pressable>
                    </View>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 20 }} >
                        <Pressable onPress={() => {
                            navigation.navigate('Notes')
                        }} >
                            <Ionicons name='ios-notifications-outline' color={"#ffffff"}  size={20}/>
                        </Pressable>
                    </View>
                )
            }} />
        </drawer.Navigator>
    )
}
export const BottomTabBar = () => {
    const [activeState, setActiveState] = useState(false)
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
                        height: 70,
                        width:"100%",
                        backgroundColor: "#FCFCFF",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
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
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Feather name='home' size={25} color={focused ? '#FF8181' : '#161719'} style={{
                                        bottom: focused? 3 : 0,
                                    }} />
                                    {
                                        focused ? <Text style={{ color: '#FF8181', fontSize: 10, fontWeight: '400', textAlign:"center", bottom: 0 }}>Home</Text> : null
                                    }
                                </View>

                            )
                        })
                    }}
                    component={DrawerScreen}
                />
                <Tab.Screen
                    name="Search"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Feather name='search' size={25} color={focused ? '#FF8181' : '#161719'} style={{
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
                    name="BookMark"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Fontisto name={focused ? 'bookmark-alt' : 'bookmark'} size={25} color={focused ? '#FF8181' : '#161719'} style={{
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
                    name="Profle"
                    options={{
                        tabBarIcon: (({ focused }) => {
                            return (
                                //label and icon
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Feather name="user" size={25} color={focused ? '#FF8181' : '#161719'} style={{
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
            <Stack.Screen name="BottomTabBar" component={BottomTabBar}/>
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
            <Stack.Screen name="SavedPdfViewer" component={SavedPdfViewer} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="UpdateInformation" component={UpdateInformation} options={{
                headerShown: false,
            }} />
            <Stack.Screen name="SharedPdfViewer" component={SharedPdfViewer} options={{
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
        color:"#ffffff"
    }
})
