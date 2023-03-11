import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import createStyles from './styles';
import QuickAccess from '../../components/CustomFormComponents/QuickAccess/QuickAccess';
import Recommendation from '../../components/CustomFormComponents/Recommendation/Recommendation';
import ScreenLayout from '../../interfaces/screenLayout';
import {useSelector, useDispatch} from 'react-redux';
import {setUsersData, setUsersDataLoaded} from '../../redux/reducers/usersData';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import LottieView from 'lottie-react-native';
import ResourceLoader from '../../components/loaders/ResourceLoader';
import {  setSubjectsList,  setListLoaded,} from '../../redux/reducers/subjectsList';
import { setResourceLoader } from '../../redux/reducers/userState';
import {Toast} from 'native-base';
import { fetchNotesList } from '../../services/fetch';

type MyStackParamList = {
  Notes: {itemId: number};
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
};
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'Notes'>;
type Props = {};

const HomeScreen = (props: Props) => {
  const styles = useMemo(() => createStyles(), []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const navigation =
    useNavigation<StackNavigationProp<MyStackParamList, 'Notes'>>();
  const dispatch = useDispatch();
  const userFirestoreData = useSelector((state: any) => state.usersData);
  const userDataLoaded = useSelector(
    (state: any) => state.usersData.usersDataLoaded,
  );
  const subjectsList = useSelector((state: any) => state.subjectsList);
  const handleDynamicLink = (link: any) => {
    const parts = link?.url.split('/');
    console.log('parts', parts);
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
      units : parts[9]
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
      })
      .catch(error => {
        console.log('error ar homescreen.js', error);
        dispatch(setUsersDataLoaded(false));
        Toast.show({
          title: 'Check your internet connection and try again later',
          duration: 3000,
        });
      });

    const getData = async () => {
      fetchNotesList(dispatch, setSubjectsList, setListLoaded); 
    };
    getData();
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  return (
 <ScreenLayout>
      <ResourceLoader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginBottom: 70,
          backgroundColor: '#6360FF',
        }}>
        <View style={styles.header}>
          <View>
            <View style={styles.userInfo}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={styles.userImgContainer}>
                  <Image source={{
                    uri: userFirestoreData.userProfile || auth().currentUser?.photoURL,
                  }} style={styles.userImg} />
                </View>
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
              {/* <TouchableOpacity>
                <Ionicons
                  name="ios-notifications-outline"
                  color={'#ffffff'}
                  size={20}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        <QuickAccess selected={selectedCategory} setSelectedCategory={(option)=>{
          setSelectedCategory(option)
        }} />
        <View
          style={{
            marginTop: -120,
            backgroundColor: '#F1F1FA',
            paddingTop: 80,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            minHeight: 600,
          }}>
          <Text
            style={{
              color: '#161719',
              lineHeight: 30,
              fontSize: 16,
              fontWeight: '700',
              fontFamily: 'DM Sans',
              paddingLeft: 20,
              fontStyle: 'normal',
            }}>
            Recommended
          </Text>
          <View>
            <Recommendation selected={selectedCategory} setResourcesLoaded = {(option :boolean)=>{
              dispatch(setResourceLoader(option))
            }} />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default HomeScreen;
