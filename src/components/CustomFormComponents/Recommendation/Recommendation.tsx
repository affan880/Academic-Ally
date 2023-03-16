import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import createStyles from './styles';
import {useSelector} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { setReccommendSubjects, setReccommendSubjectsLoaded, setVisitedSubjects } from '../../../redux/reducers/subjectsList';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userAddToRecents } from '../../../redux/reducers/usersRecentPdfsManager';
import { fetchSubjectList, userFirestoreData} from '../../../services/fetch'
import {setDarkTheme, setLightTheme} from '../../../redux/reducers/theme';
import { sizes } from '../../../utilis/colors';

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
  selected : string,
  setResourcesLoaded : any,
};

const Recommendation = ({setResourcesLoaded,selected}: Props) => {
  const userData = useSelector((state: any) => {
    return state.usersData;
  });
  const visitedList = useSelector((state: any) => {
    return state.subjectsList.visitedSubjects.Syllabus;
  });
  const theme = useSelector((state: any) => {
    return state.theme;
  });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const navigation = useNavigation<MyScreenNavigationProp>();
  const [list, setList] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteresList, setFilteresList] = useState<any[]>(list);
  const dispatch = useDispatch();

  useEffect(() => {
    const a = list.filter(obj => obj[selected] === true);
    setFilteresList(a);
  }, [selected, list]);

  useEffect(() => {
    dispatch(setLightTheme());
  }, [theme.theme]);
  useEffect(() => {
    
    AsyncStorage.getItem('reccommendSubjects').then(data => {
      if (data && data !== '[]') {
        setList(JSON.parse(data));
        setFilteresList(JSON.parse(data));
        setLoaded(true);
      } else {
        setList([]);
        setFilteresList([]);
        setLoaded(false);
        fetchData();
      }
    });
  }, [userData]);

  async function fetchData() {
    fetchSubjectList(setList,dispatch, setReccommendSubjects, setReccommendSubjectsLoaded, setLoaded,userData)
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
        notesData: await userFirestoreData(userData.usersData, category, item, dispatch).then(res =>{
          setResourcesLoaded(false);
          return res
        }),
        selected: category,
        subject: item.subjectName,
      })
    ) : (navigation.navigate('UploadScreen', {
          userData: userData.usersData,
          notesData: {
            subject : item.subjectName,
            course : userData.usersData.Course,
            branch : userData.usersData.Branch,
            sem : userData.usersData.Sem,
          },
          selected: category,
          subject: item.subjectName,
        }),
        setResourcesLoaded(false)
    )
    setResourcesLoaded(false);
  }

  async function handleNavigationToRes(item:any) {
     navigation.navigate('SubjectResources', {
      userData: userData.usersData,
      notesData: {
        notes :  await userFirestoreData(userData.usersData, 'Notes', item, dispatch),
        syllabus :  await userFirestoreData(userData.usersData, 'Syllabus', item, dispatch),
        questionPapers :  await userFirestoreData(userData.usersData, 'QuestionPapers', item, dispatch),
        otherResources :  await userFirestoreData(userData.usersData, 'OtherResources', item, dispatch ),
      },
      subject: item.subjectName,
    })
    // setResourcesLoaded(false);
  }
  return (
    <View style={styles.body}>
      {loaded ? (
        (selected === "All" ? list : filteresList).map((item: any, index) => {
          return (
            <View style={styles.reccomendationContainer} key={index}>
              <View style={styles.reccomendationStyle}>
                <TouchableOpacity
                  style={styles.subjectContainer}
                  onPress={() => {
                    selected === 'All' ? (
                      setResourcesLoaded(true),
                      handleNavigationToRes(item)
                    ) : (
                      setResourcesLoaded(true),
                    handleNavigation(item, selected)
                    )
                  }}
                  >
                  <View
                    style={styles.main}>
                    <Text style={styles.subjectName}>{item.subjectName}</Text>
                    <View
                      style={{
                        width: '95%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <View style={styles.subjectCategory}>
                        <Text style={styles.subjectCategoryText}>Notes</Text>
                        <Entypo
                          name={item?.Notes ? 'check' : 'cross'}
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
            height: theme.sizes.lottieIconHeight,
          }}>
          <LottieView
            source={require('../../../assets/lottie/loading.json')}
            autoPlay
            loop
          />
        </View>
      )}
      {
        filteresList.length === 0 && list.length !== 0 ? (
           selected !== 'All' ? (
            <LottieView
           style={{
            height: theme.sizes.lottieIconHeight,
            alignSelf: 'center',
           }}
          source={require('../../../assets/lottie/NoBookMarks.json')}
          autoPlay
          loop
        />
           ):null
        
        ) : null
      }
    </View>
  );
};

export default Recommendation;
