import { firebase } from '@react-native-firebase/auth';
import { S3 } from 'aws-sdk';
import { Toast } from 'native-base';
import { v4 as uuidv4 } from 'uuid';

import { firestoreDB, getCurrentUser } from "../../Modules/auth/firebase/firebase";
import { setCustomLoader } from "../../redux/reducers/userState";
import CrashlyticsService from "../../services/CrashlyticsService";
import { setResourceRequestList } from "./SeekHubSlice";

class SeekHubActions {
    static s3 = new S3({
        accessKeyId: "jw3kscoq6bbnq6cmvoojjpivjv7q",
        secretAccessKey: "jy3acenhwqj4owoa6533wkfbearkg656dwjoo3dudal7zwcyugrsg",
        endpoint: "https://gateway.storjshare.io",
        credentials: {
            accessKeyId: "jw3kscoq6bbnq6cmvoojjpivjv7q",
            secretAccessKey: "jy3acenhwqj4owoa6533wkfbearkg656dwjoo3dudal7zwcyugrsg",
        },
    });

    static submitNewRequest = (uid, userData, formData, photoUrl) => (dispatch) => {
        const uniqueId = uuidv4();
        const subscribeArray = userData.subscribeArray;
        try {
        const data = {
            subject: formData.subject,
            category: formData.requestResource,
            seekerName: userData.name,
            seekerUid: uid,
            sem: formData.sem,
            branch: formData.branch,
            requestedOn: new Date(),
            status: 'pending',
            seekerPhoto: photoUrl,
            id: uniqueId,
            course: userData.course,
            university: userData.university,
            date: new Date(),
            notifyList: [],
        }
        firestoreDB().collection('SeekHub').doc(`${userData.university}`).collection(`${userData.course}`).doc(`${uniqueId}`).set(data).then(()=>{
            this.handleNotification(subscribeArray, uid, uniqueId);
            firestoreDB().collection('Users').doc(uid).collection('SeekHub').doc('Requests').set({
                requests: firebase.firestore.FieldValue.arrayUnion(uniqueId)
            }).catch((e)=>{
                Toast.show({
                    title: 'Something went wrong!',
                    description: 'Please try again later.',
                    backgroundColor: '#FF0000'
                })
            })
            Toast.show({
                title: 'Request Submitted',
                backgroundColor: '#7DC579'
            })
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
                .where('status', "==", 'pending')
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

    static fullfilRequest = async(data, uid) => {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
            });

            const fileContent = response.data;
            const fileSize = fileContent.byteLength;
            const data = {
                ...item,
                size: fileSize / 1000
            };

            const uploadParams = {
                Bucket: credentials?.bucketName,
                Key: `Universities/${item?.university}/${item?.course}/${item?.branch}/${item?.sem}/${item?.subject}/${item?.category}/${item?.name}`,
                Body: fileContent,
            };

            await new Promise((resolve) => {
                this.s3.upload(uploadParams).promise().then((res) => {
                    this.createResource(data).then(() => {
                        this.deleteResource(item, handleRefresh);
                        this.deleteFilefromFBStorage(item?.path);
                        resolve(); // Resolve the promise to continue further
                    });
                });
            });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    static updateSubscribeArray = (topic, uid) => {
        firestoreDB().collection('Users').doc(uid).update({
            subscribeArray:  firebase.firestore.FieldValue.arrayUnion(topic)
        }).then(()=>{
            Toast.show({
                title: "Noted!", 
                description: "You'll receive a notification once the resource is fulfilled.",
                backgroundColor: '#7DC579',
                placement: 'bottom'
            })
        })
    } 
    static updateUnSubscribeArray = (topic, uid) => {
        firestoreDB().collection('Users').doc(uid).update({
            subscribeArray:  firebase.firestore.FieldValue.arrayRemove(topic)
        }).then(()=>{
            firebase.messaging().unsubscribeFromTopic(`${id}`);
            Toast.show({
                title: "Unsubscribed",
                backgroundColor: '#FF0000',
                placement: 'bottom'
            })
        })
    } 

    static handleNotification = (subscribedTopics, id, uid) => {
        firebase.messaging().subscribeToTopic(`${id}`).then(()=>{
          if(subscribedTopics?.includes(`${id}`)) {
            this.updateUnSubscribeArray(`${id}`, uid)
          }
          else{
            this.updateSubscribeArray(`${id}`, uid)
          }
        })
    }

    static async addToUserUploads(notesData, university, course) {
        const data = (await firestoreDB().doc(`SeekHub/${university}/${course}/${notesData?.storageId}`).get()).data()
        await firestoreDB()
            .collection("Users")
            .doc(getCurrentUser().uid)
            .collection("UserUploads")
            .doc(notesData?.storageId).set(data)
    }

    static async uploadPDFToFirestore(userFirestoreData, pdf) {
        const { university, course } = userFirestoreData;
        const user = getCurrentUser();
        const {
            displayName: uploaderName,
            email: uploaderEmail,
            uid: uploaderId,
        } = user;

        const data = {
            name: pdf?.name,
            uploaderName,
            uploaderEmail,
            uploaderId: uploaderId,
            path: pdf.path,
            pfp: user.photoURL,
            uploadedDate: new Date(),
            storageId: pdf.storageId,
            status:  'Under Verification'
        };

        const path = `SeekHub/${university}/${course}`;

        const DocRef = firestoreDB().collection(path).doc(pdf?.id);
        console.log(DocRef)

        await DocRef.update(data).then(async () => {
            await this.addToUserUploads(data, university, course);
        })
    }
}

export default SeekHubActions