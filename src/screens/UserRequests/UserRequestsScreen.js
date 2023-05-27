import storage from '@react-native-firebase/storage';
import { FlatList, VStack } from 'native-base';
import React, { useEffect, useMemo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux'

import NewRequestCard from '../../components/notes/newRequestCard';
import createStyles from './styles';
import UserRequestsActions from './UserRequestsActions'

const UserRequestsScreen = () => {
    const dispatch = useDispatch();
    const UserRequests = useSelector(state => state.UserRequestsReducer);
    const theme = useSelector((state) => state.theme);
    const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
    useEffect(() => {
        dispatch(UserRequestsActions.loadNewUploads());
    }, [])
    function remove(filename) {
        if (filename.endsWith(".pdf")) {
            filename = filename.slice(0, -4);
            if (filename.length > 15) {
                return filename.substring(0, 20);
            }
            return filename;
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name={"clipboard-edit-outline"} size={theme.sizes.iconMedium} color="#FFFFFF" />
                    <Text style={styles.headerText}>Requests</Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={UserRequests?.NewRequests}
                        renderItem={({ item, index }) => {
                            const path = item?.path.split('/');
                            return (
                                <NewRequestCard
                                    item={item}
                                    index={index}
                                    selected={item?.selected}
                                    subject={item?.subject}
                                />
                            )
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

export default UserRequestsScreen

const styles = StyleSheet.create({})