import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import createStyles from './styles';
import {useSelector} from 'react-redux';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import {Toast} from 'native-base';
import {
  setReccommendSubjects,
  setReccommendSubjectsLoaded,
} from '../../../redux/reducers/subjectsList';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAddToRecents } from '../../../redux/reducers/usersRecentPdfsManager';
import { fetchSubjectList, userFirestoreData} from '../../../services/fetch'

type MyStackParamList = {
  SubjectResources: {userData: object; notesData: any; subject: string};
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
  UploadScreen: {
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

type MyScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'SubjectResources'
>;
type Props = {
  selected : string
};

const Recommendation = (props: Props) => {
  const userData = useSelector((state: any) => {
    return state.usersData;
  });
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<MyScreenNavigationProp>();
  const [list, setList] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    AsyncStorage.getItem('reccommendSubjects').then(data => {
      if (data && data !== '[]') {
        setList(JSON.parse(data));
        setLoaded(true);
      } else {
        setList([]);
        setLoaded(false);
        fetchData();
      }
    });
  }, [userData]);

  async function fetchData() {
    fetchSubjectList(setList,dispatch, setReccommendSubjects, setReccommendSubjectsLoaded, setLoaded,userData);
  }

  useEffect(() => {
    const getRecents = async () => {
      AsyncStorage.getItem('RecentsManagement').then(res => {
        if (res !== null || res !== undefined) {
          const recentViews = JSON.parse(res as any);
          dispatch(userAddToRecents(recentViews));
        }
      });
    };
    getRecents();
  }, []);

  async function handleNavigation(item: any, category: string) {
    item[category]? (
      navigation.navigate('NotesList', {
        userData: userData.usersData,
        notesData: await userFirestoreData(userData.usersData, category, item),
        selected: category,
        subject: item.subjectName,
      })
    ) : (navigation.navigate('UploadScreen', {
          userData: userData.usersData,
          notesData: await userFirestoreData(userData.usersData, category, item),
          selected: category,
          subject: item.subjectName,
        })
    )
  }

  async function handleNavigationToRes(item:any) {
     navigation.navigate('SubjectResources', {
      userData: userData.usersData,
      notesData: {
        notes :  await userFirestoreData(userData.usersData, 'Notes', item),
        syllabus :  await userFirestoreData(userData.usersData, 'Syllabus', item),
        questionPapers :  await userFirestoreData(userData.usersData, 'QuestionPapers', item),
        otherResources :  await userFirestoreData(userData.usersData, 'OtherResources', item),
      },
      subject: item.subjectName,
    })
  }

  return (
    <View style={styles.body}>
      {loaded ? (
        list.map((item: any, index) => {
          return (
            <View style={styles.reccomendationContainer} key={index}>
              <View style={styles.reccomendationStyle}>
                <TouchableOpacity
                  style={styles.subjectContainer}
                  onPress={() => {
                    props.selected === 'All' ? (
                      handleNavigationToRes(item)
                    ) : (
                    handleNavigation(item, props.selected)
                    )
                  }}
                  >
                  <View
                    style={{
                      width: '75%',
                      height: '100%',
                      justifyContent: 'space-evenly',
                      alignItems: 'flex-start',
                      paddingLeft: 10,
                      paddingVertical: 15,
                    }}>
                    <Text style={styles.subjectName}>{item.subjectName}</Text>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: 10,
                      }}>
                      <View style={styles.subjectCategory}>
                        <Text style={styles.subjectCategoryText}>Notes</Text>
                        <Entypo
                          name={item.Notes ? 'check' : 'cross'}
                          size={20}
                          color={
                            item.Notes
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>

                      <View style={styles.subjectCategory}>
                        <Text style={styles.subjectCategoryText}>Syllabus</Text>
                        <Entypo
                          name={item.Syllabus ? 'check' : 'cross'}
                          size={20}
                          color={
                            item.Syllabus
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>
                      <View style={styles.subjectCategory}>
                        <Text style={styles.subjectCategoryText}>
                          Question Papers
                        </Text>
                        <Entypo
                          name={
                            item.QuestionPapers ? 'check' : 'cross'
                          }
                          size={20}
                          color={
                            item.QuestionPapers
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.container}>
                    <Text style={styles.containerText}>
                      {item.subjectName.slice(0, 1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 450,
          }}>
          <LottieView
            source={require('../../../assets/lottie/loading.json')}
            autoPlay
            loop
          />
        </View>
      )}
    </View>
  );
};

export default Recommendation;
