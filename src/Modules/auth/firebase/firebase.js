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

const DeleteAcc = async () => {
  firebase
    .auth()
    .currentUser.delete(Email, Password)
    .then(() => {
      Toast.show({
        title: 'Account Deleted',
        type: 'success',
        placement: 'top-right',
        backgroundColor: '#00b300',
      });
    })
    .catch(error => {
      console.log(error);
    });
};

const createUserDocument = async (uid, Details, dispatch) => {
  const img = auth().currentUser.photoURL;
  if (!uid) return;
  await firestore()
    .collection('Users')
    .doc(`${uid}`)
    .set({
      name: Details.name,
      email: Details.email,
      course: Details.course,
      sem: Details.sem,
      branch: Details.branch,
      Year: Details.year,
      university: Details.university,
      college: Details.college,
      pfp: img,
    })
    .then(() => {
      dispatch(setCustomLoader(false));
    })
    .catch(error => {
      firestore().collection('Users').doc(`${uid}`).delete();
      DeleteAcc();
      console.log(error);
    });
};

export const createUser = async (email, password, values, dispatch) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      var userID = userCredential;
      createUserDocument(userID.user.uid, values, dispatch).then(() => {
        auth().currentUser.updateProfile({
          displayName: values.name,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2Fdefault.png?alt=media&token=b8e8a831-811e-4132-99bc-e6c2e01461da',
        });
        userCredential.user.sendEmailVerification();
        Toast.show({
          title: `Welcome ${values.name}!`,
          type: 'success',
          placement: 'top-right',
          backgroundColor: '#00b300',
        });
      });
      //send verification mail

      return userID;
    })
    .catch(error => {
      console.log('Error: ', error);
      dispatch(setCustomLoader(false));
      var errorCode = error.code;
      var errorMessage = error.message;
      const msg = errorMessage.includes(
        'The email address is already in use by another account.',
      );
      if (msg) {
        Toast.show({
          title: 'Email already in use',
          type: 'danger',
        });
      } else {
        Toast.show({
          title: 'Something went wrong, Please try again later',
          type: 'danger',
        });
      }
      return error;
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      // ..
      console.log('err');
    });
};

export const logIn = async (email, password, dispatch) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      var user = userCredential.user;
      dispatch(setCustomLoader(false));
      Toast.show({
        title: `Welcome Back!`,
        type: 'success',
        placement: 'top-right',
        backgroundColor: '#00b300',
      });
      return user;
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      const msg = errorMessage.includes(
        'There is no user record corresponding to this identifier. The user may have been deleted',
      );
      if (msg) {
        Toast.show({
          title: 'User not found',
          type: 'danger',
        });
        dispatch(setCustomLoader(false));
      } else {
        Toast.show({
          title: 'Incorrect Password',
          type: 'danger',
        });
        dispatch(setCustomLoader(false));
      }
    });
};

export const ResendVerification = async (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      var user = userCredential.user;
      userCredential.user.sendEmailVerification();
      // Toast.show({
      //   title: `Verification mail sent!`,
      //   type: 'success',
      //   placement: 'top-right',
      //   backgroundColor: '#00b300',
      // });
    })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

export const logOut = () => {
  auth()
    .signOut()
    .then(() => {
      AsyncStorage.clear();
    });
};

export const getCurrentUser = () => {
  return auth().currentUser;
};

export const forgotPassword = email => {
  auth()
    .sendPasswordResetEmail(email)
    // .then(() => {
    //   Toast.show({
    //     title: 'Password reset link sent to your email',
    //     type: 'success',
    //     placement: 'top-right',
    //     backgroundColor: '#00b300',
    //   });
    // })
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

//get data from firestore
export const getFirestoreData = async (uid, updateReduxData) => {
  await firestore()
    .collection('Users')
    .doc(`${uid}`)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        updateReduxData(documentSnapshot.data());
      }
    })
    .catch(error => {
      console.log(error);
    });
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
    .doc(`${notesData.uploaderUid + Math.random().toFixed(3)}`)
    .set({
      ...notesData
    })
};


export function listBase(notes) {
  notes.map(item => {
    const sep = item.fullPath.split('/');

    sep.length === 5 && item.type !== 'Folder'
      ? firestore()
        .collection('Universities')
        .doc('JNTUH')
        .collection('BTECH')
        .doc(sep[0])
        .collection(sep[1])
        .doc(sep[3])
        .collection(sep[2]).doc().set(
          {
            Year: "",
            category: sep[3],
            college: "",
            course: "",
            date: Date.now(),
            department: "",
            did: item.id,
            dlink: '',
            name: sep[4],
            rating: 0,
            sem: sep[1],
            size: item.size,
            status: "verified",
            subject: sep[3],
            time: new Date().getTime(),
            units: "",
            uploaderId: "8056itcLayZY8yDbNdi7KbqXnsw2",
            uploaderName: "Affan",
          }
        )
      : null;
    // /"I.T/5/Computer Networks/OtherResources/CNQuestion bank.pdf"

    console.log('list start', sep[1]);
    sep.length === 3 && item.type === 'Folder'
      ? firestore()
        .collection('Universities')
        .doc('JNTUH')
        .collection('BTECH')
        .doc(sep[0])
        .collection(sep[1])
        .doc('SubjectsList')
        .set({
          list: [],
        })
      : null;
  });
}

export function list(notes) {
  console.log('list start', notes.length);
  notes.map(item => {
    const sep = item.fullPath.split('/');

    sep.length === 5 && item.type === 'Files' && sep[4] !== 'desktop.ini'
      ? firestore()
        .collection('Universities')
        .doc('JNTUH')
        .collection('BTECH')
        .doc(sep[0])
        .collection(sep[1])
        .doc('Subjects')
        .collection(sep[2])
        .doc(sep[3])
        .update({
          list: firebase.firestore.FieldValue.arrayUnion({
            fileName: item.name,
            college: null,
            facultyName: null,
            notesId: item.id,
            url: item.url,
            uploaderEmail: item.ownerEmail,
            uploaderName: 'Affan',
            uploaderUid: 'KkCC5dwzvEeNXnRSXLMWFXxs4b32',
            reviews: 0,
            rating: 0,
            ratingCount: 0,
            comments: [],
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            views: 0,
            viewedBy: [],
            downloads: 0,
            date: Date.now(),
            time: new Date().getTime(),
            shared: 0,
            sharedBy: [],
            sharedWith: [],
            size: item.size,
            subject: sep[2],
            sem: sep[1],
            branch: sep[0],
          }),
        })
      : null;

    console.log('list start', sep[1], item.type, item.name, sep[4], sep[3]);

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
      : null;

    console.log('list start', sep[1]);
    console.log('list start Done');
  }, []);
}


export const SubjectList = async (notes) => {
  notes.map(item => {
    const sep = item.fullPath.split('/');
    console.log(sep[0], sep[1], sep[2]);
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
            subjectName: sep[2],
            subjectId: item.id,
          }),
        })
      : null;
  });
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