import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Toast, CheckIcon} from 'native-base';

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

const createUserDocument = async (uid, Details) => {
  if (!uid) return;
  firestore()
    .collection('Users')
    .doc(`${uid}`)
    .set({
      Name: Details.name,
      Email: Details.email,
      Course: Details.course,
      Sem: Details.sem,
      Branch: Details.branch,
      Year: Details.year,
      NotesUploads: [],
      NotesDownloads: [],
      NotesViewed: [],
      NotesShared: [],
      NotesLiked: [],
      NotesDisliked: [],
      NotesReviewed: [],
      NotesComments: [],
      NotesRating: [],
      NotesRatingCount: [],
      NotesReviews: [],
      NotesBookmarked: [],
      NotesReported: [],
      NotesReportedReason: [],
      University: Details.university,
      College: Details.college,
    })
    .then(() => {
      console.log('User added!');
    })
    .catch(error => {
      firestore().collection('Users').doc(`${uid}`).delete();
      DeleteAcc();
      console.log(error);
    });
};

export const createUser = async (email, password, values) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      var userID = userCredential;
      createUserDocument(userID.user.uid, values).then(() => {
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

export const logIn = async (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      var user = userCredential.user;
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
      } else {
        Toast.show({
          title: 'Incorrect Password',
          type: 'danger',
        });
      }
    });
};

export const ResendVerification = async (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      var user = userCredential.user;
      userCredential.user.sendEmailVerification();
      console.log('done');
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
      console.log('Password reset email sent!');
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

export const updateFirestoreData = async (uid, data) => {
  firestore()
    .collection('Users')
    .doc(`${uid}`)
    .update(data)
    .then(() => {
      // getFirestoreData(uid);
      console.log('User Data updated!');
    })
    .catch(error => {
      console.log(error);
    });
};

export const manageBookmarks = async (item, selected, subject, status) => {
  const data = {
    fileName: item.fileName,
    subject: subject,
    notesId: item.notesId,
    category: selected,
  };
  firestore()
    .collection('Users')
    .doc(`${getCurrentUser().uid}`)
    .update({
      NotesBookmarked: !status
        ? firebase.firestore.FieldValue.arrayUnion(data)
        : firebase.firestore.FieldValue.arrayRemove(data),
    });
};
export const removeBookmark = async item => {
  const data = {
    fileName: item.fileName,
    subject: item.subject,
    notesId: item.notesId,
    category: item.category,
  };
  firestore()
    .collection('Users')
    .doc(`${getCurrentUser().uid}`)
    .update({
      NotesBookmarked: firebase.firestore.FieldValue.arrayRemove(data),
    })
    .catch(error => {
      console.log('err', error);
    });
};
