import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { CheckIcon, Toast } from 'native-base';

import { setUsersData } from '../../../redux/reducers/usersData';
import { setCustomLoader } from '../../../redux/reducers/userState';

export const firestoreDB = () => {
  return firestore();
};

export const useAuth = () => {
  return auth();
};

export const getCurrentUser = () => {
  return auth().currentUser;
};

export const updateFirestoreData = async (uid, data, dispatch) => {
  firestore()
    .collection('Users')
    .doc(`${uid}`)
    .update(data)
    .then(() => {
      dispatch(setUsersData(data));
      Toast.show({
        title: 'Profile Updated',
        type: 'success',
        placement: 'top-right',
        backgroundColor: '#00b300',
      });
    })
    .catch(error => {
      console.log(error);
    });
};

export const manageBookmarks = async (notesData, status) => {
  !status ? await firestore()
    .collection('Users')
    .doc(`${getCurrentUser().uid}`)
    .collection('NotesBookmarked')
    .doc(`${notesData.did}`)
    .set({
      ...notesData
    })
    :
    removeBookmark(notesData);
};
export const removeBookmark = async item => {
  firestore()
    .collection('Users')
    .doc(`${getCurrentUser().uid}`)
    .collection('NotesBookmarked')
    .doc(`${item.did}`)
    .delete();
};

export const createList = (item) => {
  const sep = item.fullPath.split('/');
  sep.length === 3 && item.type === 'Folder'
    ? firestore()
      .collection('Universities')
      .doc('JNTUH')
      .collection('BTECH')
      .doc(sep[0])
      .collection(sep[1])
      .doc('SubjectsList')
      .update({
        list: firebase.firestore.FieldValue.arrayUnion({
          subjectName: item.name,
          subjectId: item.id,
        }),
      })
    : null
  console.log(sep);
}

export const AddtoUserUploads = async (notesData) => {
  console.log(notesData);
  await firestore()
    .collection('Users')
    .doc(`${getCurrentUser().uid}`)
    .collection('UserUploads')
    .doc()
    .set({
      ...notesData
    })
};

export function listBase(notes) {
  notes.map(item => {
    const sep = item.fullPath.split('/');
    console.log(sep[0], sep[1], sep[2]);
    sep.length === 5 && item.type !== 'Folder'
      ? firestore()
        .collection('Universities')
        .doc('OU')
        .collection('BE')
        .doc(sep[0])
        .collection(sep[1])
        .doc(sep[3])
        .collection(sep[2]).doc().set(
          {
            Year: "",
            category: sep[3],
            college: "",
            course: 'BE',
            date: Date.now(),
            department: "IT",
            did: item.id,
            dlink: '',
            name: sep[4],
            rating: 0,
            sem: sep[1],
            size: item.size,
            status: "verified",
            subject: sep[2],
            time: new Date().getTime(),
            units: "",
            uploaderId: "8056itcLayZY8yDbNdi7KbqXnsw2",
            uploaderName: "Affan",
            views: 0
          }
        )
      : null;
    // /"I.T/5/Computer Networks/OtherResources/CNQuestion bank.pdf"

    // console.log('list start', sep[1]);
    // sep.length === 3 && item.type === 'Folder'
    //   ? firestore()
    //     .collection('Universities')
    //     .doc('JNTUH')
    //     .collection('BTECH')
    //     .doc(sep[0])
    //     .collection(sep[1])
    //     .doc('SubjectsList')
    //     .set({
    //       list: [],
    //     })
    //   : null;
  });
}

export function list(notes) {
  ///Universities/JNTUH/BTECH/IT/2/Syllabus/Applied Physics Lab/9tAPO2ZgVDDHo7ud30BR
  console.log('list start', notes?.length);
  notes.map(item => {
    const sep = item.fullPath.split('/');
    console.log(`Universities/JNTUH/BTECH/${sep[0]}/${sep[1]}/${sep[3]}/${sep[2]}`)
    console.log(sep.length === 5 && item.type === 'Files' && sep[4] !== 'desktop.ini' ? 'true' : 'false')
    sep.length === 5 && item.type === 'Files' && sep[4] !== 'desktop.ini'
      ? firestore().collection(`Universities/JNTUH/BTECH/${sep[0]}/${sep[1]}/${sep[3]}/${sep[2]}`).doc().set({
        Year: "",
        category: sep[3],
        college: "",
        course: 'BTECH',
        date: Date.now(),
        department: sep[0],
        did: item.id,
        dlink: '',
        name: sep[4],
        rating: 0,
        sem: sep[1],
        size: item.size,
        status: "verified",
        subject: sep[2],
        time: new Date().getTime(),
        units: "",
        uploaderId: "8056itcLayZY8yDbNdi7KbqXnsw2",
        uploaderName: "Affan",
        views: 0
      })

      : null;
  }, []);
}

export const SubjectList = async (notes) => {
  notes.map(item => {
    const sep = item.fullPath.split('/');
    console.log(sep[0], sep[1], sep[2]);
    sep.length === 3 && item.type === 'Folder' && sep[1] === "8"
      ? firestore()
        .collection('Universities')
        .doc('JNTUH')
        .collection('BTECH')
        .doc(sep[0])
        .collection(sep[1])
        .doc('SubjectsList')
        .update({
          list: firebase.firestore.FieldValue.arrayUnion({
            subjectName: sep[2],
            Notes: true,
            QuestionPapers: true,
            Syllabus: false,
            OtherResources: false,
          }),
        })
      : null;
  });
  console.log('list start Done');
};

export const UpdateItemInTheList = async (notes) => {
  const a = [notes[4], notes[5], notes[6]]
  notes.map(item => {
    const sep = item.fullPath.split('/');
    sep.length === 5 && item.type === 'Files'
      ? firestore()
        .collection('Universities')
        .doc('OU')
        .collection('BE')
        .doc(sep[0])
        .collection(sep[1])
        .doc(sep[3])
        .collection(sep[2])
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, sep[2]);
            firestore()
              .collection('Universities')
              .doc('JNTUH')
              .collection('BTECH')
              .doc(sep[0])
              .collection(sep[1])
              .doc(sep[3])
              .collection(sep[2])
              .doc(`${doc.id}`).update({
                subject: sep[2],
              }
              )
          });
        })
      : null;
  }
  );
  console.log('list start Done');
};


export const QueryList = async (notes) => {
  notes.map(item => {
    const sep = item.fullPath.split('/');
    console.log(sep[0], sep[1], sep[2]);
    sep.length === 3 && item.type === 'Folder'
      ? firestore()
        .collection('QueryList')
        .doc('JNTUH')
        .collection('BTECH')
        .doc('SubjectsListDetail')
        .update({
          list: firebase.firestore.FieldValue.arrayUnion({
            subject: sep[2],
            sem: sep[1],
            branch: sep[0],
          }),
        })
      : null;
  });
  console.log('list start Done');
};