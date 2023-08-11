import { useIsFocused } from '@react-navigation/native'
import LottieView from 'lottie-react-native';
import { Toast } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import CustomDropdown from '../../components/CustomFormComponents/Dropdown';
import Form from '../../components/Forms/form';
import CustomLoader from '../../components/loaders/CustomLoader';
import { firestoreDB } from '../../Modules/auth/firebase/firebase';
import { setCustomLoader, setResourceLoader } from "../../redux/reducers/userState";
import { userFirestoreData } from '../../services/fetch';
import NavigationService from '../../services/NavigationService';
import { searchFilterValidationSchema } from '../../utilis/validation';
import createStyles from './styles';

const { width, height } = Dimensions.get('screen');

interface item {
  sem: string,
  branch: string,
  subject: string,
}

const Search = React.memo(() => {

  const apiResponse = useSelector((state: any) => state?.bootReducer?.utilis?.courses) || [];
  const userData = useSelector((state: any) => { return state.usersData });
  const {uid}: any = useSelector((state: any) => state.bootReducer.userInfo);
  const theme = useSelector((state: any) => state.theme);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const list = useSelector((state: any) => state.subjectsList.list);
  const [branchData, setBranchesData] = useState([])
  const [semData, setSemData] = useState([]);
  const [filteredData, setFilteredData] = useState(list);
  let scroollPostion: any;
  const [saveScroll, setScroll]= useState(null);
  const listRef = useRef<any>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const rendererItems: Array<string> = ['Search', 'Subjects'];
  const [searchTerm, setSearchTerm] = useState('');
  const [reload, setReload] = useState(false);


  useEffect(() => {
    const run = async () =>{
      const val: any = await listRef.current?.scrollToOffset({ offset: saveScroll })
      return val
    }
    if (isFocused) {
      saveScroll !== null ? dispatch(setCustomLoader(true)) : null
          saveScroll !== null ? 
          run().then(()=>dispatch(setCustomLoader(false)))
          : null
    }

    return () => {
      // Run your function here when the component is unmounted (navigated back)
      console.log('Component is unmounted (navigated back)');
    };
  }, [isFocused]);


  useEffect(() => {
    if (userData?.usersData && apiResponse[userData?.usersData?.university][userData?.usersData?.course]?.sem?.length !== 0) {
      const branch: any = Object.keys(apiResponse[userData?.usersData?.university][userData?.usersData?.course])?.map((branch) => ({
        label: branch,
        value: branch,
      }));
      if (branch.length > 0) {
        setBranchesData(branch);
      }
      else {
        setBranchesData([])
      }
    }
  }, [reload]);

  useEffect(() => {
    const semesters = apiResponse[userData?.usersData?.university][userData?.usersData?.course][selectedBranch || userData?.usersData?.branch]?.sem?.map((value: any, index: any) => {
      return {
        label: (index + 1).toString(),
        value: (index + 1).toString(),
        status: value
      };
    }).filter((value: any) => value.status === true);
    if (semesters?.length > 0) {
      setSemData(semesters);
    }
    else {
      setSemData([])
    }
  }, [selectedBranch, reload]);

  const filterData = () => {
    let filteredList = list;

    if (searchTerm !== '') {
      const lowercaseSearchTerm = searchTerm?.toLowerCase();
      filteredList = filteredList.filter(
        (item: item) =>
          item?.subject?.toLowerCase()?.includes(lowercaseSearchTerm) ||
          generateAbbreviation(item?.subject)?.includes(lowercaseSearchTerm)
      );
    }

    if (selectedBranch !== '') {
      filteredList = filteredList.filter(
        (item: item) => item?.branch === selectedBranch
      );
    }

    if (selectedSem !== '') {
      filteredList = filteredList?.filter((item: item) => item?.sem === selectedSem);
    }

    const similarItems = list.filter(
      (item: item) =>
        item?.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        generateAbbreviation(item?.subject)?.includes(searchTerm?.toLowerCase())
    );

    if (selectedBranch !== '') {
      const similarBranchItems = similarItems.filter(
        (item: item) => item?.branch === selectedBranch
      );

      if (similarBranchItems.length > 0) {
        const otherItems = similarItems.filter(
          (item: item) => item?.branch !== selectedBranch
        );
        const orderedItems = similarBranchItems.concat(otherItems);
        setFilteredData(orderedItems);
        return;
      }
    }

    setFilteredData(similarItems);

    if (selectedSem !== '' && selectedBranch === '') {
      filteredList = list.filter((item: item) => item?.sem === selectedSem);
    }
    if (selectedSem !== '' && selectedBranch !== '') {
      filteredList = filteredData.filter((item: item) => item?.sem === selectedSem);
    }

    setFilteredData(filteredList);
  };

  useEffect(() => {
    filterData();
  }, [selectedBranch, selectedSem, searchTerm]);


  const generateAbbreviation = (subject: string) => {
    const words = subject.split(' ');
    const excludedTerms: any = ['of', 'for', 'and'];
    const abbreviation = words
      .filter((word) => !excludedTerms.includes(word.toLowerCase()))
      .map((word) => word.charAt(0))
      .join('');
    return abbreviation.toLowerCase();
  };

  const selectedSubject = async (item: any) => {
    dispatch(setResourceLoader(true));
    try {
      const userData: any = await firestoreDB().collection('Users').doc(uid).get();
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
      NavigationService.navigate(NavigationService.screens.SubjectResourcesScreen, {
        userData: {
          course: userData.data().course,
          branch: item.branch,
          sem: item.sem,
          university: userData.data().university,
        },
        notesData: notesData,
        subject: item.subject,
        branch: item?.branch
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
          <Ionicons name="search-circle-sharp" size={theme.sizes.iconMedium} color="#F1F1FA" />
          <Text style={styles.headerText}>Explore</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <FlatList
            data={rendererItems}
            showsVerticalScrollIndicator={false}
            ref={listRef}
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
                        {
                          (searchTerm === '' && selectedBranch === '' && selectedSem === '') &&
                          <Feather
                            name="search"
                            size={theme.sizes.iconSmall}
                            color={theme.colors.primaryText}
                            style={styles.searchIcon}
                          />
                        }
                        {
                          (searchTerm !== '' || selectedBranch !== '' || selectedSem !== '') &&
                          <MaterialIcons
                            onPress={() => {
                              setSearchTerm('');
                              setSelectedBranch('');
                              setSelectedSem('');
                              setFilteredData(list);
                              setReload(!reload)
                            }}
                            name="clear"
                            size={theme.sizes.iconSmall}
                            color={theme.colors.primaryText}
                            style={styles.searchIcon}
                          />
                        }
                      </View>
                      <Form initialValues={{ branch: '', sem: '' }} onSubmit={(values) => { }} validationSchema={searchFilterValidationSchema}>
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
                        onScroll={(event: any)=>{
                          scroollPostion = event.nativeEvent.contentOffset.y
                        }}
                        renderItem={({ item }: any) => {
                          return (
                            <TouchableOpacity style={styles.subjectItem} onPress={() => {
                              selectedSubject(item);
                              setScroll(scroollPostion)
                            }}>
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
});

export default Search;