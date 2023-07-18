import { firebase } from "@react-native-firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import { setCustomLoader } from "../../redux/reducers/userState";
import CrashlyticsService from "../../services/CrashlyticsService";
import { setResourceRequestList } from "./SeekHubSlice";

class SeekHubActions {
    static submitNewRequest = (uid, userData, formData) => (dispatch) => {
       try {
        const uniqueId = uuidv4();
        const data = {
            subject: formData.subject,
            category: formData.requestResource,
            seekerName: userData.name,
            seekerUid: uid,
            sem: formData.sem,
            branch: formData.branch,
            requestedOn: new Date(),
            status: 'pending'
        }
        firestoreDB().collection('SeekHub').doc(`${userData.university}`).collection(`${userData.course}`).doc(`${uniqueId}`).set(data).then(()=>{
            firestoreDB().collection('Users').doc(uid).collection('SeekHub').doc('Requests').set({
                requests: firebase.firestore.FieldValue.arrayUnion(uniqueId)
            });
            dispatch(setCustomLoader(false))
        })
       }
    catch(error){
        dispatch(setCustomLoader(false))
        CrashlyticsService.setUserId(uid)
        }
    }

    static getNewRequests = (uid, userData, filter) => async (dispatch) => {
        try {
            const querySnapshot = await firestoreDB()
                .collection('SeekHub')
                .doc(`${userData.university}`)
                .collection(`${userData.course}`)
                .where("sem", "==", filter.sem)
                .where("branch", "==", filter.branch)
                .get();

            const requests = [];
            querySnapshot.forEach((doc) => {
                // Accessing the data of each document
                const requestData = doc.data();
                requests.push(requestData);
            });
            dispatch(setResourceRequestList(requests))
        } catch (error) {
            console.error("Error while fetching requests:", error);
            // Handle error if necessary.
        }
    }
}

export default SeekHubActions