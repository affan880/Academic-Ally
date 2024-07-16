import { firebase } from '@react-native-firebase/auth';
import Storage from '@react-native-firebase/storage';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { Toast } from "native-base";

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import { setLoading, setNewRequests, setNewSeekHubRequestNull, setNewSeekHubRequests, setRequestNull } from "./UserRequestsSlice";
import PdfViewerAction from '../PdfViewer/pdfViewerAction';

class UserRequestsActions {

    static s3 = new S3({
        accessKeyId: "jw3kscoq6bbnq6cmvoojjpivjv7q",
        secretAccessKey: "jy3acenhwqj4owoa6533wkfbearkg656dwjoo3dudal7zwcyugrsg",
        endpoint: "https://gateway.storjshare.io",
        credentials: {
            accessKeyId: "jw3kscoq6bbnq6cmvoojjpivjv7q",
            secretAccessKey: "jy3acenhwqj4owoa6533wkfbearkg656dwjoo3dudal7zwcyugrsg",
        },
    });

    static loadNewUploads = (managerUniversity, managerCourse, managerBranch) => async (dispatch) => {
        dispatch(setRequestNull());

        const branchExists = async (managerUniversity, managerCourse, branch) => {
            const branchDocRef = firestoreDB()
                .collection('NewUploads')
                .doc(managerUniversity)
                .collection(managerCourse)
                .doc(branch);

            const branchDocSnapshot = await branchDocRef.get();
            return branchDocSnapshot.exists;
        };

        try {
            await Promise.all(
                managerBranch.map(async (branch) => {
                    if (await branchExists(managerUniversity, managerCourse, branch)) {
                        const uploadsSnapshot = await firestoreDB()
                            .collection('NewUploads')
                            .doc(managerUniversity)
                            .collection(managerCourse)
                            .doc(branch)
                            .collection('uploads')
                            .get();

                        const uploadsData = uploadsSnapshot.docs.map((doc) => doc.data());
                        dispatch(setNewRequests(uploadsData));
                    }
                })
            );
        } catch (error) {
            console.log(error);
        }
    };

static loadNewSeekHubRequests = (managerUniversity, managerCourse, managerBranch) => async (dispatch) => {
    dispatch(setNewSeekHubRequestNull());

    const getCourseData = async (managerUniversity, managerCourse) => {
        const branchDocRef = firestoreDB()
            .collection('SeekHub')
            .doc(managerUniversity)
            .collection(managerCourse);
    
        const branchDocSnapshot = await branchDocRef.get();
        const requestDataArray = [];
    
        branchDocSnapshot.forEach((doc) => {
            const docId = doc.id;
            const docData = doc.data();
            if (docData.status !== 'rejected') {
                const requestData = { id: docId, ...docData };
                requestDataArray.push(requestData);
            }
        });
    
        return requestDataArray;
    };
    

    const requestDataArray = await getCourseData(managerUniversity, managerCourse);
    const filteredDataArray = requestDataArray.filter((data) => data.uploaderId);
    dispatch(setNewSeekHubRequests(filteredDataArray));
    return true;
};
    



    static updateUserRequests = async (data, decision) => {
        try {
            // await firestoreDB().collection('Users').doc(data?.uploaderId).collection('UserUploads').get().then((querySnapshot) => {
            //     querySnapshot.forEach((doc) => {
            //         if (doc.data().storageId === data.storageId) {
                        firestoreDB().collection('Users').doc(data?.uploaderId).collection('UserUploads').doc(data.storageId).update({
                            aproval: decision.aproval || null,
                            comment: decision.comment || null,
                            verifiedBy: decision.verifiedBy || null,
                            verifiedByUid: decision.verifiedByUid || null,
                            verifiedByEmail: decision.verifiedByEmail || null,
                            status: 'rejected'
                        })

                        firestoreDB().collection('SeekHub').doc(data?.university).collection(data?.course).doc(data.storageId).update({
                            aproval: decision.aproval || null,
                            comment: decision.comment || null,
                            verifiedBy: decision.verifiedBy || null,
                            verifiedByUid: decision.verifiedByUid || null,
                            verifiedByEmail: decision.verifiedByEmail || null,
                            status: 'rejected'
                        })
                    // }
            //     })
            // })
        }
        catch (error) {
            console.log(error);
        }
    };

