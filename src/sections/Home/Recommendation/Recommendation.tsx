import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { HStack, Skeleton, VStack } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';

import { setReccommendSubjects, setReccommendSubjectsLoaded } from '../../../redux/reducers/subjectsList';
import { userAddToRecents } from '../../../redux/reducers/usersRecentPdfsManager';
import HomeAction from '../../../screens/Home/homeAction';
import { fetchSubjectList, userFirestoreData } from '../../../services/fetch'
import NavigationService from '../../../services/NavigationService';
import createStyles from './styles';

type Props = {
  selected: string,
  setResourcesLoaded: any,
};

const Recommendation = ({ setResourcesLoaded, selected }: Props) => {
  const userData = useSelector((state: any) => {
    return state.usersData;
  });
  const theme = useSelector((state: any) => {
    return state.theme;
  });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [list, setList] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filteresList, setFilteresList] = useState<any[]>(list);
  const dispatch = useDispatch<any>();

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
        userData: userData?.usersData,
        notesData: await userFirestoreData(userData?.usersData, category, item, dispatch).then(res => {
          setResourcesLoaded(false);
          return res
        }),
        selected: category,
        subject: item.subjectName,
        branch: item?.branch
      })
    ) : (NavigationService.navigate(NavigationService.screens.Upload, {
      userData: userData?.usersData,
      notesData: {
        subject: item?.subjectName,
        course: userData?.usersData?.Course,
        branch: userData?.usersData?.Branch,
        sem: userData?.usersData?.Sem,
      },
      selected: category,
      subject: item?.subjectName,
    }),
      setResourcesLoaded(false)
    )
    setResourcesLoaded(false);
  }

  async function handleNavigationToRes(item: any) {
    const dispatchFunction = HomeAction.getSubjectResources(userData?.usersData, item);
    dispatch(dispatchFunction);
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
                    <Text style={styles.containerText} />
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
