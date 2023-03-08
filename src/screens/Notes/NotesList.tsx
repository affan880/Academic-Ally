import {StyleSheet, Text, View, TouchableOpacity, Animated} from 'react-native';
import React, {useMemo, useState, useRef} from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useDispatch, useSelector} from 'react-redux';
import NavigationLayout from '../../interfaces/navigationLayout';
import createStyles from './styles';
import {manageBookmarks} from '../../Modules/auth/firebase/firebase';
import {userAddToRecentsStart} from '../../redux/reducers/usersRecentPdfsManager';
import {
  userAddBookMarks,
  userRemoveBookMarks,
} from '../../redux/reducers/userBookmarkManagement';
import {NavBtn} from '../../components/CustomFormComponents/CustomBtn';
import NotesCard from '../../components/notes/notesCard';

type Props = {};
type RootStackParamList = {
  NotesList: {
    userData: any;
    notesData: any;
    selected: string;
    subject: string;
  };
};
type MyStackParamList = {
  NotesList: {
    userData: any;
    notesData: string;
    selected: string;
    subject: string;
  };
  PdfViewer: {
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
    userData: any;
    notesData: string;
    selected: string;
    subject: string;
  };
};

type pdfViewer = StackNavigationProp<MyStackParamList, 'PdfViewer'>;

function remove(str: string) {
  if (str.includes('(oufastupdates.com)') || str.includes('.pdf')) {
    let text = str.replace(/\(oufastupdates.com\)|\.pdf/g, '');
    if (text.length > 15) {
      return text.substring(0, 15) + '...';
    }
    return str;
  }
}

const NotesList = (props: Props) => {
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<pdfViewer>();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }

  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const {userData} = route.params;
  const {notesData} = route.params;
  const {selected} = route.params;
  const {subject} = route.params;

  return (
    <>
      <NavigationLayout rightIconFalse={true}  title={subject} >
        <View style={styles.notesListHeaderContainer}>
          <View
            style={{
              width: '75%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <Text style={styles.notesListHeaderText}>
              Results for {selected} of "{subject}"
            </Text>
          </View>
          <View
            style={{
              width: '25%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.notesListValueText}>
              Total {notesData.length}
            </Text>
          </View>
        </View>
        {notesData.map((item: any, index: number) => {
          return (
            <View key={index}>
            <NotesCard key={index} item={item} userData={userData} notesData={notesData} selected={selected} subject={subject} />
            </View>
          );
        })}
      </NavigationLayout>
      <Animated.View style={{opacity: fadeAnim}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UploadScreen', {
              userData: userData,
              notesData: notesData,
              selected: selected,
              subject: subject,
            });
          }}
          style={{
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
            backgroundColor: '#FF8181',
            width: '90%',
            height: 60,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 0,
            shadowOpacity: 0.5,
          }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              paddingVertical: 10,
            }}>
            Upload
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default NotesList;

const styles = StyleSheet.create({});
