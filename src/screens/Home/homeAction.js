import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'native-base';

import { firestoreDB, useAuth } from "../../Modules/auth/firebase/firebase"
import { setListLoaded, setSubjectsList } from "../../redux/reducers/subjectsList";
import { setVisitedSubjects } from '../../redux/reducers/subjectsList';
import { setBookmarks } from '../../redux/reducers/userBookmarkManagement';
import { setUsersData, setUsersDataLoaded } from '../../redux/reducers/usersData';
import { setCustomLoader, setResourceLoader } from '../../redux/reducers/userState';
import CrashlyticsService from "../../services/CrashlyticsService";
import NavigationService from '../../services/NavigationService';

class HomeAction {
    static fetchNotesList = (data, val) => async (dispatch) => {
        try {
            const list = await AsyncStorage.getItem('subjectsList');
            if (list?.length !== 0 && list !== null && val === true) {
                dispatch(setSubjectsList(JSON.parse(list)));
                dispatch(setListLoaded(true));
            } else {
                firestoreDB().collection('QueryList')
                    .doc(`${data?.university}`)
                    .collection(`${data?.course}`)
                    .doc('SubjectsListDetail')
                    .get()
                    .then((doc) => {
                        const subjectsList = doc?.data()?.list;
                        dispatch(setSubjectsList(subjectsList));
                        dispatch(setListLoaded(true));
                    })
                    .catch(error => {
                        dispatch(setListLoaded(false));
                        Toast.show({
                            title: 'Check your internet connection and try again later',
                            duration: 3000,
                        });
                    });
            }
        } catch (error) {
            console.error(error);
        }
    }

    static loadUserData = (uid) => (dispatch) => {
        try {
            const userRef = firestoreDB().collection('Users').doc(uid);
        
            const unsubscribe = userRef.onSnapshot((docSnapshot) => {
                const userData = docSnapshot?.data();
                if(uid){
                    dispatch(setUsersData(userData));
                    dispatch(setUsersDataLoaded(true));
                    dispatch(this.fetchNotesList(userData));
                }
                const subscribeArray = userData?.subscribeArray;
                const topics = `${userData?.university}_${userData?.course}_${userData?.branch}_${userData?.sem}`;
        
                if (subscribeArray?.includes(topics)) {
                  return;
                } else {
                  const updatedSubscribeArray = [...(subscribeArray || []), topics];
                  userRef.update({
                    'subscribeArray': updatedSubscribeArray,
                  }).catch(error => console.log(error));
                }
            });
            return () => unsubscribe();
          } catch (error) {
            CrashlyticsService.recordError(error);
          }
    }

    static getResources = (userData, type, item) => async (dispatch) => {
        let list = [];
        try {
            await firestoreDB()
                .collection('Universities')
                .doc(`${userData.university}`)
                .collection(`${userData.course}`)
                .doc(`${userData.branch}`)
                .collection(`${userData.sem}`)
                .doc(type)
                .collection(item.subjectName).get().then((querySnapshot) => {
                    if (querySnapshot.docs.length > 0) {
                        querySnapshot.forEach((doc) => {
                            list.push({
                                ...doc.data(),
                                id: doc.id,
                                branch: userData.branch,
                                sem: userData.sem,
                                university: userData.university || userData.university,
                                course: userData.course || userData.course,
                            });
                        });
                    }
                }).then(() => {
                    dispatch(setVisitedSubjects({ subject: list, status: type, subjectName: item.subjectName, branch: userData.branch, sem: userData.sem }));
                })
            return list;
        }
        catch (error) {
            CrashlyticsService.recordError(error)
        }
    }

    static getSubjectResources = (data, subjectData) => async (dispatch) => {
        try {
            const notes = await dispatch(this.getResources(data, 'Notes', subjectData));
            const syllabus = await dispatch(this.getResources(data, 'Syllabus', subjectData));
            const questionPapers = await dispatch(this.getResources(data, 'QuestionPapers', subjectData));
            const otherResources = await dispatch(this.getResources(data, 'OtherResources', subjectData));

            NavigationService.navigate(NavigationService.screens.SubjectResourcesScreen, {
                userData: data,
                notesData: {
                    notes,
                    syllabus,
                    questionPapers,
                    otherResources,
                },
                subject: subjectData.subjectName,
            });
            dispatch(setCustomLoader(false));
        } catch (error) {
            CrashlyticsService.recordError(error);
        }
    }

    static getBookmarksList = (setListData, uid) => (dispatch) => {
        try {
          const unsubscribe = firestoreDB()
            .collection('Users')
            .doc(uid)
            .collection('NotesBookmarked')
            .onSnapshot((querySnapshot) => {
              const updatedList = querySnapshot?.docs?.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              dispatch(setBookmarks(updatedList));
              setListData(updatedList);
            });
          return unsubscribe;
        } catch (error) {
          CrashlyticsService.recordError(error);
        }
      };
      

    static loadBoomarks = (bookmarkList, setListData, uid) => (dispatch) => {
        try {
            if (bookmarkList?.length === 0) {
                AsyncStorage.getItem('userBookMarks').then(data => {
                    if (data && data !== '[]') {
                        const list = JSON.parse(data);
                        dispatch(setBookmarks(list));
                    }
                    else {
                        dispatch(this.getBookmarksList(setListData, uid));
                    }
                });
            }
            else {
                return;
            }
        }
        catch (error) {
            CrashlyticsService.recordError(error);
        }
    }
}

export default HomeAction;