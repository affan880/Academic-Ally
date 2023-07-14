import { firebase } from '@react-native-firebase/auth';
import Storage from '@react-native-firebase/storage';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import { Toast } from "native-base";

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import { setLoading, setNewRequests, setRequestNull } from "./UserRequestsSlice";

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


    static updateUserRequests = async (data, decision) => {
        try {
            await firestoreDB().collection('Users').doc(data?.uploaderId).collection('UserUploads').get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().storageId === data.storageId) {
                        firestoreDB().collection('Users').doc(data?.uploaderId).collection('UserUploads').doc(doc.id).update({
                            aproval: decision.aprova || null,
                            comment: decision.comment || null,
                            verifiedBy: decision.verifiedBy || null,
                            verifiedByUid: decision.verifiedByUid || null,
                            verifiedByEmail: decision.verifiedByEmail || null,
                        })
                    }
                })
            })
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


    static createResource = async (data) => {
        try {
            await firestoreDB()
                .collection('Universities').doc('OU').collection('BE').doc(data.branch).collection(data.sem).doc(data.category).collection(data.subject).doc().set({
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
                }).then(() => {
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

    static acceptRequest = (item, url, credentials, handleRefresh) => async (dispatch) => {
        try {
            this.uploadFile(item, url, credentials, handleRefresh).then(() => {
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
                title: 'File Rejected Successfully',
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
