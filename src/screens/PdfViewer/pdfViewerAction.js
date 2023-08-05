import dynamicLinks from '@react-native-firebase/dynamic-links';
import { S3 } from 'aws-sdk';
import { Toast } from 'native-base';
import { PDFDocument, PDFPage } from 'pdf-lib';
import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

import { firestoreDB, getCurrentUser } from '../../Modules/auth/firebase/firebase';
import CrashlyticsService from '../../services/CrashlyticsService';
import { addItemToDownloadingList, removeItemFromDownloadingList, setDownloadProgress, setIsDownloading, updateDownloadProgress } from './pdfViewerSlice';

import 'react-native-get-random-values';

class PdfViewerAction {
    static s3 = new S3({
        accessKeyId: "jw3kscoq6bbnq6cmvoojjpivjv7q",
        secretAccessKey: "jy3acenhwqj4owoa6533wkfbearkg656dwjoo3dudal7zwcyugrsg",
        endpoint: "https://gateway.storjshare.io",
        credentials: {
            accessKeyId: "jw3kscoq6bbnq6cmvoojjpivjv7q",
            secretAccessKey: "jy3acenhwqj4owoa6533wkfbearkg656dwjoo3dudal7zwcyugrsg",
        },
    });
    static listDownloadedFiles = async () => {
        try {
            const directoryPath = `${RNFS.DocumentDirectoryPath}/Resources`;
            const files = await RNFS.readdir(directoryPath);
            return files;
        } catch (error) {
            console.log('Error reading directory:', error);
        }
    };

    static getfileMetaData = async (notesDataArray) => {
        const metadataArray = [];

        for (const notesData of notesDataArray) {
            const setPdfDataPath = `${RNFS.DocumentDirectoryPath}/Resources/${notesData}`;

            const metadataFilePath = `${setPdfDataPath}`;

            try {
                const metadataJSON = await RNFS.readFile(metadataFilePath, 'utf8');
                const metadata = JSON.parse(metadataJSON);

                metadataArray.push(metadata);
            } catch (error) {
                console.log('Error reading metadata file:', error);
            }
        }

        return metadataArray;
    };


