import React from 'react';
import { View } from 'react-native';
import HomeScreen from '../../screens/Home/homeScreen';
import NoteScreen from '../../screens/Notes/NoteScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
const AppStack = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarHideOnKeyboard: false,
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 15,
                    left: 10,
                    right: 10,
                    elevation: 0,
                    borderRadius: 18,
                    height: 60,
                    backgroundColor: "#00A8E8",
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="home"
                            size={24}
                            color="black"
                            style={{
                                color: focused ? '#A094E3' : '#ffffff',
                            }}
                        />
                    ),
                    headerShown: true,
                    headerTitleAlign : "center"
                }}
            />
            <Tab.Screen
                name="Saved"
                component={NoteScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons
                                name="bookmark"
                                size={24}
                                color="black"
                                style={{
                                    color: focused ? '#A094E3' : '#ffffff',
                                }}
                            />
                        </View>
                    ),
                    headerShown: true,
                    headerTitleAlign: "center",
                    headerTitle: "Saved",
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: "600",
                        color: '#ffffff',
                    },
                    headerStyle: {
                        backgroundColor: '#ffffff',
                        borderBottomWidth: 0,
                        elevation: 0,
                    }
                }}
            />
            <Tab.Screen
                name="Chats"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons
                                name="ios-chatbubbles-sharp"
                                size={24}
                                color="black"
                                style={{
                                    color: focused ? '#A094E3' : '#ffffff',
                                }}
                            />
                        </View>
                    ),
                    headerShown: true,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={NoteScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons
                                name="md-person-circle-sharp"
                                size={24}
                                color="black"
                                style={{
                                    color: focused ? '#A094E3' : '#ffffff',
                                }}
                            />
                        </View>
                    ),
                    headerShown: false,
                }}
            />
            </Tab.Navigator>
    );
};

export default AppStack;
