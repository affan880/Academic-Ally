import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Divider, Toast } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Share } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import { useDispatch, useSelector } from 'react-redux';

import { Notes, OtherRes, Qp, Syllabus } from '../../assets/images/icons';
import CustomLoader from '../../components/loaders/CustomLoader';
import ResourceLoader from '../../components/loaders/ResourceLoader';
import MainScreenLayout from '../../layouts/mainScreenLayout';
import { userAddToRecents } from '../../redux/reducers/usersRecentPdfsManager';
import { setCustomLoader, setResourceLoader } from "../../redux/reducers/userState";
import { userFirestoreData } from '../../services/fetch';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';
import createStyles from '../Notes/styles';
import createStylesSearch from '../Search/styles';

type RootStackParamList = {
  Home: {
    userData: {
      university: string;
      course: string;
      branch: string;
      sem: string;
    };
    notesData: any;
    subject: string;
    branch: string;
  };
};

const NotesScreen = React.memo(() => {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const { userData, notesData, subject, branch } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('');

  const FlatListRef: any = useRef(null)

  const list = useSelector((state: any) => state.subjectsList.list);
  const ItemsToRender = ['resourcesBtn', 'otherRelatedResources']
  const [filteredList, setFilteredList] = useState(list);

  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.theme);
  const {uid}: any = useSelector((state: any) => state.bootReducer.userInfo);
  const [loading, setLoading] = useState(false);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const searchScreenStyles = useMemo(() => createStylesSearch(theme.colors, theme.sizes), [theme]);
  const dynamicLink = useSelector((state: any) => state?.bootReducer?.utilis?.dynamicLink);

  const Title: string = branch?.length > 20 ? (UtilityService.generateAbbreviation(branch)).toUpperCase() : branch;
  const Subject: string = subject;

  const selectedSubject = async (item: any) => {
    // FlatListRef.current.scrollToOffset({ offset: 0, animated: true })
    dispatch(setResourceLoader(true));
    try {
      const userData: any = await firestore().collection('Users').doc(uid).get();
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
        branch: item.branch
      });
    } catch (error) {
      dispatch(setResourceLoader(false));
      Toast.show({
        title: 'Please check your internet connection',
        duration: 3000,
      });
    }
  };

  const generateAbbreviation = (subject: string) => {
    const words = subject.split(' ');
    const excludedTerms: any = ['of', 'for', 'and'];
    const abbreviation = words
      .filter((word) => !excludedTerms.includes(word.toLowerCase()))
      .map((word) => word.charAt(0))
      .join('');
    return abbreviation.toLowerCase();
  };


  useEffect(() => {
    if (subject) {
      const similarItems = list.filter(
        (item: any) => (
          item.subject.toLowerCase().includes(subject.toLowerCase()) ||
          generateAbbreviation(item.subject).includes(subject.toLowerCase())
        )
      ).filter((item: any) => item.branch !== branch);

      setFilteredList(similarItems);
    }
  }, [subject]);


  const generateShareLink = () => {
    UtilityService.generateDynamicLink(dynamicLink, {
      university: userData.university,
      course: userData.course,
      branch: userData.branch,
      sem: userData.sem,
      subject: subject,
    }, 'SubjectResourcesScreen').then((link) => {
      Share.share({
        title: `${notesData?.subject}`,
        message: `If you're studying ${subject}, you might find these Resources on Academic Ally helpful. Check them out:${link}`,
      });
    })
  }

  useEffect(() => {
    dispatch(setResourceLoader(false));
    const getRecents = async () => {
      const res = await AsyncStorage.getItem('RecentsManagement');
      if (res) {
        const recentViews = JSON.parse(res);
        dispatch(userAddToRecents(recentViews));
      }
    };
    getRecents();
  }, []);

  const handleNavigation = (category: string) => {
    setLoading(true);
    const selectedNotesData = notesData[category];
    const screenParams = {
      userData,
      notesData: selectedNotesData || notesData,
      selected: category,
      subject,
    };

    NavigationService.navigate(
      selectedNotesData?.length > 0 ? NavigationService.screens.Resources : NavigationService.screens.Upload,
      screenParams
    );

    setLoading(false);
    dispatch(setCustomLoader(false));
  };

  const renderButton = (category: string, Icon: any, label: string) => {
    const isDisabled = !notesData[category]?.length;
    const isActive = selectedCategory === category;

    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryBtns,
          isActive ? styles.categoryBtnClicked : null,
          isDisabled ? styles.disabledBtn : null,
          isDisabled && isActive ? styles.disabledBtnClicked : null,
        ]}
        onPress={() => {
          dispatch(setCustomLoader(true));
          setSelectedCategory(category);
          setLoading(true);
          handleNavigation(category);
        }}
      >
        <Text style={[styles.btnText, { color: theme.colors.black }]}>{label}</Text>
        <Octicons name="arrow-right" style={{
          position: 'absolute',
          right: 15,
          bottom: 10,
        }} size={12} color={theme.colors.primaryText} />
      </TouchableOpacity>
    );
  };

  return !loading ? (
    <MainScreenLayout rightIconFalse={false} title={Title} handleScroll={() => { }} name={Title} handleShare={generateShareLink} >
      <ResourceLoader />
      <CustomLoader />
      <View style={{
        marginTop: 10
      }}>
        <FlatList
          ref={FlatListRef}
          data={ItemsToRender}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            switch (item) {
              case 'resourcesBtn':
                return (
                  <>
                    <Text style={[styles.headerText, {
                      textAlign:'center'
                    }]} >{Subject}</Text>
                    <View style={styles.header}>
                      <Text style={styles.headerText}>Resources</Text>
                    </View>
                    <View style={styles.categoryBtnsContainer}>
                      {renderButton('syllabus', Syllabus, 'Syllabus')}
                      {renderButton('notes', Notes, 'Notes')}
                      {renderButton('questionPapers', Qp, 'Question Papers')}
                      {renderButton('otherResources', OtherRes, 'Other Resources')}
                    </View>
                  </>
                );
              case 'otherRelatedResources':
                return (
                  <>
                    <Divider />
                    <View style={[styles.header, {
                      marginTop: theme.sizes.height * 0.03,
                    }]}>
                      <Text style={styles.headerText}>Related Resources</Text>
                    </View>
                    <FlatList
                      data={filteredList}
                      showsVerticalScrollIndicator={false}
                      horizontal={false}
                      renderItem={({ item }: any) => {
                        return (
                          <TouchableOpacity style={searchScreenStyles.subjectItem} onPress={() => { selectedSubject(item) }}>
                            <View style={searchScreenStyles.containerBox}>
                              <View style={searchScreenStyles.containerText} />
                            </View>
                            <View style={searchScreenStyles.subjectItemTextContainer}>
                              <Text style={searchScreenStyles.subjectItemText}>{item.subject}</Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-start',
                                  width: '100%',
                                  alignItems: 'center',
                                }}
                              >
                                <Text style={searchScreenStyles.subjectItemBranch}>branch:</Text>
                                <Text style={searchScreenStyles.subjectItemBranchText}>{item.branch}</Text>
                              </View>
                              <Text style={searchScreenStyles.subjectItemSem}>sem: {item.sem}</Text>
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
                            <Text style={{
                              fontSize: theme.sizes.font,
                              color: theme.colors.primaryText,
                              marginTop: theme.sizes.height * 0.35,
                              alignSelf: 'center',
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}
                            >No Related Resources Found</Text>
                          </View>
                        );
                      }}
                    />
                  </>
                );
              default:
                return null;
            }
          }}
          keyExtractor={(item, index) => item}
        />
      </View>
    </MainScreenLayout>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <LottieView source={require('../../assets/lottie/loading-doc.json')} autoPlay loop />
      <LottieView
        style={{ position: 'absolute', bottom: 0, marginTop: 300 }}
        source={require('../../assets/lottie/loading-text.json')}
        autoPlay
        loop
      />
    </View>
  );
});

export default NotesScreen;
