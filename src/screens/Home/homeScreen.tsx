import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { firebase } from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { Toast } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import QuickAccess from '../../components/CustomFormComponents/QuickAccess/QuickAccess';
import Recommendation from '../../components/CustomFormComponents/Recommendation/Recommendation';
import ResourceLoader from '../../components/loaders/ResourceLoader';
import ScreenLayout from '../../interfaces/screenLayout';
import { setListLoaded, setSubjectsList, setVersion } from '../../redux/reducers/subjectsList';
import { setDarkTheme, setLightTheme } from '../../redux/reducers/theme';
import { setBookmarks } from '../../redux/reducers/userBookmarkManagement';
import { setUsersData, setUsersDataLoaded } from '../../redux/reducers/usersData';
import { setResourceLoader } from '../../redux/reducers/userState';
import { fetchBookmarksList, fetchNotesList, getFcmToken } from '../../services/fetch';
import createStyles from './styles';

type MyStackParamList = {
  Notes: { itemId: number };
  PdfViewer: {
    userData: {
      Course: string;
      branch: string;
      sem: string;
    };
    notesData: {
      course: string;
      branch: string;
      sem: string;
      subject: string;
      category: string;
      did: string;
      name: string;
    };
  };
  Profile: undefined
};
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'Notes'>;
type Props = {};

const HomeScreen = (props: Props) => {
  const colorScheme = useColorScheme();
  const theme = useSelector((state: any) => {
    return state.theme;
  });

  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const navigation =
    useNavigation<StackNavigationProp<MyStackParamList, 'Notes'>>();
  const userFirestoreData = useSelector((state: any) => state.usersData);
  const userDataLoaded = useSelector(
    (state: any) => state.usersData.usersDataLoaded,
  );
  const bookmarks = useSelector((state: any) => state.userBookmarkManagement.bookmarks);
  const [listData, setListData] = useState([]);
  const bookmarkList = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;

  useEffect(() => {
    colorScheme === 'dark' ? dispatch(setDarkTheme()) : dispatch(setLightTheme());
  }, [colorScheme])

  useEffect(() => {
    getFcmToken();
  }, [])

  const handleDynamicLink = (link: any) => {
    const parts = link?.url.split('/');
    const userData = {
      Course: parts[4],
      branch: parts[5],
      sem: parts[6],
    };
    const notesData = {
      course: parts[4],
      branch: parts[5],
      sem: parts[6],
      subject: parts[7],
      category: parts[3],
      did: parts[8],
      name: parts[11],
      units: parts[9]
    };
    navigation.navigate('PdfViewer', {
      userData,
      notesData,
    });
  };


  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        if (link && link.url) {
          handleDynamicLink(link);
        }
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser?.uid)
      .get()
      .then((data: any) => {
        dispatch(setUsersData(data?.data()));
        dispatch(setUsersDataLoaded(true));
        fetchNotesList(dispatch, setSubjectsList, setListLoaded, data?.data());
      })
      .catch(error => {
        dispatch(setUsersDataLoaded(false));
        Toast.show({
          title: 'Check your internet connection and try again later',
          duration: 3000,
        });
      });
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  const getListData = async () => {
    fetchBookmarksList(dispatch, setBookmarks, setListData);
  };

  useEffect(() => {
    if (bookmarkList.length === 0) {
      AsyncStorage.getItem('userBookMarks').then(data => {
        if (data && data !== '[]') {
          const list = JSON.parse(data);
          dispatch(setBookmarks(list));
        }
        else {
          getListData();
        }
      });
    }
    else {
      return;
    }
  }, []);

  return (
    <ScreenLayout>
      <ResourceLoader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
        }}>
        <View style={styles.header}>
          <View>
            <View style={styles.userInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity style={styles.userImgContainer} onPress={() => {
                  navigation.navigate('Profile')
                }} >
                  <Image source={{
                    uri: userFirestoreData.userProfile || auth().currentUser?.photoURL,
                  }} style={styles.userImg} />
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text style={styles.salutation}>Welcome back</Text>
                  <Text style={styles.userName}>
                    {userFirestoreData.usersData?.name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                {
                  theme.theme === 'light' ?
                    <FontAwesome5
                      onPress={() => {
                        dispatch(setDarkTheme())
                      }}
                      name="cloud-moon"
                      color={'#ffffff'}
                      size={20}
                    /> :
                    <Ionicons
                      onPress={() => {
                        dispatch(setLightTheme())
                      }}
                      name="md-sunny"
                      color={'#ffffff'}
                      size={20}
                    />
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <QuickAccess selected={selectedCategory} setSelectedCategory={(option) => {
          setSelectedCategory(option)
        }} />
        <View
          style={styles.recommendedContainer}>
          <Text
            style={styles.recommendedText}>
            Recommended
          </Text>
          <View>
            <Recommendation selected={selectedCategory} setResourcesLoaded={(option: boolean) => {
              dispatch(setResourceLoader(option))
            }} />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default HomeScreen;
