import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import auth from '@react-native-firebase/auth';
import { setCustomClaims, setUsersData } from "../../redux/reducers/usersData";
import { setCustomLoader } from "../../redux/reducers/userState";
import { Toast } from "native-base";


class AuthAction {

    static DeleteAcc = async () => {
        firebase.auth().currentUser.delete(Email, Password).then(() => {
            Toast.show({
                title: 'Account Deleted',
                type: 'success',
                placement: 'top-right',
                backgroundColor: '#00b300',
            });
        }).catch(error => {
            console.log(error);
        });
    };

    static createUserDocument = (uid, Details) => async (dispatch) => {
        if (!uid) return;
        await firestoreDB()
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
                pfp: "https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2Fdefault.png?alt=media&token=b8e8a831-811e-4132-99bc-e6c2e01461da",
                sourceType: 'MOBILE_APP'
            })
            .catch(error => {
                CrashlyticsService.recordError(error);
            }).finally(() => {
                dispatch(setCustomLoader(false));
            });
    };

    static signUp = (email, password, values) => async (dispatch) => {
        dispatch(setCustomLoader(true));

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const userID = userCredential.user.uid;

            await dispatch(this.createUserDocument(userID, values));

            await auth().currentUser.updateProfile({
                displayName: values.name,
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2Fdefault.png?alt=media&token=b8e8a831-811e-4132-99bc-e6c2e01461da',
            });

            firestoreDB().collection('Users').doc(userID).get().then((doc) => {
                dispatch(setUsersData(doc.data()));
            });

            await userCredential.user.sendEmailVerification();

            Toast.show({
                title: `Welcome ${values.name}!`,
                type: 'success',
                placement: 'top-right',
                backgroundColor: '#00b300',
            });
        } catch (error) {
            console.log('Error: ', error);
            dispatch(setCustomLoader(false));

            if (error.code === 'auth/email-already-in-use') {
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
        } finally {
            dispatch(setCustomLoader(false));
        }
    };

    static signIn = (email, password) => async (dispatch) => {
        dispatch(setCustomLoader(true));
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                var user = userCredential.user;
                dispatch(setCustomLoader(false));
                firestoreDB().collection('Users').doc(user.uid).get().then((doc) => {
                    dispatch(setUsersData(doc.data()));
                });
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
    }

    static forgotPassword = (email) => async (dispatch) => {
        dispatch(setCustomLoader(true));
        auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                dispatch(setCustomLoader(false));
                Toast.show({
                    title: 'Password Reset Email Sent',
                    description: 'Please Check Your Email',
                    duration: 4000,
                    backgroundColor: '#6360ff',
                });
            })
            .catch(error => {
                dispatch(setCustomLoader(false));
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode === 'auth/invalid-email') {
                    Toast.show({
                        title: 'Invalid Email',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }
                if (errorCode === 'auth/user-not-found') {

                    Toast.show({
                        title: 'User Not Found',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }
                if (errorCode === 'auth/network-request-failed') {
                    Toast.show({
                        title: 'Network Error',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }
                if (errorCode === 'auth/too-many-requests') {
                    Toast.show({
                        title: 'Too Many Requests',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }

                if (errorCode === 'auth/internal-error') {
                    Toast.show({
                        title: 'Internal Error',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }
                if (errorCode === 'auth/user-disabled') {
                    Toast.show({
                        title: 'User Disabled',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }
                if (errorCode === 'auth/invalid-credential') {
                    Toast.show({
                        title: 'Invalid Credential',
                        type: 'danger',
                        duration: 4000,
                        backgroundColor: '#d9534f',
                    });
                }
            });
    }
}

export default AuthAction;
