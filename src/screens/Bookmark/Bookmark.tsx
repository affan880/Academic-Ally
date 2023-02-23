import {StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import React, {useState, useEffect, useMemo} from 'react';
import ScreenLayout from '../../interfaces/screenLayout';
import {Box, Text, Pressable, Icon, HStack, VStack} from 'native-base';
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  getCurrentUser,
  removeBookmark,
} from '../../Modules/auth/firebase/firebase';
import {useDispatch, useSelector} from 'react-redux';
import createStyles from './styles';
import {
  userRemoveBookMarks,
  setBookmarks,
} from '../../redux/reducers/userBookmarkManagement';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

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
  const styles = useMemo(() => createStyles(), []);
  const [listData, setListData] = useState([]);
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
  function remove(str: string) {
    if (str.includes('(oufastupdates.com)') || str.includes('.pdf')) {
      let text = str.replace(/\(oufastupdates.com\)|\.pdf/g, '');
      if (text.length > 15) {
        return text.substring(0, 25) + '...';
      }
      return str;
    }
  }

  useEffect(() => {
    const getListData = async () => {
      if (bookmarkList?.length === 0) {
        firestore()
          .collection('Users')
          .doc(getCurrentUser()?.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              const list = doc.data()?.NotesBookmarked;
              if (list?.length !== 0) {
                dispatch(setBookmarks(list));
                setListData(list);
                AsyncStorage.setItem('userBookMarks', JSON.stringify(listData));
              } else {
                setListData([]);
              }
            }
          });
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
      (item: any) => item.notesId === rowKey,
    );
    newData.splice(prevIndex, 1);
    setListData(newData);
    dispatch(
      userRemoveBookMarks({
        notesId: item.item.notesId,
      }),
    );
    removeBookmark(item.item);
  };

  // const onRowDidOpen = (rowKey: any) => {
  //   console.log('This row opened', rowKey);
  // };

  const renderItem = ({item, index}: any) => (
    <Box
      height={height / 7}
      width={width / 1.1}
      borderRadius={10}
      backgroundColor={'#FFFFFF'}
      justifyContent={'center'}
      alignSelf={'center'}>
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
        }}>
        <HStack px={15}>
          <View style={styles.containerBox}>
            <View style={styles.containerText}>
              <Ionicons
                name="eye-sharp"
                size={20}
                color="#fff"
                style={{
                  alignSelf: 'center',
                  transform: [{rotate: '135deg'}],
                }}
              />
            </View>
          </View>
          <HStack width={'75%'} px={5}>
            <VStack>
              <Box
                style={{
                  width: '100%',
                  height: 80,
                  justifyContent: 'space-evenly',
                  alignItems: 'flex-start',
                  paddingLeft: 10,
                }}>
                <Text style={styles.fileName}>{remove(item.fileName)}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#161719',
                  }}
                  fontWeight={500}>
                  {item?.category === 'otherResources'
                    ? 'Other Resources'
                    : item?.category?.charAt(0).toUpperCase() +
                      item?.category?.slice(1)}
                </Text>
                <Text style={styles.subjectName}>{item?.subject}</Text>
              </Box>
            </VStack>
          </HStack>
        </HStack>
      </Pressable>
    </Box>
  );

  const renderHiddenItem = (data: any, rowMap: any) => (
    <HStack
      height={height / 7}
      width={width / 1.1}
      pl="2"
      borderRadius={10}
      backgroundColor={'#FFFFFF'}
      justifyContent={'center'}
      alignSelf={'center'}>
      <Pressable
        w="70"
        bg="red.500"
        height={70}
        justifyContent="center"
        alignSelf={'center'}
        ml={'auto'}
        onPress={() => deleteRow(rowMap, data.item.notesId, data)}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Icon as={<MaterialIcons name="delete" />} color="white" size="lg" />
          <Text color="white" fontSize="xs" fontWeight="medium">
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );
  return listData?.length > 0 ? (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bookmarks</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <SwipeListView
            data={listData}
            renderItem={renderItem}
            scrollEnabled={true}
            ItemSeparatorComponent={() => (
              <View style={{height: 20, width: '100%'}} />
            )}
            showsVerticalScrollIndicator={false}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-140}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            // onRowDidOpen={onRowDidOpen}
          />
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View
        style={{
          height: 450,
        }}>
        <LottieView
          source={require('../../assets/lottie/NoBookMarks.json')}
          autoPlay
          loop
        />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: 20,
          alignSelf: 'center',
        }}>
        No Bookmarks Found
      </Text>
    </View>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});
