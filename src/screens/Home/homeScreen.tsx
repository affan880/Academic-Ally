import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import firestore from '@react-native-firebase/firestore';
import inAppMessaging from "@react-native-firebase/in-app-messaging";
import messaging from '@react-native-firebase/messaging';
import { Toast } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import QuickAccess from '../../components/CustomFormComponents/QuickAccess/QuickAccess';
import Recommendation from '../../components/CustomFormComponents/Recommendation/Recommendation';
import CustomLoader from '../../components/loaders/CustomLoader';
import ResourceLoader from '../../components/loaders/ResourceLoader';
import ScreenLayout from '../../layouts/screenLayout';
import { setDarkTheme, setIsPotrait, setLightTheme } from '../../redux/reducers/theme';
import { setBookmarks } from '../../redux/reducers/userBookmarkManagement';
import { setUsersData, setUsersDataLoaded } from '../../redux/reducers/usersData';
import { setCustomLoader, setResourceLoader } from '../../redux/reducers/userState';
import { fetchBookmarksList, getFcmToken } from '../../services/fetch';
import { userFirestoreData } from '../../services/fetch';
import FirebaseService from '../../services/FirebaseService';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';
import HomeAction from './homeAction';
import createStyles from './styles';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const theme = useSelector((state: any) => { return state.theme });
  const dispatch: any = useDispatch();
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const usersProfileData = useSelector((state: any) => state.usersData);
  const [listData, setListData] = useState([]);
  const [message, setMessage] = React.useState<any>(null);
  const bookmarkList = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;


  useEffect(() => {
    inAppMessaging().setMessagesDisplaySuppressed(false);
  }, [])


  useEffect(() => {
    colorScheme === 'dark' ? dispatch(setDarkTheme()) : dispatch(setLightTheme());
  }, [colorScheme])

  useEffect(() => {
    getFcmToken();
  }, [])

  async function handleNavigationToRes(data: any, subjectData: any) {
    dispatch(setCustomLoader(true));
    NavigationService.navigate(NavigationService.screens.SubjectResourcesScreen, {
      userData: data,
      notesData: {
        notes: await userFirestoreData(data, 'Notes', subjectData, dispatch),
        syllabus: await userFirestoreData(data, 'Syllabus', subjectData, dispatch),
        questionPapers: await userFirestoreData(data, 'QuestionPapers', subjectData, dispatch),
        otherResources: await userFirestoreData(data, 'OtherResources', subjectData, dispatch),
      },
      subject: subjectData.subject,
    })
    // setResourcesLoaded(false);
  }

  const handleDynamicLink = (link: any) => {
    if (link && link.url) {
      const { userData, notesData, screen } = UtilityService.getDynamicLinkData(link);
      if (userData && notesData) {
        if (screen === 'SubjectResourcesScreen') {
          dispatch(setCustomLoader(true));
          handleNavigationToRes(userData, {
            subject: notesData.subject,
            subjectName: notesData.subject,
          })
        }
        else {
          dispatch(setCustomLoader(true));
          NavigationService.navigate(NavigationService.screens.PdfViewer, {
            userData,
            notesData,
          });
        }
      }
    }
  };

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        handleDynamicLink(link)
      }).catch((error: any) => {
        dispatch(setCustomLoader(false));
        if (error?.code === 'dynamicLinks/initial-link-error') {
          return;
        }
      }
      );
  }, []);

  useEffect(() => {
    firestore()
      .collection('Users')
      .doc(auth()?.currentUser?.uid)
      .get()
      .then((data) => {
        dispatch(setUsersData(data?.data()));
        dispatch(setUsersDataLoaded(true));
        dispatch(HomeAction.fetchNotesList(data?.data()));

        const subscribeArray = data?.data()?.subscribeArray;
        const topics = `${data?.data()?.university}_${data?.data()?.course}_${data?.data()?.branch}_${data?.data()?.sem}`;

        if (subscribeArray.includes(topics)) {
          return;
        }
        else {
          firestore()
            .collection('Users')
            .doc(auth()?.currentUser?.uid)
            .update({
              'subscribeArray': [topics]
            })
        }
      });
  }, []);


  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    if (bookmarkList.length === 0) {
      AsyncStorage.getItem('userBookMarks').then(data => {
        if (data && data !== '[]') {
          const list = JSON.parse(data);
          dispatch(setBookmarks(list));
        }
        else {
          fetchBookmarksList(dispatch, setBookmarks, setListData);
        }
      });
    }
    else {
      return;
    }
  }, []);

  return (
    <ScreenLayout name="Home" >
      <ResourceLoader />
      <CustomLoader />
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
                  NavigationService.navigate(NavigationService.screens.Profile)
                }} >
                  <Image source={{
                    uri: usersProfileData.userProfile || auth().currentUser?.photoURL,
                  }} style={styles.userImg} />
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text style={styles.salutation}>Welcome back</Text>
                  <Text style={styles.userName}>
                    {usersProfileData.usersData?.name}
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
