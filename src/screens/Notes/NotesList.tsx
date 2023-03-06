import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
import React, {useMemo, useState, useRef} from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useDispatch, useSelector} from 'react-redux';
import NavigationLayout from '../../interfaces/navigationLayout';
import createStyles from './styles';
import {manageBookmarks} from '../../Modules/auth/firebase/firebase';
import {userAddToRecentsStart} from '../../redux/reducers/usersRecentPdfsManager';
import {
  userAddBookMarks,
  userRemoveBookMarks,
} from '../../redux/reducers/userBookmarkManagement';
import {NavBtn} from '../../components/CustomFormComponents/CustomBtn';

type Props = {};
type RootStackParamList = {
  NotesList: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: any;
    selected: string;
    subject: string;
  };
};
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
  UploadScreen: {
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

function remove(str: string) {
  if (str.includes('(oufastupdates.com)') || str.includes('.pdf')) {
    let text = str.replace(/\(oufastupdates.com\)|\.pdf/g, '');
    if (text.length > 15) {
      return text.substring(0, 15) + '...';
    }
    return str;
  }
}

const NotesList = (props: Props) => {
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<pdfViewer>();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const {userData} = route.params;
  const {notesData} = route.params;
  const {selected} = route.params;
  const {subject} = route.params;
  const [saved, setSaved] = useState(false);

  const userBookmarks = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;

  const BookmarkStatus = (item: any) => {
    if (userBookmarks?.some((bookmark: any) => bookmark.notesId === item)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <NavigationLayout rightIconFalse={true}  title={subject} >
        <View style={styles.notesListHeaderContainer}>
          <View
            style={{
              width: '75%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.notesListHeaderText}>
              Results for {selected} of "{subject}"
            </Text>
          </View>
          <View
            style={{
              width: '25%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.notesListValueText}>
              Total {notesData[selected].length}
            </Text>
          </View>
        </View>
        {notesData[selected].map((item: any, index: number) => {
          return (
            <View style={styles.reccomendationContainer} key={index}>
              <View style={styles.reccomendationStyle}>
                <TouchableOpacity
                  style={styles.subjectContainer}
                  onPress={() => {
                    navigation.navigate('PdfViewer', {
                      userData: {
                        Course: userData.Course,
                        Branch: userData.Branch,
                        Sem: userData.Sem,
                      },
                      notesData: item,
                      selected: selected,
                      subject: subject,
                    });
                    dispatch(userAddToRecentsStart({...item, "viewedTime": `${new Date()}`, "category": selected}));
                  }}>
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
                  <View
                    style={{
                      width: '65%',
                      height: 80,
                      justifyContent: 'space-evenly',
                      alignItems: 'flex-start',
                      paddingLeft: 10,
                    }}>
                    <Text style={styles.subjectName}>
                      {remove(item.fileName)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#161719',
                        fontWeight: 'bold',
                      }}>
                      {selected.charAt(0).toUpperCase() + selected.slice(1)}
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingRight: 10,
                        maxWidth: '100%',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '15%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginRight: 10,
                        }}>
                        <Ionicons name="eye-sharp" size={13} color="#161719" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#161719',
                            fontWeight: '700',
                            paddingLeft: 5,
                          }}>
                          {item.reviews < 10
                            ? `${item.reviews + 10}`
                            : item.reviews}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '12%',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 5,
                        }}>
                        <AntDesign name="star" size={13} color="#FFC960" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: '#161719',
                            fontWeight: '700',
                            paddingLeft: 5,
                          }}>
                          {item.rating < 1 ? 5 : item.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSaved(!saved);
                      const status = BookmarkStatus(item.notesId);
                      !status
                        ? dispatch(
                            userAddBookMarks({
                              fileName: item.fileName,
                              subject: subject,
                              notesId: item.notesId,
                              category: selected,
                            }),
                          )
                        : dispatch(
                            userRemoveBookMarks({
                              fileName: item.fileName,
                              subject: subject,
                              notesId: item.notesId,
                              category: selected,
                            }),
                          );
                      manageBookmarks(item, selected, subject, status);
                    }}>
                    <Fontisto
                      name={
                        BookmarkStatus(item.notesId)
                          ? 'bookmark-alt'
                          : 'bookmark'
                      }
                      size={25}
                      color={'#161719'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </NavigationLayout>
      <Animated.View style={{opacity: fadeAnim}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UploadScreen', {
              userData: userData,
              notesData: notesData,
              selected: selected,
              subject: subject,
            });
          }}
          style={{
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
            backgroundColor: '#FF8181',
            width: '90%',
            height: 60,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 0,
            shadowOpacity: 0.5,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              paddingVertical: 10,
            }}>
            Upload
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default NotesList;

const styles = StyleSheet.create({});
