import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import NotesCard from '../../components/notes/notesCard';
import NavigationLayout from '../../interfaces/navigationLayout';
import NavigationService from '../../services/NavigationService';
import createStyles from './styles';

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
      course: string;
      branch: string;
      sem: string;
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

const NotesList = (props: Props) => {
  const theme = useSelector((state: any) => state.theme);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
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
  const { userData } = route.params;
  const { notesData } = route.params;
  const { selected } = route.params;
  const { subject } = route.params;

  return (
    <>
      <NavigationLayout rightIconFalse={true} title={subject} handleScroll={handleScroll} >
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
            <View key={item.id}>
              <NotesCard item={item} userData={userData} notesData={notesData} selected={selected} subject={subject} />
            </View>
          );
        })}
      </NavigationLayout>
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate(NavigationService.screens.Upload, {
              userData: userData,
              notesData: notesData,
              selected: selected,
              subject: subject,
            });
          }}
          style={styles.btn}>
          <Text
            style={styles.uploadBtnText}>
            Upload
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default NotesList;

const styles = StyleSheet.create({});
