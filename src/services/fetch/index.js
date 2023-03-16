import { Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Toast, CheckIcon } from 'native-base';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useDispatch } from 'react-redux';
import { setVisitedSubjects } from '../../redux/reducers/subjectsList';

export const userFirestoreData = async (userData, type, item, dispatch) => {
  let list = [];
  await firestore()
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
    });
  dispatch(setVisitedSubjects({ subject: list, status: type, subjectName: item.subjectName, branch: userData.branch, sem: userData.sem }));
  return list;
}

const checkIfDocExists = async (item, type, usersData) => {
  const status = await firestore()
    .collection('Universities')
    .doc(`${usersData.usersData.university}`)
    .collection(`${usersData.usersData.course}`)
    .doc(`${usersData.usersData.branch}`)
    .collection(`${usersData.usersData.sem}`)
    .doc(type)
    .collection(item.subjectName)
    .get().then((querySnapshot) => {
      if (querySnapshot.docs.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  return status;
}

export const fetchSubjectList = async (setList, dispatch, setReccommendSubjects, setReccommendSubjectsLoaded, setLoaded, usersData) => {
  await firestore()
    .collection('Users')
    .doc(auth().currentUser?.uid)
    .get()
    .then(async (userFirestoreData) => {
      let updatedList = [];
      await firestore()
        .collection('Universities')
        .doc(userFirestoreData.data().university).collection(userFirestoreData.data().course === 'BE' ? 'B.E' : userFirestoreData.data().course)
        .doc(userFirestoreData.data().branch)
        .collection(userFirestoreData.data().sem)
        .doc('SubjectsList')
        .get().then(async (item) => {
          for (const items of item.data().list) {
            updatedList.push(
              {
                subjectName: items.subjectName,
                Notes: await checkIfDocExists(items, 'Notes', usersData),
                OtherResources: await checkIfDocExists(items, 'OtherResources', usersData),
                QuestionPapers: await checkIfDocExists(items, 'QuestionPapers', usersData),
                Syllabus: await checkIfDocExists(items, 'Syllabus', usersData)
              }
            )
          };
          setList(
            updatedList.filter(
              (item, index, self) =>
                self.indexOf(item) === index,
            ),
          );
          dispatch(setReccommendSubjects(updatedList));
          dispatch(setReccommendSubjectsLoaded(true));
          setLoaded(true);
        })
    }).catch((error) => {
      console.log("Error getting document:", error);
    }
    );
}

export const fetchBookmarksList = async (dispatch, setBookmarks, setListData) => {
  await firestore()
    .collection('Users')
    .doc(auth().currentUser?.uid)
    .get()
    .then(async (userFirestoreData) => {
      let updatedList = [];
      await firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .collection('NotesBookmarked')
        .get().then(async (item) => {
          for (const items of item.docs) {
            updatedList.push(items.data())
          };
          dispatch(setBookmarks(updatedList));
          setListData(updatedList);
        })
    }).catch((error) => {
      console.log("Error getting document:", error);
    }
    );
}

export const fetchNotesList = async (dispatch, setSubjectsList, setListLoaded, university) => {
  try {
    const list = await AsyncStorage.getItem('subjectsList');
    if (list?.length !== 0 && list !== null) {
      dispatch(setSubjectsList(JSON.parse(list)));
      dispatch(setListLoaded(true));
    } else {
      firestore()
        .collection('QueryList')
        .doc(`${university}`)
        .collection('BE')
        .doc('SubjectsListDetail')
        .get()
        .then((doc) => {
          const subjectsList = doc.data().list;
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

export async function ViewCount(data) {
  try {
    await firestore()
      .collection('Universities')
      .doc(`${data.university}`)
      .collection(`${data.course}`)
      .doc(`${data.branch}`)
      .collection(`${data.sem}`)
      .doc(`${data.type}`)
      .collection(`${data.subjectName}`)
      .doc(`${data.id}`)
      .update({
        views: firebase.firestore.FieldValue.increment(1) || 0
      })
  }
  catch (error) {
    console.log(error);
  }
}

async function addToUSersRateList(data, rating) {
  await firestore()
    .collection('Users')
    .doc(auth().currentUser?.uid)
    .collection('RatedList')
    .doc(`${data.did}`)
    .set({
      subject: data.subjectName,
      rating: rating,
      category: data.type,
      university: data.university,
      course: data.course,
      branch: data.branch,
      sem: data.sem,
      id: data.id,
      did: data.did,
      name: data.name,
      size: data.size,
      college: data.college,
      uploaderId: data.uploaderId,
      uploaderName: data.uploaderName,
    })
}

export async function submitRating(data, newRating) {
  const rate = (newRating + data.rating)
  const rating = rate / 2;
  if (data.rating === 0) {
    try {
      await firestore()
        .collection('Universities')
        .doc(data.university)
        .collection(data.course)
        .doc(data.branch)
        .collection(data.sem)
        .doc(data.type)
        .collection(data.subjectName)
        .doc(data.id)
        .update({
          rating: newRating,
        })
      addToUSersRateList(data, newRating);

    }
    catch (error) {
      console.log(error);
    }
  }
  else {
    try {
      await firestore()
        .collection('Universities')
        .doc(data.university)
        .collection(data.course)
        .doc(data.branch)
        .collection(data.sem)
        .doc(data.type)
        .collection(data.subjectName)
        .doc(data.id)
        .update({
          rating: rating,
        })
      addToUSersRateList(data, rating);
    }
    catch (error) {
      console.log(error);
    }
  }
}

export async function submitReport(userData, ReportData) {
  try {
    await firestore()
      .collection('userReports')
      .doc(userData.university)
      .collection(userData.course)
      .doc(userData.branch)
      .collection(userData.sem)
      .doc(auth().currentUser?.uid)
      .set({
        ...userData,
        uid: auth().currentUser?.uid,
        report: ReportData,
      })
  }
  catch (error) {
    Toast.show({
      title: 'Something went wrong',
      duration: 3000,
    });
  }
}

export async function getMailId() {
  const mail = await firestore()
    .collection('utils')
    .doc('mail')
    .get()
    .then((doc) => {
      return doc.data().mailId;
    }
    )
    .catch(error => {
      Toast.show({
        title: 'Something went wrong',
        duration: 3000,
      });
    }
    );
  return mail;
}

export const shareNotes = async (notesData) => {
  const link = await dynamicLinks().buildShortLink(
    {
      link: `https://getacademically.co/${notesData.category}/${notesData.course}/${notesData.branch}/${notesData.sem}/${notesData.subject}/${notesData.did}/${notesData.units}//${notesData.name}`,
      domainUriPrefix: 'https://academicallyapp.page.link',
      android: {
        packageName: 'com.academically',
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  ).catch((error) => {
    Toast.show({
      title: 'Something went wrong, Please try again later',
      duration: 3000,
    })
  });
  Share.share({
    title: `${notesData.subject} ${notesData.category} `,
    message: `I just discovered some amazing ${notesData.course} ${notesData.sem}th semester ${notesData.subject} on Academic Ally! Check them out 📚!
      ${link}`,
  });
}

export const ratedResourcesList = async () => {
  const list = await firestore()
    .collection('Users')
    .doc(auth().currentUser?.uid)
    .get()
    .then(async (userFirestoreData) => {
      let updatedList = [];
      await firestore()
        .collection('Users')
        .doc(auth().currentUser?.uid)
        .collection('RatedList')
        .get().then(async (item) => {
          for (const items of item.docs) {
            updatedList.push(items.id)
          };
        })
      return updatedList;
    }).catch((error) => {
      console.log("Error getting document:", error);
    }
    );
  return list;
}