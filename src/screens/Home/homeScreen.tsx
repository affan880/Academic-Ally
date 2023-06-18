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
import ResourceLoader from '../../components/loaders/ResourceLoader';
import ScreenLayout from '../../interfaces/screenLayout';
import { setDarkTheme, setIsPotrait, setLightTheme } from '../../redux/reducers/theme';
import { setBookmarks } from '../../redux/reducers/userBookmarkManagement';
import { setUsersData, setUsersDataLoaded } from '../../redux/reducers/usersData';
import { setResourceLoader } from '../../redux/reducers/userState';
import { fetchBookmarksList, getFcmToken } from '../../services/fetch';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';
import HomeAction from './homeAction';
import createStyles from './styles';
import FirebaseService from '../../services/FirebaseService';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const theme = useSelector((state: any) => { return state.theme });
  const dispatch: any = useDispatch();
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const userFirestoreData = useSelector((state: any) => state.usersData);
  const [listData, setListData] = useState([]);
  const [message, setMessage] = React.useState<any>(null);
  const bookmarkList = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;

  async function bootstrap() {
    await inAppMessaging().setMessagesDisplaySuppressed(true);
  }


  const allowToReceiveMessage = async (isAllowed: any) => {
    // console.log(inAppMessaging().isMessagesDisplaySuppressed)
    await inAppMessaging().setMessagesDisplaySuppressed(isAllowed)
  };

  useEffect(() => {
    inAppMessaging().setMessagesDisplaySuppressed(false);
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      const orientation = width > height ? false : true;
      dispatch(setIsPotrait(orientation));
    };

    updateOrientation();

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    inAppMessaging().setMessagesDisplaySuppressed(false);
  }, [])
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { data }: any = remoteMessage;
      FirebaseService.requestUserPermission()
      setMessage(data);
      await analytics().logEvent('notification_received', data);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    colorScheme === 'dark' ? dispatch(setDarkTheme()) : dispatch(setLightTheme());
  }, [colorScheme])

  useEffect(() => {
    getFcmToken();
  }, [])

  const handleDynamicLink = (link: any) => {
    if (link && link.url) {
      const { userData, notesData } = UtilityService.getDynamicLink(link)
      if (userData && notesData) {
        NavigationService.navigate(NavigationService.screens.PdfViewer, {
          userData,
          notesData,
        });
      }
    }
  };

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link: any) => {
        handleDynamicLink(link)
      }).catch((error: any) => {
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
      .then((data: any) => {
        dispatch(setUsersData(data?.data()));
        dispatch(setUsersDataLoaded(true));
        dispatch(HomeAction.fetchNotesList(data?.data()));
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
    <ScreenLayout name="Home" children={undefined}>
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
                  NavigationService.navigate(NavigationService.screens.Profile)
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
