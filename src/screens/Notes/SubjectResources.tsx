import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {
  RouteProp,
  useNavigation,
  useRoute,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import NavigationLayout from '../../interfaces/navigationLayout';
import createStyles from './styles';
import {NavBtn} from '../../components/CustomFormComponents/CustomBtn';
import {Syllabus, Notes, Qp, OtherRes} from '../../assets/images/icons';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userAddToRecents} from '../../redux/reducers/usersRecentPdfsManager';

type RootStackParamList = {
  Home: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
  };
};
type MyStackParamList = {
  NotesList: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
  UploadScreen: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
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

type uploadScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'UploadScreen'
>;

type notesTypes = {
  fileName: string;
};

const NotesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const {userData} = route.params;
  const {notesData}: any = route.params;
  const {subject}: any = route.params;
  const [notesbtnStyle, setNotesStyle] = useState(false);
  const [syllabusbtnStyle, setSyllabusStyle] = useState(false);
  const [qpbtnStyle, setQpStyle] = useState(false);
  const [otherResbtnStyle, setOtherResStyle] = useState(false);
  const [selected, setSelected] = useState('');
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<MyScreenNavigationProp>();
  const dispatch = useDispatch();
  const recentViews = useSelector((state: any) => state.userRecentPdfs);
  // console.log('recentViews', recentViews);

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

  return (
    <NavigationLayout rightIconFalse={true}>
      <View style={styles.categoryBtnsContainer}>
        <View>
          {notesData?.syllabus?.length > 0 ? (
            <TouchableOpacity
              style={[
                styles.categoryBtns,
                syllabusbtnStyle ? styles.categoryBtnClicked : null,
              ]}
              onPress={() => {
                setNotesStyle(false);
                setSyllabusStyle(true);
                setQpStyle(false);
                setOtherResStyle(false);
                setSelected('syllabus');
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
                setNotesStyle(false);
                setSyllabusStyle(true);
                setQpStyle(false);
                setOtherResStyle(false);
                setSelected('syllabus');
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
                setNotesStyle(true);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(false);
                setSelected('notes');
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
                setNotesStyle(true);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(false);
                setSelected('notes');
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
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(true);
                setOtherResStyle(false);
                setSelected('questionPapers');
              }}>
              <Qp />
              <Text style={styles.btnText}>QP</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.disabledBtn,
                qpbtnStyle ? styles.disabledBtnClicked : null,
              ]}
              onPress={() => {
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(true);
                setOtherResStyle(false);
                setSelected('questionPapers');
              }}>
              <Qp />
              <Text style={styles.btnText}>QP</Text>
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
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(true);
                setSelected('otherResources');
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
                setNotesStyle(false);
                setSyllabusStyle(false);
                setQpStyle(false);
                setOtherResStyle(true);
                setSelected('otherResources');
              }}>
              <OtherRes />
              <Text style={styles.btnText}>Other Resources</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.selectBtn}>
        <NavBtn
          title={
            selected === ''
              ? 'Select'
              : notesData[selected]?.length > 0
              ? 'Select'
              : 'Upload'
          }
          color={
            selected === ''
              ? '#7A7D7D'
              : notesData[selected]?.length > 0
              ? '#6360FF'
              : '#FF8181'
          }
          onPress={() => {
            selected === ''
              ? null
              : notesData[selected]?.length > 0
              ? navigation.navigate('NotesList', {
                  userData: userData,
                  notesData: notesData,
                  selected: selected,
                  subject: subject,
                })
              : navigation.navigate('UploadScreen', {
                  userData: userData,
                  notesData: notesData,
                  selected: selected,
                  subject: subject,
                });
          }}
        />
      </View>
    </NavigationLayout>
  );
};

export default NotesScreen;
