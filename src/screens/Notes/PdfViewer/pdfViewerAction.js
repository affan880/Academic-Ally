import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Toast } from 'native-base';
import RNFS from 'react-native-fs';

import { setDownloadProgress, setIsDownloading, updateDownloadProgress } from './pdfViewerSlice';

class PdfViewerAction {
    static downloadTask;
    static taskId;

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
        const directoryPath = `${RNFS.DocumentDirectoryPath}/Resources`;
        const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`
        const filePath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
            return filePath;
        }
        return false;
    };

    static downloadFile = (notesData, url) => async (dispatch) => {
        dispatch(setIsDownloading(true));
        try {
            const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`;
            const downloadDest = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
            const setPdfDataPath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}.text`;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
                background: true,
                progressDivider: 1,
                progress: (data) => {
                    const progress = data.bytesWritten / data.contentLength;
                    dispatch(updateDownloadProgress(progress));
                },
                complete: () => {
                    console.log('Download is complete');
                },
                error: (error) => {
                    dispatch(setDownloadProgress());
                    dispatch(setIsDownloading(false));
                    if (error.description === 'Canceled') {
                        Toast.show({
                            title: 'Download Cancelled',
                            type: 'danger',
                            duration: 3000,
                        });
                    } else {
                        Toast.show({
                            title: 'Download Failed',
                            type: 'danger',
                            backgroundColor: '#d9534f',
                            duration: 3000,
                        });
                    }
                },
            };

            this.downloadTask = RNFS.downloadFile(options);
            this.taskId = this.downloadTask.jobId;
            const result = await this.downloadTask.promise;
            const metaData = notesData;
            await RNFS.writeFile(setPdfDataPath, JSON.stringify(metaData), 'utf8');
            if (result.statusCode === 200) {
                dispatch(setIsDownloading(false));
                dispatch(setDownloadProgress());
                Toast.show({
                    title: 'File Downloaded',
                    type: 'success',
                    backgroundColor: '#5cb85c',
                    duration: 3000,
                });
            } else {
                dispatch(setIsDownloading(false));
                Toast.show({
                    title: 'File Download Failed',
                    type: 'danger',
                    backgroundColor: '#d9534f',
                    duration: 3000,
                });
            }
        } catch (error) {
            dispatch(setDownloadProgress());
            dispatch(setIsDownloading(false));
            if (error.message.includes('Network')) {
                Toast.show({
                    title: 'Network Error',
                    type: 'danger',
                    backgroundColor: '#d9534f',
                    duration: 3000,
                });
            }
        }
    };

    static download = (notesData, url) => async (dispatch) => {
        const directoryPath = `${RNFS.DocumentDirectoryPath}/Resources`;
        const directoryExists = await RNFS.exists(directoryPath);
        if (directoryExists) {
            dispatch(this.downloadFile(notesData, url));
        } else {
            await RNFS.mkdir(directoryPath);
            dispatch(this.downloadFile(notesData, url));
        }
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
        ).catch(() => {
            Toast.show({
                title: 'Something went wrong, Please try again later',
                duration: 3000,
            });
        });
        return link;
    };

    static stopDownload = () => {
        return new Promise((resolve, reject) => {
            try {
                dispatch(setIsDownloading(false));
                dispatch(setDownloadProgress());
                RNFS.stopDownload(this.taskId);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
    // static stopDownload = async () => {
    //     try {
    //         RNFS.stopDownload(this.taskId);
    //         dispatch(setIsDownloading(false));
    //         dispatch(setDownloadProgress());
    //         return { success: true, message: 'Download stopped successfully' };
    //     } catch (error) {
    //         return { success: false, message: 'Error stopping download: ' + error.message };
    //     }
    // };

    static deleteFile = async (notesData) => {
        const pdfFileName = `${notesData?.name}_${notesData?.branch}_${notesData?.sem}.pdf`
        const setPdfDataPath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}.text`;
        const filePath = `${RNFS.DocumentDirectoryPath}/Resources/${pdfFileName}`;
        const fileExists = await RNFS.exists(filePath);
        if (fileExists) {
            await RNFS.unlink(filePath);
            await RNFS.unlink(setPdfDataPath);
        }
    };
}

export default PdfViewerAction;
