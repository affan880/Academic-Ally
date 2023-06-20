import LottieView from 'lottie-react-native';
import { Box, Card, Divider, FlatList, Icon, IconButton, Popover, Progress, Text, Toast, useDisclose, View } from 'native-base'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, Share, StyleSheet, TextInput, TouchableOpacity, VirtualizedList } from 'react-native'
import RNFS from 'react-native-fs'
import Pdf from 'react-native-pdf'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { useDispatch, useSelector } from 'react-redux'

import MainScreenLayout from '../../layouts/mainScreenLayout'
import PdfViewerAction from '../../screens/PdfViewer/pdfViewerAction'
import ReportActionSheet from '../../sections/NotesCard/Report/ReportActionSheet'
import NavigationService from '../../services/NavigationService'
import UtilityService from '../../services/UtilityService'

const { width, height } = Dimensions.get('screen');

const DownloadingList = () => {
    const dynamicLink = useSelector((state: any) => state?.bootReducer?.utilis?.dynamicLink);
    const downloadingList = useSelector((state: any) => state.pdfViewerReducer).downloadingList;

    const mainUrl = useSelector((state: any) => state.bootReducer.protectedUtils?.mainUrl);

    const theme = useSelector((state: any) => state.theme);
    const size = theme?.sizes;
    const colors = theme?.colors;

    const updateProgress = (id: any) => {
        const foundItem = downloadingList.find((item: any) => item?.jobId === id);
        if (foundItem) {
            return foundItem.progress;
        }
        return 0;
    }
    const PdfPreviewComponent = React.memo(({ notesData, index }: any) => {
        const { isOpen, onOpen, onClose } = useDisclose();
        const data = notesData;
        const [visible, setVisible] = useState(true);

        const placeholdersValues = [notesData?.university, notesData?.course, notesData?.branch, notesData?.sem, notesData?.category, notesData?.name, notesData?.subject, notesData?.did, notesData?.uid, notesData?.uid2, notesData?.uid3];
        const initialFocusRef = React.useRef(null);
        const source: object = {
            uri: UtilityService.replaceString(mainUrl, placeholdersValues),
            cache: true,
            expiration: 60 * 60 * 24 * 1000,
        };
        return (
            <>
                <Card width={size.width * 0.85} height={size.height * 0.25} bgColor={colors.primary} borderRadius={20} marginY={3} p={0} display={visible ? 'flex' : 'none'}>
                    <TouchableOpacity
                        style={{
                            width: '100%',
                            height: '70%',
                            borderRadius: 20,
                        }}
                        onPress={() => {
                            NavigationService.navigate(NavigationService.screens.PdfViewer, {
                                userData: {},
                                notesData: notesData,
                                selected: notesData?.category,
                                subject: notesData?.subject,
                            });
                        }}
                    >
                        <Box width={'100%'} height={'100%'} justifyContent={'center'} alignItems={'center'} backgroundColor={colors.white} borderTopRadius={20}>
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <ActivityIndicator
                                    animating={true}
                                    color="#FF8181"
                                    size="large"
                                    style={{
                                        alignSelf: 'center'
                                    }}
                                />
                                <Text style={{ textAlign: 'center', color: "#FF8181" }}>
                                    {(updateProgress(notesData?.jobId) * 100).toFixed(2)}% Loaded
                                </Text>
                            </View>
                        </Box>
                    </TouchableOpacity>

                    <Box width={'100%'} height={'30%'} justifyContent={'flex-start'} borderTopRadius={20.0} flexDirection={'row'} p={4}>
                        <Box width={'90%'} height={'100%'} flexDirection={'column'}>
                            <Box width={'100%'} flexDirection={'row'} pb={1}>
                                <Text width={'50%'} color={colors.white} fontSize={size.textMidTiny} fontWeight={'bold'}>
                                    {(notesData?.subject)?.slice(0, 20)}
                                </Text>
                                <Text width={'35%'} color={colors.white} fontSize={size.textMidTiny} fontWeight={'bold'}>
                                    Branch: {notesData?.branch}
                                </Text>
                                <Text width={'15%'} color={colors.white} fontSize={size.textMidTiny} fontWeight={'bold'}>
                                    Sem: {notesData?.sem}
                                </Text>
                            </Box>
                            <Box width={'100%'} flexDirection={'row'}>
                                <Text width={'50%'} color={colors.white} fontSize={size.textMidTiny}>
                                    {(notesData?.name)?.slice(0, 20)}
                                </Text>
                                <Text width={'40%'} color={colors.white} fontSize={size.textMidTiny}>
                                    {notesData?.category}
                                </Text>
                            </Box>
                        </Box>
                        <Box width={'10%'} height={'100%'} justifyContent={'center'} alignItems={'flex-end'}>
                            <Box w="100%" alignItems="center">
                                <Popover
                                    initialFocusRef={initialFocusRef}
                                    placement={'bottom right'}
                                    trigger={(triggerProps) => {
                                        return (
                                            <IconButton
                                                borderRadius={'full'}
                                                _hover={{
                                                    bg: 'gray',
                                                }}
                                                _pressed={{
                                                    bg: '#D3D3D3',
                                                }}
                                                ref={initialFocusRef}
                                                variant="ghost"
                                                icon={<Icon as={Feather} name="more-vertical" size="xl" color="white" />}
                                                {...triggerProps}
                                            />
                                        );
                                    }}
                                >
                                    <Popover.Content width={size.width * 0.32} p={0}>
                                        <Popover.Body p={0} backgroundColor={colors.popOver}>
                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-around',
                                                    paddingVertical: 8,
                                                    flexDirection: 'row',
                                                }}
                                                onPress={async () => {
                                                    RNFS.stopDownload(notesData?.jobId);
                                                }}
                                            >
                                                <Text color={colors.primaryText} fontSize={size.textMedium} fontWeight={'bold'}>
                                                    cancel
                                                </Text>
                                                <Icon as={<AntDesign name="delete" />} color={colors.primaryText} size={22} />
                                            </TouchableOpacity>
                                            <Divider width={'100%'} />
                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-around',
                                                    paddingVertical: 6,
                                                    flexDirection: 'row',
                                                }}
                                                onPress={async () => {
                                                    try {
                                                        await PdfViewerAction.sharePdf(notesData, dynamicLink).then((link: any) => {
                                                            Share.share({
                                                                title: `${notesData?.subject}`,
                                                                message: `If you're studying ${notesData?.subject}, you might find these ${notesData.category} on Academic Ally helpful. I did! Check them out:${link}`,
                                                            });
                                                        }).catch((error: any) => {
                                                            Toast.show({
                                                                title: 'Something went wrong',
                                                                placement: 'bottom',
                                                                duration: 3000,
                                                            });
                                                        });
                                                    } catch (error) {
                                                        Toast.show({
                                                            title: 'Something went wrong',
                                                            placement: 'bottom',
                                                            duration: 3000,
                                                        });
                                                    }
                                                }}
                                            >
                                                <Text color={colors.primaryText} fontSize={size.textMedium} fontWeight={'bold'}>
                                                    Share
                                                </Text>
                                                <Icon as={<colors.shareIcon />} color={colors.primaryText} size="md" />
                                            </TouchableOpacity>
                                            <Divider width={'100%'} />
                                            <TouchableOpacity
                                                style={{
                                                    width: '100%',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-around',
                                                    paddingVertical: 6,
                                                    flexDirection: 'row',
                                                }}
                                                onPress={() => {
                                                    onOpen();
                                                }}
                                            >
                                                <Text color={colors.primaryText} fontSize={size.textMedium} fontWeight={'bold'}>
                                                    Report
                                                </Text>
                                                <Icon as={<colors.reportIcon />} color={colors.primaryText} size="md" />
                                            </TouchableOpacity>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover>
                            </Box>
                        </Box>
                    </Box>
                    <ReportActionSheet isOpen={isOpen} onClose={onClose} notesData={data} />
                </Card>
            </>
        );
    });
    return (
        <VirtualizedList
            data={downloadingList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: any) => (
                <PdfPreviewComponent notesData={item} />
            )}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            showsVerticalScrollIndicator={false}
        />
    )
}

export default DownloadingList;

const styles = StyleSheet.create({
    searchContainer: {
        width: width * 0.85,
        height: height * 0.06,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.03,
        alignSelf: 'center',
        marginVertical: height * 0.02,
    },
    searchInput: {
        width: width * 0.7,
        height: height * 0.1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.03,
        marginVertical: height * 0.01,
        alignSelf: 'center',
    },
    searchIcon: {
        width: width * 0.05,
        height: width * 0.05,
    }
})