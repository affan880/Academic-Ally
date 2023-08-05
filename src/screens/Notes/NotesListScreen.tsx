import { RouteProp, useIsFocused, useRoute } from '@react-navigation/native'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoader from '../../components/loaders/CustomLoader';
import NotesCard from '../../components/notes/notesCard';
import MainScreenLayout from '../../layouts/mainScreenLayout';
import { setCustomLoader, setResourceLoader } from "../../redux/reducers/userState";
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

const NotesList = React.memo((props: Props) => {
  const theme = useSelector((state: any) => state.theme);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [uploadButtonVisible, setUploadButtonVisible] = useState(true);
  const components = ['subjectDetails', 'notesList']
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [scroollPostion, setScrollPosition] = useState(null)
  const [saveScroll, setScroll]= useState(null);
  const listRef = useRef<any>();
  const isFocused = useIsFocused();
  const dispatch = useDispatch()
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
      null
    };
  }, [isFocused]);
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const windowHeight = event.nativeEvent.layoutMeasurement.height;
    setScrollPosition(event.nativeEvent.contentOffset.y)

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
      <CustomLoader />
      <MainScreenLayout rightIconFalse={true} title={subjectName} handleScroll={handleScroll} name="SubjectList" >
        <VirtualizedList
          data={components}
          ref={listRef}
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
                            <NotesCard item={item} userData={userData} notesData={notesData} selected={selected} subject={subject} setScroll = {() => {
                              setScroll(scroollPostion)
                            }} />
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
          initialNumToRender={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          ListFooterComponent={() => {
            return (
              <View style={{ height: 50 }} />
            )
          }}
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
});

export default NotesList;

const styles = StyleSheet.create({});
