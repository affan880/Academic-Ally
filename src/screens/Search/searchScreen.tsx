import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { Toast } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';

import CustomDropdown from '../../components/CustomFormComponents/Dropdown';
import Form from '../../components/Forms/form';
import { setResourceLoader } from '../../redux/reducers/userState';
import { userFirestoreData } from '../../services/fetch';
import NavigationService from '../../services/NavigationService';
import { searchFilterValidationSchema } from '../../utilis/validation';
import createStyles from './styles';

const { width, height } = Dimensions.get('screen');

const Search = () => {

  const apiResponse = useSelector((state: any) => state?.bootReducer?.utilis?.courses);
  const userData = useSelector((state: any) => { return state.usersData });
  const theme = useSelector((state: any) => state.theme);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const list = useSelector((state: any) => state.subjectsList.list);
  const [subjectListDetail, setSubjectListDetail] = useState(list);
  const [branchData, setBranchesData] = useState([])
  const [semData, setSemData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const dispatch = useDispatch();

  const rendererItems: Array<string> = ['Search', 'Subjects'];
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if ((userData?.usersData?.course !== undefined || userData?.usersData?.course !== null) && (userData?.usersData?.university !== undefined || userData?.usersData?.university !== null)) {
      const branch: any = Object?.keys(apiResponse[userData?.usersData?.university][userData?.usersData?.course])
        .map((branch) => ({
          label: branch,
          value: branch
        }))
      setBranchesData(branch);
    }
    if ((userData?.usersData?.course !== undefined || userData?.usersData?.course !== null) && (userData?.usersData?.university !== undefined || userData?.usersData?.university !== null) && (selectedBranch !== undefined || selectedBranch !== null)) {
      const semesters = apiResponse[userData?.usersData?.university][userData?.usersData?.course][selectedBranch]?.sem.map((value: any, index: any) => {
        return {
          label: (index + 1).toString(),
          value: (index + 1).toString(),
          status: value
        };
      }).filter((value: any) => value.status === true);

      setSemData(semesters);
    }
  }, [selectedBranch]);

  useEffect(() => {
    const filteredSubjects = list?.filter((item: any) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const lowerCaseBranch = selectedBranch.toLowerCase();
      const lowerCaseSem = selectedSem.toLowerCase();
      const lowerCaseSubject = item.subject.toLowerCase();

      const matchesSearchTerm =
        searchTerm !== ''
          ? lowerCaseSubject.includes(lowerCaseTerm) ||
          generateAbbreviation(lowerCaseSubject).includes(lowerCaseTerm)
          : true;
      const matchesBranch = selectedBranch !== '' ? item.branch.toLowerCase().includes(lowerCaseBranch) : true;
      const matchesSem = selectedSem !== '' ? item.sem.toLowerCase().includes(lowerCaseSem) : true;

      return matchesSearchTerm && matchesBranch && matchesSem;
    });

    const unfilteredSubjects = list?.filter((item: any) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const lowerCaseBranch = selectedBranch.toLowerCase();
      const lowerCaseSem = selectedSem.toLowerCase();
      const lowerCaseSubject = item.subject.toLowerCase();

      const matchesSearchTerm =
        searchTerm !== ''
          ? lowerCaseSubject.includes(lowerCaseTerm) ||
          generateAbbreviation(lowerCaseSubject).includes(lowerCaseTerm)
          : true;
      const matchesBranch = selectedBranch !== '' ? item.branch.toLowerCase().includes(lowerCaseBranch) : true;
      const matchesSem = selectedSem !== '' ? item.sem.toLowerCase().includes(lowerCaseSem) : true;

      return !matchesSearchTerm || !matchesBranch || !matchesSem;
    });

    const sortedSubjects: any = [...filteredSubjects, ...unfilteredSubjects];

    setFilteredData(sortedSubjects);
  }, [list, searchTerm, selectedBranch, selectedSem, subjectListDetail]);


  const generateAbbreviation = (subject: string) => {
    const words = subject.split(' ');
    const excludedTerms = ['of', 'for', 'and'];
    const abbreviation = words
      .filter((word) => !excludedTerms.includes(word.toLowerCase()))
      .map((word) => word.charAt(0))
      .join('');
    return abbreviation.toLowerCase();
  };

  const selectedSubject = async (item: any) => {
    dispatch(setResourceLoader(true));
    try {
      const userData: any = await firestore().collection('Users').doc(auth().currentUser?.uid).get();
      const customizedData = {
        university: userData.data().university,
        course: userData.data().course,
        branch: item.branch,
        sem: item.sem,
      };
      const notesData = {
        notes: await userFirestoreData(customizedData, 'Notes', { subjectName: item.subject }, dispatch),
        otherResources: await userFirestoreData(customizedData, 'OtherResources', { subjectName: item.subject }, dispatch),
        questionPapers: await userFirestoreData(customizedData, 'QuestionPapers', { subjectName: item.subject }, dispatch),
        syllabus: await userFirestoreData(customizedData, 'Syllabus', { subjectName: item.subject }, dispatch),
        subjectName: item.subject,
      };

      dispatch(setResourceLoader(false));
      NavigationService.navigate(NavigationService.screens.ResourcesCategories, {
        userData: {
          course: userData.data().course,
          branch: item.branch,
          sem: item.sem,
          university: userData.data().university,
        },
        notesData: notesData,
        subject: item.subject,
      });
    } catch (error) {
      dispatch(setResourceLoader(false));
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
          <Feather name="search" size={theme.sizes.iconMedium} color="#FFFFFF" />
          <Text style={styles.headerText}>Explore</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <FlatList
            data={rendererItems}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }: { item: string }) => {
              switch (item) {
                case 'Search':
                  return (
                    <View>
                      <View style={styles.searchContainer}>
                        <TextInput
                          value={searchTerm}
                          onChangeText={(text) => setSearchTerm(text)}
                          placeholder="Search"
                          placeholderTextColor={theme.colors.primaryText}
                          style={styles.searchInput}
                        />
                        <Feather
                          name="search"
                          size={theme.sizes.iconSmall}
                          color={theme.colors.primaryText}
                          style={styles.searchIcon}
                        />
                      </View>
                      <Form initialValues={{ branch: '', sem: '' }} onSubmit={(values) => { console.log("tfuy", values) }} validationSchema={searchFilterValidationSchema} >
                        <View style={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginHorizontal: width * 0.05,
                          flexDirection: 'row',
                        }}>
                          <CustomDropdown
                            name="branch"
                            data={branchData}
                            placeholder='Filter by branch'
                            leftIcon="Safety"
                            width={width / 2.3}
                            handleOptions={(item: any) => {
                              if (item?.value) {
                                setSelectedBranch(item?.value);
                              }
                            }}
                          />
                          <CustomDropdown
                            name="sem"
                            data={semData}
                            placeholder='Filter by sem'
                            leftIcon="Safety"
                            width={width / 2.3}
                            handleOptions={(item: any) => {
                              if (item?.value) {
                                setSelectedSem(item?.value);
                                console.log("item", item)
                              }
                            }}
                          />
                        </View>
                      </Form>
                    </View>
                  );
                case 'Subjects':
                  return (
                    <View
                      style={{
                        paddingBottom: height * 0.08,
                        marginTop: height * 0.02,
                      }}
                    >
                      <FlatList
                        data={filteredData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }: any) => {
                          return (
                            <TouchableOpacity style={styles.subjectItem} onPress={() => selectedSubject(item)}>
                              <View style={styles.containerBox}>
                                <View style={styles.containerText} />
                              </View>
                              <View style={styles.subjectItemTextContainer}>
                                <Text style={styles.subjectItemText}>{item.subject}</Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    width: '100%',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text style={styles.subjectItemBranch}>branch:</Text>
                                  <Text style={styles.subjectItemBranchText}>{item.branch}</Text>
                                </View>
                                <Text style={styles.subjectItemSem}>sem: {item.sem}</Text>
                              </View>
                            </TouchableOpacity>
                          );
                        }}
                        ListEmptyComponent={() => {
                          return (
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: theme.sizes.lottieIconHeight,
                              }}
                            >
                              <LottieView
                                source={require('../../assets/lottie/NoBookMarks.json')}
                                autoPlay
                                loop
                              />
                            </View>
                          );
                        }}
                      />
                    </View>
                  );
                default:
                  return null;
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Search;