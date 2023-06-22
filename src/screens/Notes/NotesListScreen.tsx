import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import NotesCard from '../../components/notes/notesCard';
import MainScreenLayout from '../../layouts/mainScreenLayout';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';
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

const NotesList = (props: Props) => {
  const theme = useSelector((state: any) => state.theme);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const dispatch = useDispatch();
  const [uploadButtonVisible, setUploadButtonVisible] = useState(true);
  const components = ['subjectDetails', 'notesList']
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const windowHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setUploadButtonVisible(false);
    } else if (offsetY + windowHeight < contentHeight) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setUploadButtonVisible(true);
    } else {
      // User is at the end of the list
      setUploadButtonVisible(false);
    }
  };


  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const { userData } = route.params;
  const { notesData } = route.params;
  const { selected } = route.params;
  const { subject } = route.params;

  const subjectName: string = subject.length > 20 ? (UtilityService.generateAbbreviation(subject)).toUpperCase() : subject;

  return (
    <>
      <MainScreenLayout rightIconFalse={true} title={subjectName} handleScroll={handleScroll} name="SubjectList" >
        <VirtualizedList
          data={components}
          renderItem={({ item, index }: any) => {
            switch (item) {
              case 'subjectDetails':
                return (
                  <View style={styles.notesListHeaderContainer} key={index + Math.random()}>
                    <View
                      style={{
                        width: '80%',
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
                        width: '20%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                      }}>
                      <Text style={styles.notesListValueText}>
                        Total {notesData.length}
                      </Text>
                    </View>
                  </View>
                );
              case 'notesList':
                return (
                  <View key={index}>
                    <VirtualizedList
                      data={notesData}
                      renderItem={({ item, index }: any) => {
                        return (
                          <View key={index + Math.random()}>
                            <NotesCard item={item} userData={userData} notesData={notesData} selected={selected} subject={subject} />
                          </View>
                        );
                      }}
                      keyExtractor={(item: any) => item.name}
                      getItemCount={(data) => data.length}
                      getItem={(data, index) => data[index]}
                      initialNumToRender={6}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                );

              default:
                return null;
            }
          }}
          keyExtractor={(item: any) => item}
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        />
      </MainScreenLayout>
      {
        uploadButtonVisible && <Animated.View style={{ opacity: fadeAnim }}>
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
      }
    </>
  );
};

export default NotesList;

const styles = StyleSheet.create({});
