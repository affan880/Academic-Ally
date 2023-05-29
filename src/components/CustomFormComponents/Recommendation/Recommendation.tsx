import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { HStack, Skeleton, VStack } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';

import { setReccommendSubjects, setReccommendSubjectsLoaded, setVisitedSubjects } from '../../../redux/reducers/subjectsList';
import { setDarkTheme, setLightTheme } from '../../../redux/reducers/theme';
import { userAddToRecents } from '../../../redux/reducers/usersRecentPdfsManager';
import { fetchSubjectList, userFirestoreData } from '../../../services/fetch'
import NavigationService from '../../../services/NavigationService';
import { sizes } from '../../../utilis/colors';
import createStyles from './styles';

type MyStackParamList = {
  SubjectResources: { userData: object; notesData: any; subject: string };
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
  selected: string,
  setResourcesLoaded: any,
};

const Recommendation = ({ setResourcesLoaded, selected }: Props) => {
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

  async function fetchData() {
    await fetchSubjectList(setList, dispatch, setReccommendSubjects, setReccommendSubjectsLoaded, setLoaded, userData)
  }

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
    item[category] ? (
      NavigationService.navigate(NavigationService.screens.Resources, {
        userData: userData.usersData,
        notesData: await userFirestoreData(userData.usersData, category, item, dispatch).then(res => {
          setResourcesLoaded(false);
          return res
        }),
        selected: category,
        subject: item.subjectName,
      })
    ) : (NavigationService.navigate(NavigationService.screens.Upload, {
      userData: userData.usersData,
      notesData: {
        subject: item.subjectName,
        course: userData.usersData.Course,
        branch: userData.usersData.Branch,
        sem: userData.usersData.Sem,
      },
      selected: category,
      subject: item.subjectName,
    }),
      setResourcesLoaded(false)
    )
    setResourcesLoaded(false);
  }

  async function handleNavigationToRes(item: any) {
    NavigationService.navigate(NavigationService.screens.ResourcesCategories, {
      userData: userData.usersData,
      notesData: {
        notes: await userFirestoreData(userData.usersData, 'Notes', item, dispatch),
        syllabus: await userFirestoreData(userData.usersData, 'Syllabus', item, dispatch),
        questionPapers: await userFirestoreData(userData.usersData, 'QuestionPapers', item, dispatch),
        otherResources: await userFirestoreData(userData.usersData, 'OtherResources', item, dispatch),
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
                    <Text style={styles.subjectName}>{
                      (item?.subjectName).toLowerCase().split(' ').map((s: string) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
                    }</Text>
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
                            item?.Notes
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>

                      <View style={styles.subjectCategory}>
                        <Text style={styles.subjectCategoryText}>Syllabus</Text>
                        <Entypo
                          name={item?.Syllabus ? 'check' : 'cross'}
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
                            item?.QuestionPapers
                              ? styles.subjectCategoryCheckIcon.color
                              : styles.subjectCategoryUnCheckIcon.color
                          }
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.container}>
                    <Text style={styles.containerText}>
                      {item?.subjectName.slice(0, 1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      ) : (
        <VStack space={2}>
          {
            [1, 2, 3, 4].map((item, index) => {
              return (
                <VStack style={styles.reccomendationContainer} key={index} borderWidth="1" space={8} overflow="hidden" rounded="md" _dark={{
                  borderColor: "coolGray.500"
                }} _light={{
                  borderColor: "coolGray.200"
                }}>
                  <HStack style={styles.reccomendationStyle}>
                    <VStack space={6} alignItems="flex-start" w={'70%'}>
                      <Skeleton.Text px="4" lines={2} />
                      <HStack space="6" alignItems="center" w={'60%'} justifyContent="space-around" px="4" >
                        <Skeleton h="3" flex="1" rounded="full" startColor="coolGray.100" />
                        <Skeleton h="3" flex="1" rounded="full" startColor="coolGray.100" />
                        <Skeleton h="3" flex="1" rounded="full" startColor="coolGray.100" />
                      </HStack>
                    </VStack>
                    <Skeleton borderColor="coolGray.600" endColor="warmGray.50" size="20" marginRight={4} rounded="md" />
                  </HStack>
                </VStack>
              )
            })
          }
        </VStack>
      )}
      {
        loaded && filteresList.length === 0 && list.length === 0 ? (
          <LottieView
            style={{
              height: theme.sizes.lottieIconHeight,
              alignSelf: 'center',
            }}
            source={require('../../../assets/lottie/NoBookMarks.json')}
            autoPlay
            loop
          />
        ) : null
      }
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
          ) : null

        ) : null
      }
    </View>
  );
};

export default Recommendation;
