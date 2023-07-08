import dynamicLinks from '@react-native-firebase/dynamic-links';
import storage from '@react-native-firebase/storage';
import { S3 } from 'aws-sdk';
import { Buffer } from 'buffer';
import { Toast } from 'native-base';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { Alert } from 'react-native'
import RNFS from 'react-native-fs';
import { v4 as uuidv4 } from 'uuid';

import { firestoreDB, useAuth } from '../../Modules/auth/firebase/firebase';
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
                link: `https://getacademically.co/${notesData?.category}/${notesData?.university}/${notesData?.course}/${notesData?.branch}/${notesData?.sem}/${notesData?.subject}/${notesData?.did}/${notesData?.units}/${notesData?.name}`,
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

    static manageBookmarks = async (notesData, status) => {
        const bookMarkedElement = firestoreDB().collection(`Users/${useAuth()?.currentUser?.uid}/NotesBookmarked`);

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

    static removeBookmark = async (notesData) => {
        try {
            await firestoreDB().collection(`Users/${useAuth()?.currentUser?.uid}/NotesBookmarked`).doc(`${notesData?.id}`).delete();
        }
        catch (err) {
            CrashlyticsService.recordError(err);
        }
    }

    static handleCreateFile = async (notesData, url, splitPageNumbers, fullPdf) => {
        const uniqueId = uuidv4();
        const outputPath = `Processed-pdfs/${notesData?.university}/${notesData?.course}/${notesData?.branch}/${notesData?.sem}/${notesData?.subject}/${notesData?.category}/${uniqueId}/${notesData?.name}`;
        const pdfUrl = `https://link.storjshare.io/s/jvn6w5kdxgoqla5jw3umlrspv7zq/academic-ally/${outputPath}?wrap=0`;
        const pdfPath = `${RNFS.DocumentDirectoryPath}/${notesData?.id}_${notesData?.name}`;
      
        try {
          if (splitPageNumbers.length === 0) {
            // If splitPageNumbers array is empty, use the original PDF URL directly
            await this.uploadFileAndProcessPdf(url, outputPath, pdfUrl, notesData, uniqueId);
          } else {
            await RNFS.downloadFile({ fromUrl: url, toFile: pdfPath }).promise;
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
            await this.s3.upload(uploadParams).promise();
            console.log('Split PDF uploaded successfully:', outputPath);
      
            await this.uploadFileAndProcessPdf(pdfUrl, outputPath, pdfUrl, notesData, uniqueId, splitPageNumbers);
          }
        } catch (error) {
          console.error('Error while splitting and saving PDF:', error);
        }
      };
      
      static uploadFileAndProcessPdf = async (fileUrl, outputPath, pdfUrl, notesData, uniqueId, splitPageNumbers) => {
        try {
          fetch(`https://us-central1-academic-ally-app.cloudfunctions.net/checkPDFDocumentLimit?userId=8056itcLayZY8yDbNdi7KbqXnsw2&fileUrl=${fileUrl}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Response:', data);
              if (data?.sourceId) {
                firestoreDB().collection('Users').doc(useAuth().currentUser.uid).collection('InitializedPdf').doc(`${notesData.id}_${uniqueId}`).set({
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
                  data: new Date(),
                  pages: splitPageNumbers?.length > 0 ? splitPageNumbers : [],
                  url: outputPath
                })
                  .then(() => {
                    console.log('Initialized PDF document created successfully');
                  })
                  .catch(error => {
                    console.error('Error creating Initialized PDF document:', error);
                  });
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        } catch (error) {
          console.error('Error while uploading file and processing PDF:', error);
        }
      };
}

export default PdfViewerAction;
