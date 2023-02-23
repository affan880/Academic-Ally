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
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import {Toast} from 'native-base';

const Search = () => {
  const styles = useMemo(() => createStyles(), []);
  const [selectedBranch, setSelectedBranch] = useState('');
  const list = useSelector((state: any) => state.subjectsList.list);
  const [subjectListDetail, setSubjectListDetail] = useState(list);
  const [limit, setLimit] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const userFirestoreData: any = await firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .get();
      const data = await firestore()
        .collection('Universities')
        .doc('OU')
        .collection(userFirestoreData.data().Course)
        .doc(item.branch)
        .collection(item.sem)
        .doc('Subjects')
        .collection(item.subject)
        .get();
      const notesData = {
        notes: data?.docs[0]?.data()?.list || [],
        otherResources: data?.docs[1]?.data()?.list || [],
        questionPapers: data?.docs[2]?.data()?.list || [],
        syllabus: data?.docs[3]?.data()?.list || [],
        subjectName: item.subject,
      };
      setLoading(false);
      navigation.navigate('SubjectResources', {
        userData: {
          Course: userFirestoreData.data().Course,
          branch: item.branch,
          sem: item.sem,
        },
        notesData: notesData,
        subject: item.subject,
      });
    } catch (error) {
      Toast.show({
        title: 'Please check your internet connection',
        duration: 3000,
      });
      setLoading(false);
    }
  };
  return !loading ? (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Ionicons name="search-circle-sharp" size={30} color="#FFFFFF" />
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
                  size={20}
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
                              ? '#FF8181'
                              : '#6360FF',
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
                          <Ionicons
                            name="eye-sharp"
                            size={20}
                            color="#fff"
                            style={{
                              alignSelf: 'center',
                              transform: [{rotate: '135deg'}],
                            }}
                          />
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
                          <Text style={styles.subjectItemBranch}>Branch:</Text>
                          <Text style={styles.subjectItemBranchText}>
                            {item.branch}
                          </Text>
                        </View>
                        <Text style={styles.subjectItemSem}>
                          Sem: {item.sem}
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
                    height: 450,
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
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <LottieView
        source={require('../../assets/lottie/loading-doc.json')}
        autoPlay
        loop
      />
      <LottieView
        style={{position: 'absolute', bottom: 0, marginTop: 300}}
        source={require('../../assets/lottie/loading-text.json')}
        autoPlay
        loop
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
