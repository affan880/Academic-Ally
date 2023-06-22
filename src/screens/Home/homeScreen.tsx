import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import QuickAccess from '../../components/CustomFormComponents/QuickAccess/QuickAccess';
import CustomLoader from '../../components/loaders/CustomLoader';
import ResourceLoader from '../../components/loaders/ResourceLoader';
import ScreenLayout from '../../layouts/screenLayout';
import { setDarkTheme, setLightTheme } from '../../redux/reducers/theme';
import { setCustomLoader, setResourceLoader } from '../../redux/reducers/userState';
import Recommendation from '../../sections/Home/Recommendation/Recommendation';
import { getFcmToken } from '../../services/fetch';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';
import HomeAction from './homeAction';
import createStyles from './styles';

const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = useSelector((state: any) => state.theme);
  const dispatch: any = useDispatch();
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const usersProfileData = useSelector((state: any) => state.usersData);
  const [listData, setListData] = useState([]);
  const bookmarkList = useSelector((state: any) => state.userBookmarkManagement).userBookMarks;

  useEffect(() => {
    colorScheme === 'dark' ? dispatch(setDarkTheme()) : dispatch(setLightTheme());
  }, [colorScheme]);

  useEffect(() => {
    dispatch(HomeAction.loadUserData());
    dispatch(HomeAction.loadBoomarks(bookmarkList, setListData));
    getFcmToken();
  }, []);

  const handleDynamicLink = (link: string) => {
    if (link) {
      const { userData, notesData, screen } = UtilityService.getDynamicLinkData(link);
      if (userData && notesData) {
        if (screen === 'SubjectResourcesScreen') {
          dispatch(setCustomLoader(true));
          dispatch(HomeAction.getSubjectResources(userData, { subject: notesData.subject, subjectName: notesData.subject }));
        } else {
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
        handleDynamicLink(link);
      })
      .catch((error: any) => {
        dispatch(setCustomLoader(false));
        if (error?.code === 'dynamicLinks/initial-link-error') {
          return;
        }
      });
  }, []);

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link: any) => handleDynamicLink(link));
    return () => unsubscribe();
  }, []);

  return (
    <ScreenLayout name="Home">
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
                <TouchableOpacity
                  style={styles.userImgContainer}
                  onPress={() => {
                    NavigationService.navigate(NavigationService.screens.Profile);
                  }}>
                  <Image
                    source={{
                      uri: usersProfileData.userProfile || auth().currentUser?.photoURL,
                    }}
                    style={styles.userImg}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text style={styles.salutation}>Welcome back</Text>
                  <Text style={styles.userName}>{usersProfileData.usersData?.name}</Text>
                </View>
              </View>
              <TouchableOpacity>
                {theme.theme === 'light' ? (
                  <FontAwesome5
                    onPress={() => {
                      dispatch(setDarkTheme());
                    }}
                    name="cloud-moon"
                    color={'#ffffff'}
                    size={20}
                  />
                ) : (
                  <Ionicons
                    onPress={() => {
                      dispatch(setLightTheme());
                    }}
                    name="md-sunny"
                    color={'#ffffff'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <QuickAccess
          selected={selectedCategory}
          setSelectedCategory={(option) => {
            setSelectedCategory(option);
          }}
        />
        <View style={styles.recommendedContainer}>
          <Text style={styles.recommendedText}>Recommended</Text>
          <View>
            <Recommendation
              selected={selectedCategory}
              setResourcesLoaded={(option: boolean) => {
                dispatch(setResourceLoader(option));
              }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default HomeScreen;