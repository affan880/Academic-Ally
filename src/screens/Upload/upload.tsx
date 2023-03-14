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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Ionicons name="cloud-upload" size={theme.sizes.iconMedium} color="#FFFFFF" />
          <Text style={styles.headerText}>Upload</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          
        </View>
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
