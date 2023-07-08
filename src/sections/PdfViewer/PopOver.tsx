import LottieView from 'lottie-react-native';
import { Box, Button, Fab, Icon, Modal, Popover, Stack, Text, Toast, useDisclose, VStack } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, Share, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { userAddBookMarks, userRemoveBookMarks } from '../../redux/reducers/userBookmarkManagement'
import PdfViewerAction from '../../screens/PdfViewer/pdfViewerAction';
import { setIsDownloading } from '../../screens/PdfViewer/pdfViewerSlice';

type Props = {
    url: string;
    notesData: any
}

const { width, height } = Dimensions.get('window')

const PopOver = ({ url, notesData }: Props) => {
    const dispatch: any = useDispatch();

    const isDownloading = useSelector((state: any) => state.pdfViewerReducer).isDownloading;
    const dynamicLink = useSelector((state: any) => state?.bootReducer?.utilis?.dynamicLink);
    const theme = useSelector((state: any) => { return state.theme; });
    const userBookmarks = useSelector((state: any) => state.userBookmarkManagement).userBookMarks;
    const [taskId, setTaskId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [saved, setSaved] = useState(false);

    const { subject, category } = notesData;

    async function onDownload() {
        if (url?.includes(`${RNFS.DocumentDirectoryPath}`)) {
            Toast.show({
                title: 'Already Downloaded',
                placement: 'bottom',
                duration: 3000,
            })
        }
        else {
            const directoryPath = `${RNFS.DocumentDirectoryPath}/Resources`;
            await RNFS.exists(directoryPath).then(res => {
                if (res) {
                    dispatch(PdfViewerAction.downloadFile(notesData, url, setTaskId, setProgress));
                } else {
                    RNFS.mkdir(directoryPath);
                    dispatch(PdfViewerAction.downloadFile(notesData, url, setTaskId, setProgress));
                }
            });
        }
    }

    function cancelDownload() {
        dispatch(setIsDownloading(false));
        if (taskId) {
            RNFS.stopDownload(taskId)
        }
    }

    const handleSharePdf = async () => {
        try {
            await PdfViewerAction.sharePdf(notesData, dynamicLink).then((link: any) => {
                Share.share({
                    title: `${subject}`,
                    message: `If you're studying ${subject}, you might find these ${category} on Academic Ally helpfull. I did! Check them out:${link}`
                });
            }).catch((error: any) => {
                Toast.show({
                    title: 'Something went wrong',
                    placement: 'bottom',
                    duration: 3000,
                })
            })
        } catch (error) {
            Toast.show({
                title: 'Something went wrong',
                placement: 'bottom',
                duration: 3000,
            })
        }
    };


    const BookmarkStatus = (item: any): boolean => { return userBookmarks?.some((bookmark: any) => bookmark.id === item) ?? false };

    return (
        <>
            <Popover
                trigger={triggerProps => {
                    return (
                        <Fab
                            renderInPortal={false}
                            backgroundColor={theme.colors.tertiary}
                            {...triggerProps}
                            shadow={2}
                            size="lg"
                            icon={<Icon color="white" as={AntDesign} name="plus" size="lg" />}
                        />
                    );
                }}>
                <Popover.Content
                    accessibilityLabel="Delete Customerd"
                    w="20"
                    style={{
                        backgroundColor: '#ffffff',
                    }}>
                    <Popover.Body>
                        <VStack space={2}>
                            <Button
                                onPress={() => {
                                    setSaved(!saved);
                                    const status = BookmarkStatus(notesData.id);
                                    PdfViewerAction.manageBookmarks(notesData, status);
                                    !status
                                        ? dispatch(
                                            userAddBookMarks({
                                                ...notesData,
                                            }),
                                        )
                                        : dispatch(
                                            userRemoveBookMarks({ ...notesData, }),
                                        );
                                }}
                                colorScheme="red"
                                variant="outline">
                                <Fontisto
                                    name={
                                        BookmarkStatus(notesData.id)
                                            ? 'bookmark-alt'
                                            : 'bookmark'
                                    }
                                    style={{
                                        flex: 100
                                    }}
                                    size={25}
                                    color={theme.colors.mainTheme}
                                />
                            </Button>
                            <Button
                                onPress={handleSharePdf}
                                colorScheme="blue"
                                variant="outline">
                                <Entypo name="share" size={25} color={theme.colors.mainTheme} />
                            </Button>
                            <Button
                                onPress={onDownload}
                                colorScheme="green"
                                variant="outline">
                                <MaterialIcons
                                    name="file-download"
                                    size={25}
                                    color={url?.includes(`${RNFS.DocumentDirectoryPath}`) ? theme.colors.greenSuccess : theme.colors.textSecondary}
                                />
                            </Button>
                        </VStack>
                    </Popover.Body>
                </Popover.Content>
            </Popover>
            <Modal isOpen={isDownloading} onClose={() => {
                dispatch(setIsDownloading(false));
            }}
                width={width}
            >
                <Modal.Content width={width * 0.9} >
                    <>
                        <Stack
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                paddingVertical: 10,
                                paddingTop: 10
                            }}>
                            <Text fontSize={height * 0.0235} fontWeight={'700'} color={theme.colors.black} lineHeight={height * 0.052} >
                                Downloading
                            </Text>

                            <Text fontSize={height * 0.02} fontWeight={'700'} color={theme.colors.black} lineHeight={height * 0.05}>
                                {notesData?.name}
                            </Text>
                            <Text fontSize={height * 0.015} fontWeight={'300'} color={theme.colors.black} lineHeight={height * 0.05}>
                                {(progress * 100).toFixed(1)}% of 100%
                            </Text>
                        </Stack>
                        <Modal.Body
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <LottieView
                                source={require('../../assets/lottie/upload.json')}
                                style={{
                                    width: width,
                                    height: height / 3,
                                }}
                                autoPlay
                                loop
                            />
                        </Modal.Body>
                        <Box
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                padding: 10,
                                position: 'absolute',
                                zIndex: 100,
                                bottom: 10,
                                alignSelf: 'center',
                            }}>
                            <TouchableOpacity onPress={cancelDownload}>
                                <Text fontWeight={700} fontSize={theme.sizes.title} color={theme.colors.primary}>
                                    Cancel{' '}
                                </Text>
                            </TouchableOpacity>
                        </Box>
                    </>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default PopOver