    static deleteFilefromFBStorage = async (path) => {
        try {
            await Storage().ref(path).delete();
        } catch (error) {
            console.log(error);
        }
    }

    static uploadFile = async (item, url, credentials, handleRefresh) => {
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
                    this.createResource(data).then((D) => {
                        this.deleteResource(item, handleRefresh);
                        this.deleteFilefromFBStorage(item?.path);
                        resolve();
                        return D
                    });
                });
            });
        } catch (error) {
            console.log('Error:', error);
        }
    }

    static createResource = async (data) => {
        console.log("Dataa0", data)
        const D = {
            Year: "",
            category: data?.category,
            college: "",
            course: data?.course,
            date: Date.now(),
            department: data?.branch,
            did: "",
            dlink: '',
            name: data?.name,
            rating: 0,
            sem: data?.sem,
            size: data?.size,
            status: "unverified",
            subject: data?.subject,
            time: new Date().getTime(),
            units: data?.units,
            uploaderId: data?.uploaderId,
            author: data?.author || data?.uploaderName,
            uploaderName: data?.uploaderName,
            uploaderEmail: data?.uploaderEmail,
            verifiedBy: data?.verifiedBy,
            verifiedByUid: data?.verifiedByUid,
            verifiedByEmail: data?.verifiedByEmail,
            userPfp: data?.userPfp,
            views: 0
        }
        try {
            await firestoreDB()
                .collection('Universities').doc(data.university).collection(data.course).doc(data.branch).collection(data.sem).doc(data.category).collection(data.subject).doc().set(D).then(() => {
                    const ref = firestoreDB().doc(`Universities/${data?.university}/${data?.course}/${data?.branch}/${data?.sem}/SubjectsList`);
                    ref.get().then((doc) => {
                        const updatedList = doc.data()?.list;
                        doc.data().list.map(obj => {
                            if (obj.subjectName === data?.subject) {
                                obj[data?.category] = true;
                            }
                        })
                        ref.update({
                            list: updatedList
                        })
                    })
                })
                return D;
        }
        catch (error) {
            console.log(error);
        }
    }

    static deleteResource = async (data, handleRefresh) => {
        const path = `NewUploads/${data?.university}/${data?.course}/${data?.branch}/uploads`
        try {
            await firestoreDB().collection(path).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if ((doc?.data()?.storageId !== null && doc?.data().storageId !== undefined) && doc.data().storageId === data.storageId) {
                        firestoreDB().collection(path).doc(doc.id).delete();
                    }
                })
            }).then(() => {
                handleRefresh();
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async SendFCMNotification(config) {
        try {
            const response = await fetch('https://us-central1-academic-ally-app.cloudfunctions.net/sendMessageToTopic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });
            console.log('Message sent successfully');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    static acceptRequest = (item, url, credentials, handleRefresh, dynamicLink) => async (dispatch) => {
        try {
            this.uploadFile(item, url, credentials, handleRefresh).then(async (D) => {   
                await PdfViewerAction.sharePdf({ ...D, subject: D?.subject }, dynamicLink).then((link)=>{
                    const notify = {
                        topic: `${item.id}`,
                        title: `${item.category} Uploaded!!`,
                        message: `Your request for the ${item.subject} ${item.categoty} has been uploaded and approved. You can check it out in the ${item.subject} list`,
                        data: {
                            link: link,
                        }
                      }
                      console.log(notify)
                    this.SendFCMNotification(notify)
                })
                this.updateUserRequests(item, { aproval: "approved" });
                dispatch(setLoading(false));
                Toast.show({
                    title: 'File Uploaded Successfully',
                    status: 'success',
                    placement: 'bottom',
                    backgroundColor: '#00b300',
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    static rejectRequest = (item, handleRefresh, user) => async (dispatch) => { 
        try {
            this.deleteResource(item, handleRefresh);
            this.deleteFilefromFBStorage(item?.path);
            this.updateUserRequests(item, { aproval: "rejected", comment: null, verifiedBy: user?.displayName, verifiedByUid: user?.uid, verifiedByEmail: user?.email });
            dispatch(setLoading(false));
            Toast.show({  
                title: 'File Rejectesss Successfully',
                status: 'success',
                placement: 'bottom',
                backgroundColor: '#00b300',
            });

        } catch (error) {
            console.log(error);
        }
    };
}

export default UserRequestsActions;
