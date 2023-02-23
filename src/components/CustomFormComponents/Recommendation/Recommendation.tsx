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

type MyStackParamList = {
  SubjectResources: {userData: object; notesData: string; subject: string};
};
type MyScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'SubjectResources'
>;
type Props = {};

const Recommendation = (props: Props) => {
  const userData = useSelector((state: any) => {
    return state.usersData;
  });
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<MyScreenNavigationProp>();
  const [list, setList] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  //if reccommendSubjects key exists in async storage then load from there
  //else load from firestore and save to async storage
  //and after loading in background check if any new subjects are added
  //if yes then update the async storage and redux store

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
    try {
      firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .get()
        .then(async (userFirestoreData: any) => {
          setList([]);
          await firestore()
            .collection('Universities')
            .doc('OU')
            .collection(`${userFirestoreData.data().Course}`)
            .doc(`${userFirestoreData.data().Branch}`)
            .collection(`${userFirestoreData.data().Sem}`)
            .doc('SubjectsList')
            .get()
            .then(async data => {
              let updatedList: {
                subjectName: string;
                notes: string[];
                otherResources: string[];
                questionPapers: string[];
                syllabus: string[];
              }[] = [];
              for (const items of data.data()?.list) {
                await firestore()
                  .collection('Universities')
                  .doc('OU')
                  .collection(`${userFirestoreData.data().Course}`)
                  .doc(`${userFirestoreData.data().Branch}`)
                  .collection(`${userFirestoreData.data().Sem}`)
                  .doc('Subjects')
                  .collection(items.subjectName)
                  .get()
                  .then(item => {
                    updatedList.push({
                      subjectName: items.subjectName,
                      notes: item.docs[0]?.data().list,
                      otherResources: item.docs[1]?.data().list,
                      questionPapers: item.docs[2]?.data().list,
                      syllabus: item.docs[3]?.data().list,
                    });
                  });
              }
              setList(
                updatedList.filter(
                  (item: object, index: number, self: any) =>
                    self.indexOf(item) === index,
                ),
              );
              dispatch(setReccommendSubjects(updatedList));
              dispatch(setReccommendSubjectsLoaded(true));
              setLoaded(true);
            });
        });
    } catch (error) {
      Toast.show({
        title: 'Error loaidng data',
      });
    }
  }

  // useEffect(() => {
  //   setList([]);
  //   setLoaded(false);
  //   fetchData();
  // }, [userData]);

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
                    navigation.navigate('SubjectResources', {
                      userData: userData.usersData,
                      notesData: item,
                      subject: item.subjectName,
                    });
                  }}>
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
                          name={item.notes?.length > 0 ? 'check' : 'cross'}
                          size={20}
                          color={
                            item.notes?.length > 0
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>

                      <View style={styles.subjectCategory}>
                        <Text style={styles.subjectCategoryText}>Syllabus</Text>
                        <Entypo
                          name={item.syllabus?.length > 0 ? 'check' : 'cross'}
                          size={20}
                          color={
                            item.syllabus?.length > 0
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
                            item.questionPapers?.length > 0 ? 'check' : 'cross'
                          }
                          size={20}
                          color={
                            item.questionPapers?.length > 0
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.container}>
                    <Text style={styles.containerText}>
                      {item.subjectName[0]}
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
