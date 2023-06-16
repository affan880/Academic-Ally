import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Notes, OtherRes, Qp, Syllabus } from '../../assets/images/icons';
import CustomLoader from '../../components/loaders/CustomLoader';
import NavigationLayout from '../../interfaces/navigationLayout';
import { userAddToRecents } from '../../redux/reducers/usersRecentPdfsManager';
import { setCustomLoader } from "../../redux/reducers/userState";
import { setResourceLoader } from '../../redux/reducers/userState';
import NavigationService from '../../services/NavigationService';
import createStyles from './styles';

type RootStackParamList = {
  Home: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: string;
  };
};
type MyStackParamList = {
  NotesList: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
  UploadScreen: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
};
type MyScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'NotesList'
>;

type notesTypes = {
  name: string;
};

const NotesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const { userData } = route.params;
  const { notesData }: any = route.params;
  const { subject }: any = route.params;
  const [notesbtnStyle, setNotesStyle] = useState(false);
  const [syllabusbtnStyle, setSyllabusStyle] = useState(false);
  const [qpbtnStyle, setQpStyle] = useState(false);
  const [otherResbtnStyle, setOtherResStyle] = useState(false);
  const [selected, setSelected] = useState('');
  const navigation = useNavigation<MyScreenNavigationProp>();
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.theme);
  const [loading, setLoading] = useState(false);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);

  const subjectTitle: string =
    subject.length > 20 ? subject.slice(0, 25) + '...' : subject;

  useEffect(() => {
    dispatch(setResourceLoader(false));
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

  function handleNavigation(category: string) {
    setSelected(category);
    setLoading(true);
    notesData[category]?.length > 0
      ? (NavigationService.navigate(NavigationService.screens.Resources, {
        userData: userData,
        notesData: notesData[category],
        selected: category,
        subject: subject,
      }),
        setLoading(false))
      : (NavigationService.navigate(NavigationService.screens.Upload, {
        userData: userData,
        notesData: notesData,
        selected: category,
        subject: subject,
      }),
        setLoading(false));
    dispatch(setCustomLoader(false))
  }

  return !loading ? (
    <NavigationLayout rightIconFalse={true} title={subjectTitle} handleScroll={() => { }} >
      <CustomLoader />
      <View style={styles.header}>
        <Text style={styles.headerText}>Resources</Text>
      </View>
      <View style={styles.categoryBtnsContainer}>
        <View>
          {notesData?.syllabus?.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.categoryBtns,
                syllabusbtnStyle ? styles.categoryBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(false);
                setSyllabusStyle(true);
                setQpStyle(false);
                setOtherResStyle(false);
                setLoading(true);
                setSelected('syllabus');
                handleNavigation('syllabus');
              }}>
              <Syllabus />
              <Text style={styles.btnText}>Syllabus</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.disabledBtn,
                syllabusbtnStyle ? styles.disabledBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(false);
                setSyllabusStyle(true);
                setQpStyle(false);
                setOtherResStyle(false);
                setLoading(true);
                setSelected('syllabus');
                handleNavigation('syllabus');
              }}>
              <Syllabus />
              <Text style={styles.btnText}>Syllabus</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          {notesData?.notes?.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.categoryBtns,
                notesbtnStyle ? styles.categoryBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(true);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(false);
                setLoading(true);
                setSelected('notes');
                handleNavigation('notes');
              }}>
              <Notes />
              <Text style={styles.btnText}>Notes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.disabledBtn,
                notesbtnStyle ? styles.disabledBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(true);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(false);
                setLoading(true);
                setSelected('notes');
                handleNavigation('notes');
              }}>
              <Notes />
              <Text style={styles.btnText}>Notes</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          {notesData?.questionPapers?.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.categoryBtns,
                qpbtnStyle ? styles.categoryBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(true);
                setOtherResStyle(false);
                setLoading(true);
                setSelected('questionPapers');
                handleNavigation('questionPapers');
              }}>
              <Qp />
              <Text style={styles.btnText}>Question Papers</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.disabledBtn,
                qpbtnStyle ? styles.disabledBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(true);
                setOtherResStyle(false);
                setLoading(true);
                setSelected('questionPapers');
                handleNavigation('questionPapers');
              }}>
              <Qp />
              <Text style={styles.btnText}>Question Papers</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          {notesData?.otherResources?.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.categoryBtns,
                otherResbtnStyle ? styles.categoryBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(true);
                setLoading(true);
                setSelected('otherResources');
                handleNavigation('otherResources');
              }}>
              <OtherRes />
              <Text style={styles.btnText}>Other Resources</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.disabledBtn,
                otherResbtnStyle ? styles.disabledBtnClicked : null,
              ]}
              onPress={() => {
                dispatch(setCustomLoader(true))
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(true);
                setLoading(true);
                setSelected('otherResources');
                handleNavigation('otherResources');
              }}>
              <OtherRes />
              <Text style={styles.btnText}>Other Resources</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </NavigationLayout>
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
        style={{ position: 'absolute', bottom: 0, marginTop: 300 }}
        source={require('../../assets/lottie/loading-text.json')}
        autoPlay
        loop
      />
    </View>
  );
};

export default NotesScreen;
