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
import usersData, {setUsersData} from '../../redux/reducers/usersData';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {setSubjectsList} from '../../redux/reducers/subjectsList';

const User = require('../../assets/images/user.jpg');

type MyStackParamList = {
  Notes: {itemId: number};
  PdfViewer: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: {
      Course: string;
      Branch: string;
      Sem: string;
      Subject: string;
      subject: string;

      category: string;
      notesId: string;
      fileName: string;
    };
  };
};
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'Notes'>;
type Props = {};

const HomeScreen = (props: Props) => {
  const styles = useMemo(() => createStyles(), []);
  const navigation =
    useNavigation<StackNavigationProp<MyStackParamList, 'Notes'>>();
  const dispatch = useDispatch();
  const userFirestoreData = useSelector((state: any) => state.usersData);
  const subjectsList = useSelector((state: any) => state.subjectsList);

  const handleDynamicLink = (link: any) => {
    const parts = link?.url.split('/');
    const userData = {
      Course: parts[4],
      Branch: parts[5],
      Sem: parts[6],
    };
    const notesData = {
      Course: parts[4],
      Branch: parts[5],
      Sem: parts[6],
      Subject: parts[7],
      subject: parts[7],
      category: parts[3],
      notesId: parts[8],
      fileName: parts[7],
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
      });

    const getData = async () => {
      try {
        const list: any = await AsyncStorage.getItem('subjectsList');
        if (list?.length === 0 && list !== null) {
          dispatch(setSubjectsList(JSON.parse(list)));
        } else {
          firestore()
            .collection('QueryList')
            .doc('OU')
            .collection('B.E')
            .doc('SubjectsListDetail')
            .get()
            .then((doc: any) => {
              const subjectsList = doc.data().list;
              dispatch(setSubjectsList(subjectsList));
            });
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, [usersData]);

  return (
    <ScreenLayout>
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
                  <Image source={User} style={styles.userImg} />
                </View>
                <View
                  style={{
                    marginLeft: 10,
                  }}>
                  <Text style={styles.salutation}>Welcome back</Text>
                  <Text style={styles.userName}>
                    {userFirestoreData.usersData?.Name}
                  </Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons
                  name="ios-notifications-outline"
                  color={'#ffffff'}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <QuickAccess />
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
            <Recommendation />
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
};

export default HomeScreen;
