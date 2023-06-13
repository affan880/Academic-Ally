import { firestoreDB } from "../../Modules/auth/firebase/firebase"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setListLoaded, setSubjectsList } from "../../redux/reducers/subjectsList";

class HomeAction {
    static fetchNotesList = (data, val) => async (dispatch) => {
        try {
            const list = await AsyncStorage.getItem('subjectsList');
            if (list?.length !== 0 && list !== null && val === true) {
                dispatch(setSubjectsList(JSON.parse(list)));
                dispatch(setListLoaded(true));
            } else {
                firestoreDB().collection('QueryList')
                    .doc(`${data.university}`)
                    .collection(`${data.course}`)
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

}

export default HomeAction;