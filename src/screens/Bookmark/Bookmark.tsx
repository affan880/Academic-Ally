import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { Box, Divider, FlatList, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { ShareIcon, ShareIconImg } from '../../assets/images/icons';
import { setBookmarks, userRemoveBookMarks } from '../../redux/reducers/userBookmarkManagement';
import { userAddToRecentsStart } from '../../redux/reducers/usersRecentPdfsManager';
import { fetchBookmarksList, shareNotes } from '../../services/fetch';
import PdfViewerAction from '../PdfViewer/pdfViewerAction';
import createStyles from './styles';

const { width, height } = Dimensions.get('window');

type MyStackParamList = {
  NotesList: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
  PdfViewer: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
};
type pdfViewer = StackNavigationProp<MyStackParamList, 'PdfViewer'>;

const Bookmark = () => {
  const theme = useSelector((state: any) => state.theme);
  const dynamicLink = useSelector((state: any) => state?.bootReducer?.utilis?.dynamicLink);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [listData, setListData] = useState([]);
  const [sortedList, setSortedList] = useState([]);
  const colorScheme = useColorScheme();
  const bookmarkList = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;
  const dispatch = useDispatch();
  const navigation = useNavigation<pdfViewer>();
  useEffect(() => {
    AsyncStorage.getItem('userBookMarks').then(data => {
      if (data && data !== '[]') {
        const list = JSON.parse(data);
        dispatch(setBookmarks(list));
      }
    });
  }, []);
  function remove(filename: string) {
    if (filename?.includes(".pdf")) {
      filename = filename.slice(0, -4);
      if (filename.length > 15) {
        return filename.substring(0, 25);
      }
      return filename;
    }
  }

  useEffect(() => {
    const getListData = async () => {
      if (bookmarkList?.length === 0) {
        fetchBookmarksList(dispatch, setBookmarks, setListData);
      } else {
        setListData(bookmarkList);
      }
    };

    getListData();
  }, [bookmarkList]);

  const closeRow = (rowMap: any, rowKey: any) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap: any, rowKey: any, item: any) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(
      (item: any) => item.id === rowKey,
    );
    newData.splice(prevIndex, 1);
    setListData(newData);
    dispatch(
      userRemoveBookMarks({ id: item.item.id }),
    );
    PdfViewerAction.removeBookmark(item.item);
  };

  function groupBySubject(array: any) {
    const groupedArray: any = {};
    for (const item of array) {
      const subject = item.subject;
      if (groupedArray[subject]) {
        groupedArray[subject].push(item);
      } else {
        groupedArray[subject] = [item];
      }
    }
    setSortedList(Object.values(groupedArray));
    return Object.values(groupedArray);
  }

  useEffect(() => {
    groupBySubject(listData);
  }, [listData]);

  const renderItem = ({ item, index }: any) => (
    <Box style={styles.mainContainer}>
      <Pressable
        onPress={() => {
          navigation.navigate('PdfViewer', {
            userData: {
              Course: item.course,
              Branch: item.branch,
              Sem: item.sem,
            },
            notesData: item,
            selected: item.category,
            subject: item.subject,
          });
          dispatch(userAddToRecentsStart({ ...item, "viewedTime": `${new Date()}`, "category": item.category }));
        }}>
        <HStack style={styles.subjectItem} >
          <View style={styles.containerBox}>
            <View style={styles.containerText} />
          </View>
          <HStack >
            <VStack  >
              <Box
                style={styles.subjectItemTextContainer}>
                {
                  item.name !== 'undefined' ?
                    <Text style={styles.name}>{remove(item?.name)}</Text> : null
                }
                <Text
                  style={{
                    fontSize: theme.sizes.subTitle,
                    color: theme.colors.primaryText,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  fontWeight={400}>
                  {item?.category === 'otherResources'
                    ? 'Other Resources'
                    : item?.category?.charAt(0).toUpperCase() +
                    item?.category?.slice(1)}
                </Text>
                <HStack >
                  <Text style={styles.subjectName}>{item?.units === "" ? "Units: Unknown" : `Units: ${item.units}`}</Text>
                  <Text style={[styles.subjectName, {
                    marginLeft: theme.sizes.width * 0.03,
                  }]}>Semester: {`${item.sem}`}</Text>
                </HStack>
                <Text style={styles.subjectName}>Branch: {item?.branch}</Text>
              </Box>
            </VStack>
            <TouchableOpacity onPress={() => {
              shareNotes(item, dynamicLink)
            }} style={{
              justifyContent: 'center',
            }}  >
              {
                colorScheme === 'dark' ?
                  <ShareIcon /> : <ShareIconImg />
              }
            </TouchableOpacity>
          </HStack>
        </HStack>
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data: any, rowMap: any) => (
    <HStack
      height={height * 0.15}
      width={width / 1.1}
      pl="2"
      borderRadius={10}
      backgroundColor={'#FFFFFF'}
      justifyContent={'center'}
      alignSelf={'center'}>
      <Box width={"78%"} borderRadius={10} backgroundColor={"#FFF"} zIndex={999} />
      <Pressable
        w="90"
        height={"100%"}
        bg="#F65742"
        borderBottomRightRadius={10}
        borderTopRightRadius={10}
        justifyContent="center"
        alignSelf={'center'}
        ml={'auto'}
        onPress={() => deleteRow(rowMap, data.item.did, data)}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="2xl" />
        </VStack>
      </Pressable>
    </HStack>
  );
  return listData?.length > 0 ? (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Fontisto name="bookmark" size={theme.sizes.iconMedium} color="#FFFFFF" />
          <Text style={styles.headerText}>Bookmarks</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={sortedList}
            renderItem={({ item, index }: any) =>
              <View key={index}>
                <Text style={{
                  fontSize: theme.sizes.title,
                  fontWeight: 'bold',
                  color: theme.colors.primaryText,
                  marginLeft: 10,
                  marginTop: index === 0 ? 10 : 20,
                  marginBottom: 10,
                  width: '95%',
                }}>{item[0]?.subject}</Text>
                <SwipeListView
                  data={item}
                  renderItem={renderItem}
                  scrollEnabled={true}
                  ItemSeparatorComponent={() => (
                    <View style={{ height: 20, width: '100%' }} />
                  )}
                  showsVerticalScrollIndicator={false}
                  renderHiddenItem={renderHiddenItem}
                  rightOpenValue={-83}
                  previewRowKey={'0'}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                // onRowDidOpen={onRowDidOpen}
                />
                <Divider style={{
                  marginTop: 20,
                  width: '90%',
                  alignSelf: 'center',
                }} />
              </View>
            }
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={10}
          />

        </View>
      </View>
    </View>
  ) : (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
    }}>
      <View
        style={{
          height: theme.sizes.height * 0.3,
        }}>
        <LottieView
          source={require('../../assets/lottie/NoBookMarks.json')}
          autoPlay
          loop
        />
      </View>
      <Text
        style={{
          fontSize: theme.sizes.title,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 20,
          alignSelf: 'center',
          margin: height * 0.06,
          textAlign: 'center',
          lineHeight: height * 0.05,
        }}>
        No bookmarks to show. Start bookmarking your favorite notes for easy access later!</Text>
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});
