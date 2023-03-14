import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo, useState, useRef, useEffect} from 'react';
import ScreenLayout from '../../interfaces/screenLayout';
import createStyles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import {Toast} from 'native-base';
import { userFirestoreData } from '../../services/fetch';
import { setResourceLoader } from '../../redux/reducers/userState';

const Search = () => {
  const theme = useSelector((state: any) => {
    return state.theme;
  });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const list = useSelector((state: any) => state.subjectsList.list);
  const [subjectListDetail, setSubjectListDetail] = useState(list);
  const [limit, setLimit] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();
   
  type MyStackParamList = {
    SubjectResources: {userData: object; notesData: any; subject: string};
  };
  type MyScreenNavigationProp = StackNavigationProp<
    MyStackParamList,
    'SubjectResources'
  >;
  type Props = {};

  const branches = [
    {id: 1, name: 'IT'},
    {id: 2, name: 'CSE'},
    {id: 3, name: 'ECE'},
    {id: 4, name: 'EEE'},
    {id: 5, name: 'MECH'},
    {id: 6, name: 'CIVIL'},
  ];

  // const userFirestoreData = useSelector((state: any) => state.usersData);

  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation<MyScreenNavigationProp>();

  useEffect(() => {
    setFilteredData(
      subjectListDetail?.filter((item: any) => {
        const words = item.subject.split(' ');
        let abbreviation = '';
        for (const word of words) {
          abbreviation += word[0];
        }

        if (searchTerm === '' && selectedBranch !== '') {
          return item.branch
            .toLowerCase()
            .includes(selectedBranch.toLowerCase());
        }

        if (selectedBranch !== '') {
          return (
            (item.branch.toLowerCase().includes(selectedBranch.toLowerCase()) &&
              item.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
            abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else {
          return (
            item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }),
    );
  }, [list, searchTerm, selectedBranch, subjectListDetail]);

  const limitedData = filteredData?.slice(0, limit);

  const selectedSubject = async (item: any) => {
    dispatch(setResourceLoader(true));
    try {
      const userData: any = await firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .get();
        const customizedData = {
          university : userData.data().university,
          course : userData.data().course,
          branch : item.branch,
          sem : item.sem
        }
      const notesData = {
        notes: await userFirestoreData(customizedData,'Notes', { subjectName: item.subject}, dispatch),
        otherResources: await userFirestoreData(customizedData,'OtherResources', { subjectName: item.subject}, dispatch),
        questionPapers: await userFirestoreData(customizedData,'QuestionPapers', { subjectName: item.subject}, dispatch),
        syllabus: await userFirestoreData(customizedData,'Syllabus', { subjectName: item.subject}, dispatch),
        subjectName: item.subject,
      };
      dispatch(setResourceLoader(false));
      navigation.navigate('SubjectResources', {
        userData: {
          course: userData.data().course,
          branch: item.branch,
          sem: item.sem,
        },
        notesData: notesData,
        subject: item.subject,
      });
    } catch (error) {
      setResourceLoader(false),
      Toast.show({
        title: 'Please check your internet connection',
        duration: 3000,
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Ionicons name="search-circle-sharp" size={theme.sizes.iconMedium} color="#FFFFFF" />
          <Text style={styles.headerText}>Explore</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScrollAnimationEnd={() => {
              setLimit(limit + 6);
            }}
            onMomentumScrollEnd={({nativeEvent}) => {
              if (
                nativeEvent.contentOffset.y >=
                nativeEvent.contentSize.height -
                  nativeEvent.layoutMeasurement.height
              ) {
                setLimit(limit + 6);
              }
            }}>
            <View>
              <View style={styles.searchContainer}>
                <TextInput
                  value={searchTerm}
                  onChangeText={text => setSearchTerm(text)}
                  placeholder="Search"
                  placeholderTextColor={'#000000'}
                  style={styles.searchInput}
                />
                <Feather
                  name="search"
                  size={theme.sizes.iconSmall}
                  color="#161719"
                  style={styles.searchIcon}
                />
              </View>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Browse Branches</Text>
                <View style={styles.categoryList}>
                  {branches.map(branch => (
                    <TouchableOpacity
                      key={branch.id}
                      style={[
                        styles.categoryItem,
                        {
                          backgroundColor:
                            selectedBranch === branch.name
                              ? theme.colors.tertiary
                              : theme.colors.primary,
                        },
                      ]}
                      onPress={() => {
                        if (selectedBranch === branch.name) {
                          setSelectedBranch('');
                        } else {
                          setSelectedBranch(branch.name);
                        }
                      }}>
                      <Text style={styles.categoryItemText}>{branch.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View>
              {limitedData?.length > 0 ? (
                limitedData?.map((item: any, index: any) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.subjectItem}
                      onPress={() => selectedSubject(item)}>
                      <View style={styles.containerBox}>
                        <View style={styles.containerText}>
                          {/* <Ionicons
                            name="eye-sharp"
                            size={theme.sizes.iconSmall}
                            color="#fff"
                            style={{
                              alignSelf: 'center',
                              transform: [{rotate: '135deg'}],
                            }}
                          /> */}
                        </View>
                      </View>
                      <View style={styles.subjectItemTextContainer}>
                        <Text style={styles.subjectItemText}>
                          {item.subject}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.subjectItemBranch}>branch:</Text>
                          <Text style={styles.subjectItemBranchText}>
                            {item.branch}
                          </Text>
                        </View>
                        <Text style={styles.subjectItemSem}>
                          sem: {item.sem}
                        </Text>
                      </View>
                    </TouchableOpacity>
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
                    source={require('../../assets/lottie/loading.json')}
                    autoPlay
                    loop
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
