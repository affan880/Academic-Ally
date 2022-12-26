import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const firestoreDB = () => {
  return firestore();
}

const DeleteAcc = async () => {
  console.log("Deleting user")
  firebase.auth().currentUser.delete("syedaffan@duck.com", "affan786")
    .then(() => {
      console.log("User deleted")
    })
    .catch((error) => {
      console.log(error)
    }
    )
}

 const createUserDocument = async (uid, Details) => {
  if (!uid) return;
  firestore()
    .collection('Users')
    .doc(`${uid}`)
    .set(Details)
    .then(() => {
      console.log('User added!');
    }).catch((error) => {
      firestore().collection('Users').doc(`${uid}`).delete()
      DeleteAcc();
      console.log(error);
    });
  
};

  
export const createUser = async (email, password, values) => {
 auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
   var userID = userCredential;
    createUserDocument(userID.user.uid, values);
   return userID;
 }).catch((error) => {
    console.log("Error: ", error);
    return error;
})
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    // ..
    console.log("err")
  }
  );
}


export const logIn = async (email, password) => {
   auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    console.log("Success");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
}

export const ResendVerification = async (email,password) => {
 auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    userCredential.user.sendEmailVerification();
    console.log("done");

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
}


export const logOut = () => {
  auth().signOut().then(() => {
    console.log('User signed out!');
  });
}

export const getCurrentUser = () => {
  return auth().currentUser;
}

export const forgotPassword = (email) => {
  auth().sendPasswordResetEmail(email).then(() => {
    console.log('Password reset email sent!');
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
  });
}