    static checkIfFileExists = async (notesData) => {
        const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`
        const filePath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
            return filePath;
        }
        return false;
    };
    
    static checkIfFileExistsInCache = async (path) => {
        const fileExists = await RNFS.exists(path);
        if (fileExists) {
            return path;
        }
        return false;
    };

    static createMetaData = (result, notesData, setPdfDataPath) => async (dispatch) => {
        const metaData = {
            ...notesData,
            status: 'Downloaded',
            downloadedDate: new Date(),
        };
        await RNFS.writeFile(setPdfDataPath, JSON.stringify(metaData), 'utf8');
        if (result.statusCode === 200) {
            dispatch(setIsDownloading(false));
            dispatch(setDownloadProgress());
            Toast.show({
                title: 'File Downloaded Successfully',
                type: 'success',
                backgroundColor: '#5cb85c',
                duration: 3000,
            });
        } else {
            dispatch(setIsDownloading(false));
            Toast.show({
                title: 'Error Downloading File',
                type: 'danger',
                backgroundColor: '#d9534f',
                duration: 3000,
            });
        }
    }

    static downloadFile = (notesData, url, setTaskId, setProgress) => (dispatch) => {
        setProgress(0)
        const fileSize = notesData?.size / 1024;
        const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`;
        const downloadDest = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
        const setPdfDataPath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}.text`;
        const options = {
            fromUrl: url,
            toFile: downloadDest,
            background: true,
            cache: true,
            progressDivider: fileSize < 10 ? 50 : 13,
            progress: (data) => {
                const progress = data.bytesWritten / data.contentLength;
                setProgress(progress)
            },
            begin: (res) => {
                setTaskId(res.jobId);
                dispatch(setIsDownloading(true));
                dispatch(addItemToDownloadingList({
                    ...notesData,
                    url: url,
                    jobId: res.jobId,
                    downloadedDate: new Date(),
                    progress: 0,
                    status: 'Downloading',
                }))
            }
        };

        RNFS.downloadFile(options).promise
            .then((res) => {
                dispatch(removeItemFromDownloadingList(url))
                dispatch(this.createMetaData(res, notesData, setPdfDataPath));
            }).catch((e) => {
                dispatch(removeItemFromDownloadingList(url))
                if (e.toString().includes('Download has been aborted')) {
                    Toast.show({
                        title: 'Download has been aborted',
                        backgroundColor: '#d9534f',
                        duration: 3000,
                    });
                }
                else {
                    Toast.show({
                        title: 'File Download Failed',
                        type: 'danger',
                        backgroundColor: '#d9534f',
                        duration: 3000,
                    });
                }
                dispatch(setIsDownloading(false))
                dispatch(setDownloadProgress());
            })
    };

    static download = (notesData, url, setTaskId) => (dispatch) => {
        const directoryPath = `${RNFS.DocumentDirectoryPath}/Resources`;
        RNFS.exists(directoryPath).then((directoryExists) => {
            if (directoryExists) {
                dispatch(this.downloadFile(notesData, url, setTaskId));
            } else {
                RNFS.mkdir(directoryPath);
                dispatch(this.downloadFile(notesData, url, setTaskId));
            }
        })
    };

    static sharePdf = async (notesData, dynamicLink) => {
        const link = await dynamicLinks().buildShortLink(
            {
                link: `https://getacademically.co/${notesData?.category}/${notesData?.university}/${notesData?.course}/${notesData?.branch}/${notesData?.sem}/${notesData?.subject}/${notesData?.did}/${notesData?.units}/${notesData?.name}/${notesData?.id}`,
                domainUriPrefix: dynamicLink,
                android: {
                    packageName: 'com.academically',
                },
            },
            dynamicLinks.ShortLinkType.SHORT,
        ).catch((e) => {
            CrashlyticsService.recordError(e);
            Toast.show({
                title: 'Something went wrong, Please try again later',
                duration: 3000,
            });
        });

        // console.log("tuytut",link.slice(link.length-4, link.length))
        // console.log("tuytut",link)
        return link;
    };

    static stopDownload = (taskId) => {
        RNFS.stopDownload(taskId);
    }

    static deleteFile = async (notesData) => {
        try {
            const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`
            const setPdfDataPath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}.text`;
            const filePath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
            const fileExists = await RNFS.exists(filePath);
            if (fileExists) {
                await RNFS.unlink(filePath);
                await RNFS.unlink(setPdfDataPath);
            }
        }
        catch (error) {
            console.log('Error deleting file:', error);
        }
    };

    static manageBookmarks = async (notesData, status, uid) => {
        const bookMarkedElement = firestoreDB().collection(`Users/${uid}/NotesBookmarked`);

        try {
            !status ? await bookMarkedElement.doc(`${notesData?.id}`).set({
                ...notesData
            })
                :
                bookMarkedElement.doc(`${notesData?.id}`).delete()

        } catch (e) {
            CrashlyticsService.recordError(e)
        }
    }

    static removeBookmark = async (notesData, uid) => {
        try {
            await firestoreDB().collection(`Users/${uid}/NotesBookmarked`).doc(`${notesData?.id}`).delete();
        }
        catch (err) {
            CrashlyticsService.recordError(err);
        }
    }

    static handleCreateFile = async (notesData, url, splitPageNumbers, uid, setCurrentProgress, setStartedProcessing) => {
        setStartedProcessing(true)
        setCurrentProgress('Please wait, processing PDF..')
        const uniqueId = uuidv4();
        const outputPath = `Processed-pdfs/${notesData?.university}/${notesData?.course}/${notesData?.branch}/${notesData?.sem}/${notesData?.subject}/${notesData?.category}/${uniqueId}/${notesData?.name}`;
        const pdfUrl = `https://link.storjshare.io/s/jvn6w5kdxgoqla5jw3umlrspv7zq/academic-ally/${outputPath}?wrap=0`;
        const pdfPath = `${RNFS.DocumentDirectoryPath}/${notesData?.id}_${notesData?.name}`;
      
        try {
          if (splitPageNumbers.length === 0) {
            const uploadResponse = await this.uploadFileAndProcessPdf(
              pdfUrl,
              outputPath,
              uid,
              notesData,
              uniqueId,
              splitPageNumbers,
              setCurrentProgress,
              setStartedProcessing
            );;
            return uploadResponse;
          } else {
            await RNFS.downloadFile({ fromUrl: url, toFile: pdfPath }).promise;
            setCurrentProgress("Splitting and creating new PDF...")
            const pdfData = await RNFS.readFile(pdfPath, 'base64');
            const pdfDoc = await PDFDocument.load(pdfData);
            const newPdfDoc = await PDFDocument.create();
            
            for (const pageNumbers of splitPageNumbers) {
              const copiedPage = await newPdfDoc.copyPages(pdfDoc, [pageNumbers - 1]);
              newPdfDoc.addPage(copiedPage[0]);
            }
      
            const newPdfBytes = await newPdfDoc.save();
            const fileContent = newPdfBytes;
            const uploadParams = {
              Bucket: 'academic-ally',
              Key: outputPath,
              Body: fileContent,
            };
            await this.s3.upload(uploadParams).promise().catch((error) => {
                setCurrentProgress('Cloud upload in progress...')
              return false;
            });
            const uploadResponse = await this.uploadFileAndProcessPdf(
              pdfUrl,
              outputPath,
              uid,
              notesData,
              uniqueId,
              splitPageNumbers,
              setCurrentProgress,
              setStartedProcessing
            );
            return uploadResponse;
          }
        } catch (error) {
          console.error('Error while splitting and saving PDF:', error);
          setStartedProcessing(false)
          return false;
        }
    };
      
    static uploadFileAndProcessPdf = async (fileUrl, outputPath, uid, notesData, uniqueId, splitPageNumbers, setCurrentProgress, setStartedProcessing) => {
        return new Promise(async (resolve, reject) => {
          setCurrentProgress('Processing...')
          try {
            const response = await fetch(`https://us-central1-academic-ally-app.cloudfunctions.net/initiateChat?userId=${uid}&fileUrl=${fileUrl}`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = {
                ...await response.json(),
                docId: `${notesData.id}_${uniqueId}`
            };
            setCurrentProgress('Initiating chat...')
            if (data?.sourceId) {
              try {
                await firestoreDB()
                  .collection('Users')
                  .doc(uid)
                  .collection('InitializedPdf')
                  .doc(`${notesData.id}_${uniqueId}`)
                  .set({
                    Year: '',
                    branch: notesData?.branch,
                    sem: notesData?.sem,
                    university: notesData?.university,
                    course: notesData?.course,
                    subject: notesData?.subject,
                    sourceId: data?.sourceId,
                    category: notesData?.category,
                    name: notesData?.name,
                    uniqueId,
                    date: new Date(),
                    pages: splitPageNumbers?.length > 0 ? splitPageNumbers : [],
                    url: outputPath,
                    conversation: [],
                    docId: notesData.id,
                  });
                resolve(data); 
              } catch (error) {
                setStartedProcessing(false)
                console.log( `Error creating Initialized PDF document: ${error.message}`)
                reject({ message: `Error creating Initialized PDF document: ${error.message}` });
              }
            } else {
              setStartedProcessing(false)
              resolve(data); 
            }
          } catch (error) {
            setStartedProcessing(false)
            reject({ message: `Error: ${error.message}` });
          }
        });
    };

    static chatWithPdf = async (docId, message, uid) => {
        const body = {
          userId: uid,
          docId: docId,
          date: new Date(),
          message: message
        };
      
        const config = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        };
      
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              "https://us-central1-academic-ally-app.cloudfunctions.net/chatMessage",
              config
            );
      
            if (!response.ok) {

              CrashlyticsService.setUserId(getCurrentUser()?.uid)
              resolve(false)
              // throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const data = await response.json();
            resolve(data);
          } catch (error) {
            console.log("Error:hehe", error);
            reject({ message: `Error: ${error.message}` });
          }
        });
      };
    static monitorMessageUpdates = (chatId, setMessages, uid) => {
      const chatRef = firestoreDB().collection('Users').doc(uid).collection('InitializedPdf').doc(chatId);
    
      const unsubscribe = chatRef.onSnapshot((snapshot) => {
        const chatData = snapshot?.data();
        const messages = chatData ? chatData?.conversations : [];

        setMessages(messages);
      });
    
      // Return the unsubscribe function to stop listening
      return unsubscribe;
    };      
    
    static getChatDoc = async (uid, docId) => {
      try {
        const docRef = firestoreDB()
          .collection('Users')
          .doc(uid)
          .collection('InitializedPdf')
          .doc(docId);
          
        const docSnapshot = await docRef.get();
    
        if (docSnapshot?.exists) {
          const data = docSnapshot?.data();
          return data;
        } else {
          return { message: 'Document not found' };
        }
      } catch (error) {
        console.error(error);
        return { message: 'Error retrieving document' };
      }
    };    
}

export default PdfViewerAction;
