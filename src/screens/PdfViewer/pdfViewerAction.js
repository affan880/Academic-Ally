import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Toast } from 'native-base';
import RNFS from 'react-native-fs';

import CrashlyticsService from '../../services/CrashlyticsService';
import { addItemToDownloadingList, removeItemFromDownloadingList, setDownloadProgress, setIsDownloading, updateDownloadProgress } from './pdfViewerSlice';

class PdfViewerAction {

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
}

export default PdfViewerAction;
