import { StyleSheet, View, Dimensions, ScrollView } from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import ScreenLayout from '../../interfaces/screenLayout';
import { NativeBaseProvider, Box, Text, Pressable, Heading, IconButton, Icon, HStack, Avatar, VStack, Spacer, Center } from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { removeBookmark } from '../../Modules/auth/firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import createStyles from './styles';
import { userRemoveBookMarks } from '../../redux/reducers/userBookmarkManagement';
import { useNavigation } from '@react-navigation/native';



const { width, height } = Dimensions.get('window');
const Bookmark = () => {
    const styles = useMemo(() => createStyles(), []);
    const [listData, setListData] = useState([]);
    const bookmarkList = useSelector((state: any) => state.userBookmarkManagement).userBookMarks;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        const getListData = async () => {
            const storedValue :any = await AsyncStorage.getItem('userBookMarks');
            const list = await JSON.parse(storedValue);
            setListData(list);
        };
        getListData();
    }, [bookmarkList]);



    const closeRow = (rowMap :any, rowKey:any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap:any, rowKey:any, item:any) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex((item: any) => item.notesId === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
            dispatch(userRemoveBookMarks({
                fileName: item.item.fileName,
                subject: item.item.subject,
                notesId: item.item.notesId,
                category: item.item.category,
            }));
        removeBookmark(item.item);

    };

    const onRowDidOpen = (rowKey :any) => {
        console.log('This row opened', rowKey);
    };

    const renderItem = ({
        item,
        index
    } :any ) => <Box height={height / 7} width={width / 1.1}  borderRadius={10} backgroundColor={"#FFFFFF"} justifyContent={"center"} alignSelf={"center"}>
            <Pressable onPress={() => console.log('You touched me')}  >
                <HStack px={15} >
                    <View style={styles.containerBox}>
                        <View style={styles.containerText}>
                            <Ionicons name="eye-sharp" size={20} color="#fff" style={{
                                alignSelf: 'center',
                                transform: [{ rotate: '135deg' }],
                            }} />
                        </View>
                    </View>
                        <HStack width={'75%'} px={5}>
                        <VStack>
                            <Box style={{
                                width: '100%',
                                height: 80,
                                justifyContent: 'space-evenly',
                                alignItems: 'flex-start',
                                paddingLeft: 10,
                            }}  >
                            <Text style={styles.subjectName}>{ item.subject }</Text>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#161719',
                                    fontWeight: 'bold',
                                }}>{item.category.charAt(0).toUpperCase() + item.category.slice(1) }</Text>
                            
                            </Box>
                            </VStack>
                        </HStack>
                </HStack>
            </Pressable>
        </Box>;

    const renderHiddenItem = (data:any, rowMap:any) => <HStack height={height / 7} width={width / 1.1} pl="2"  borderRadius={10} backgroundColor={"#FFFFFF"} justifyContent={"center"} alignSelf={"center"} >
        <Pressable w="70" bg="red.500" height={70}  justifyContent="center" alignSelf={"center"} ml={"auto"} onPress={() => deleteRow(rowMap, data.item.notesId, data)} _pressed={{
            opacity: 0.5
        }}>
            <VStack alignItems="center" space={2}>
                <Icon as={<MaterialIcons name="delete" />} color="white" size="lg  " />
                <Text color="white" fontSize="xs" fontWeight="medium">
                    Delete
                </Text>
            </VStack>
        </Pressable>
    </HStack>;
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Ionicons name='chevron-back-outline' size={20} color="#ffffff" onPress={() => {
                    navigation.goBack()
                }} />
            </View>
            <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <SwipeListView data={listData} renderItem={renderItem} ItemSeparatorComponent={
                        () => <View style={{ height: 20, width: '100%' }} />
                    } showsVerticalScrollIndicator={false} renderHiddenItem={renderHiddenItem} rightOpenValue={-140} previewRowKey={'0'} previewOpenValue={-40} previewOpenDelay={3000} onRowDidOpen={onRowDidOpen} />
                </View>
            </View>
        </View>
    )
}


export default Bookmark

const styles = StyleSheet.create({})