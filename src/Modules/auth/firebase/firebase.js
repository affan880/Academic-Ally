import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Toast, CheckIcon } from 'native-base';
import { setCustomLoader } from '../../../redux/reducers/userState';
import { setUsersData } from '../../../redux/reducers/usersData';

export const firestoreDB = () => {
  return firestore();
};

const DeleteAcc = async () => {
  firebase
    .auth()
    .currentUser.delete(Email, Password)
    .then(() => {
      console.log('User deleted');
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
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar9.png?alt=media&token=f588e0f2-3319-4cec-ad60-8053a03c3172',
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
    .then(() => {
      Toast.show({
        title: 'Password reset link sent to your email',
        type: 'success',
        placement: 'top-right',
        backgroundColor: '#00b300',
      });
    })
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
  console.log('updating data', data);
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
  console.log(sep);
  sep.length === 3 && item.type === 'Folder'
    ? firestore()
      .collection('Universities')
      .doc('OU')
      .collection('BE')
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
}
