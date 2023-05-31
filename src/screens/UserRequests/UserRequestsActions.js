import { Toast } from "native-base";
import { Platform } from 'react-native';

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import { setNewRequests, setRequestNull } from "./UserRequestsSlice";

class UserRequestsActions {
    static loadNewUploads = () => async (dispatch) => {
        dispatch(setRequestNull())
        try {
            const doc = await firestoreDB()
                .collection('UsersUploads')
                .doc('OU').collection('BE').doc('uploadList')
                .get()
            dispatch(setNewRequests([]))
            doc.data()?.paths.map((path) => {
                if (path.charAt(0) === '/') {
                    path = path.substring(1);
                    const doc = firestoreDB().doc(path).get();
                    doc.then((doc) => {
                        dispatch(setNewRequests(doc.data()?.resources));
                    })
                }
                else {
                    const doc = firestoreDB().doc(path).get();
                    doc.then((doc) => {
                        dispatch(setNewRequests(doc.data()?.resources));
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static acceptRequest = (data) => async (dispatch) => {
        try {
            const doc = await firestoreDB()
                .collection('Universities')
                .doc('OU').collection('BE').doc('uploadList')
                .get().then((doc) => {
                    console.log(doc.data());
                })
            doc.data()?.paths.map((path) => {
                if (path.charAt(0) === '/') {
                    path = path.substring(1);
                    const doc = firestoreDB().doc(path).get();
                    doc.then((doc) => {
                        dispatch(setNewRequests(doc.data()?.resources));
                    })
                }
                else {
                    const doc = firestoreDB().doc(path).get();
                    doc.then((doc) => {
                        dispatch(setNewRequests(doc.data()?.resources));
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    static rejectRequest = (index) => async (dispatch) => {
        try {
            const doc = await firestoreDB()
                .collection('UsersUploads')
                .doc('OU').collection('BE').doc('uploadList')
                .get().then((doc) => {
                    console.log(doc.data().paths[index]);
                    // firestoreDB().collection('UsersUploads').doc('OU').collection('BE').doc('uploadList').update({
                    //     paths: firestoreDB.FieldValue.arrayRemove(doc.data()?.paths[index])
                    // })
                })


            console.log(doc.data());

        } catch (error) {
            console.log(error);
        }
    }
}

export default UserRequestsActions;
