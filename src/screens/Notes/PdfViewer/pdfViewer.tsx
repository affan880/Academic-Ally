import { RouteProp, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Actionsheet, Box, Button, Fab, HStack, Icon, Modal, Popover, Stack, Text, Toast, useDisclose, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import RNFS from 'react-native-fs';
import { TextInput } from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';

import { manageBookmarks } from '../../../Modules/auth/firebase/firebase';
import { userAddBookMarks, userRemoveBookMarks } from '../../../redux/reducers/userBookmarkManagement';
import { userAddToRecentsStart } from '../../../redux/reducers/usersRecentPdfsManager';
import { userClearRecents, userRemoveFromRecents } from '../../../redux/reducers/usersRecentPdfsManager';
import NavigationService from '../../../services/NavigationService';
import UtilityService from '../../../services/UtilityService';
import PdfViewerAction from './pdfViewerAction';
import { setIsDownloading } from './pdfViewerSlice';
import createStyles from './styles';

const { width, height } = Dimensions.get('window');
type RootStackParamList = {
  NotesList: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: any;
    selected: string;
    subjectName: string;
  };
};

const PdfViewer = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const [totalPages, setTotalPages] = useState(0);
  const [expiration, setExpiration] = useState(60 * 60 * 6);
  const [currentPage, setCurrentPage]: any = useState(0);
  const [saved, setSaved] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const { userData } = route.params;
  const { notesData } = route.params;
  const selected: any = notesData?.category;

  const [pageNo, setPageNo] = useState(0);
  const university = notesData?.university || "";
  const course = notesData?.course || "";
  const branch = notesData?.branch || "";
  const sem = notesData?.sem || "";
  const category = (notesData?.category)?.charAt(0)?.toUpperCase() + (notesData?.category)?.slice(1) || selected?.charAt(0)?.toUpperCase() + selected?.slice(1);
  const name = UtilityService.replaceUnusualCharacters(notesData?.name, '&');
  const subject = UtilityService.replaceUnusualCharacters(notesData?.subject, '&');
  const did = notesData?.did || "";
  const uid = notesData?.uid || "";
  const uid2 = notesData?.uid2 || "";
  const uid3 = notesData?.uid3 || "";
  const pdfRef = useRef(null);
  const dispatch: any = useDispatch();
  const [userRecents, setUserRecents] = useState<any>([]);
  const [Display, setDisplay] = useState<any>(true);

  const placeholdersValues = [university, course, branch, sem, category, name, subject, did, uid, uid2, uid3];
  const mainUrl = useSelector((state: any) => state.bootReducer.protectedUtils?.mainUrl);
  const secondaryUrl = useSelector((state: any) => state.bootReducer.protectedUtils?.secondaryUrl);
  const dynamicLink = useSelector((state: any) => state?.bootReducer?.utilis?.dynamicLink);
  const theme = useSelector((state: any) => { return state.theme; });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const userBookmarks = useSelector((state: any) => state.userBookmarkManagement).userBookMarks;
  const recentsList = useSelector((state: any) => state.userRecentPdfs.RecentViews);
  const [url, setUrl] = useState<any>(null);

  const isDownloading = useSelector((state: any) => state.pdfViewerReducer).isDownloading;
  const downloadProgress = useSelector((state: any) => state.pdfViewerReducer).downloadProgress;

  useEffect(() => {
    if (url === null || url === undefined || url === "") {
      PdfViewerAction.checkIfFileExists(notesData).then((res: any) => {
        if (res) {
          setUrl(res)
          console.log('file exists', res);
        }
        else {
          setUrl(UtilityService.replaceString(mainUrl, placeholdersValues))
        }
      });
    }
  }, [isDownloading, mainUrl, placeholdersValues, secondaryUrl, url]);

  const source: object = {
    uri: url,
    cache: true,
    expiration: expiration,
  };

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
          dispatch(PdfViewerAction.downloadFile(notesData, url, setTaskId));
        } else {
          RNFS.mkdir(directoryPath);
          dispatch(PdfViewerAction.downloadFile(notesData, url, setTaskId));
        }
      });
    }
  }

  function cancelDownload() {
    if (taskId) {
      RNFS.stopDownload(taskId)
      dispatch(setIsDownloading(false));
    }
  }

  const handleSharePdf = async () => {
    try {
      await PdfViewerAction.sharePdf(notesData, dynamicLink).then((link: any) => {
        Share.share({
          title: `${subject}`,
          message: `If you're studying ${subject}, you might find these ${notesData.category} on Academic Ally helpfull. I did! Check them out:${link}`
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


  const BookmarkStatus = (item: any): boolean => { return userBookmarks?.some((bookmark: any) => bookmark.did === item) ?? false };

  useEffect(() => {
    setUserRecents(recentsList);
  }, [recentsList]);

  return (
    <View style={styles.container}>
      <View style={Display ? styles.headerContainer : { display: 'none' }} >
        <Ionicons name="chevron-back-outline" size={20} color="#ffffff" onPress={() => { NavigationService.goBack() }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '30%', paddingRight: 10 }}>
          <TextInput style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', width: '50%', paddingVertical: -2, textAlign: 'right', left: 2, top: -1 }}
            value={`${currentPage}`}
            onChangeText={(text: any) => setCurrentPage(text)}
            keyboardType="number-pad"
            maxLength={3}
            onSubmitEditing={() => {
              setPageNo(parseInt(currentPage));
            }}
          />
          <Text style={{ fontSize: 18, color: '#ffffff', fontWeight: 'bold' }}>
            /{totalPages}
          </Text>
        </View>
        <Fontisto name="history" size={20} color="#ffffff" onPress={onOpen} />
      </View>
      <View style={styles.body}>
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: Display ? 0 : 35 }}>
            {
              url && <Pdf
                ref={pdfRef}
                trustAllCerts={false}
                source={source}
                scale={1}
                minScale={0.5}
                maxScale={5.0}
                spacing={10}
                enableRTL={true}
                enableAnnotationRendering={true}
                onPageChanged={(page, numberOfPages) => {
                  setCurrentPage(page);
                  setTotalPages(numberOfPages);
                }}
                page={pageNo}
                onPageSingleTap={() => {
                  setDisplay(Display ? false : true);
                }}
                renderActivityIndicator={progress => {
                  var progressBar = progress * 100;
                  return (
                    <View>
                      <ActivityIndicator
                        animating={true}
                        color="#FF8181"
                        size="large"
                      />
                      <Text style={{ textAlign: 'center', color: "#FF8181" }}>
                        {progressBar?.toFixed(2)}% Loaded
                      </Text>
                    </View>
                  );
                }}
                onError={error => {
                  if (error?.toString()?.toLowerCase()?.includes('no pdf  source')) {
                    console.log('no pdf source');
                    setUrl(UtilityService.replaceString(secondaryUrl, placeholdersValues))
                  }

                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  dispatch(userAddToRecentsStart({ ...notesData, "viewedTime": `${new Date()}`, "category": notesData?.category }));
                }}
                style={{
                  width: width,
                  height: height,
                  borderRadius: Display ? 30 : 0,
                }}
              />
            }
          </View>
        </View>
      </View>
      <Popover
        trigger={triggerProps => {
          return (
            <Fab
              renderInPortal={false}
              backgroundColor={'#FF8181'}
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
          <Popover.Arrow />
          <Popover.Body>
            <VStack space={2}>
              <Button
                onPress={() => {
                  setSaved(!saved);
                  const status = BookmarkStatus(notesData.did);
                  manageBookmarks(notesData, status);
                  !status
                    ? dispatch(
                      userAddBookMarks({
                        name: notesData.name,
                        subject: notesData.subject,
                        did: notesData.did,
                        ...notesData,
                      }),
                    )
                    : dispatch(
                      userRemoveBookMarks({
                        name: notesData.name,
                        subject: notesData.subject,
                        notesId: notesData.did,
                        category: selected,
                        ...notesData,
                      }),
                    );
                }}
                colorScheme="red"
                variant="outline">
                <Fontisto
                  name={
                    BookmarkStatus(notesData.did)
                      ? 'bookmark-alt'
                      : 'bookmark'
                  }
                  size={25}
                  color={'#6360FF'}
                />
              </Button>
              <Button
                onPress={handleSharePdf}
                colorScheme="blue"
                variant="outline">
                <Entypo name="share" size={25} color={'#6360FF'} />
              </Button>
              <Button
                onPress={onDownload}
                colorScheme="green"
                backgroundColor={
                  url?.includes(`${RNFS.DocumentDirectoryPath}`) ? theme.colors.greenSuccess : null
                }
                variant="outline">
                <MaterialIcons
                  name="file-download"
                  size={25}
                  color={'#6360FF'}
                />
              </Button>
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <HStack w="100%" h={60} px={4} justifyContent="space-between">
            <Text fontSize="16" color="gray.500">
              Recents
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(userClearRecents(notesData));
                onClose();
              }}>
              <Text fontSize="12" color="#000000">
                Clear
              </Text>
            </TouchableOpacity>
          </HStack>
          {userRecents?.length > 0 ? (
            userRecents.map((item: any, index: any) => {
              return (
                <Actionsheet.Item
                  key={index}
                  width={'100%'}
                  paddingTop={5}
                  onPress={() => {
                    NavigationService.replace(NavigationService.screens.PdfViewer, {
                      userData: userData,
                      notesData: item,
                      selected: notesData.category,
                      subject: notesData.subject,
                    });
                    onClose();
                  }}>
                  <Box
                    flexDirection={'row'}
                    width={'100%'}
                    justifyContent={'space-between'}>
                    <Text textAlign={'left'} width={'90%'}>
                      {UtilityService.removeString(item.name)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(userRemoveFromRecents(item));
                      }}>
                      <Icon
                        as={Entypo}
                        name="cross"
                        size="md"
                        color="gray.400"
                      />
                    </TouchableOpacity>
                  </Box>
                </Actionsheet.Item>
              );
            })
          ) : (
            <Text>No Recents</Text>
          )}
        </Actionsheet.Content>
      </Actionsheet>
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
                padding: 10,
              }}>
              <Text fontSize={height * 0.0235} fontWeight={'700'} color={theme.colors.black} lineHeight={height * 0.052} >
                Downloading
              </Text>

              <Text fontSize={height * 0.02} fontWeight={'700'} color={theme.colors.black} lineHeight={height * 0.05}>
                {notesData?.name}
              </Text>
              <Text fontSize={height * 0.015} fontWeight={'300'} color={theme.colors.black} lineHeight={height * 0.05}>
                {(downloadProgress * 100).toFixed(1)}% of 100%
              </Text>
            </Stack>
            <Modal.Body
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <LottieView
                source={require('../../../assets/lottie/upload.json')}
                style={{
                  width: width,
                  height: height / 3.5,
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
                zIndex: 100
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
    </View>
  );
};

export default PdfViewer;
const pdfStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
});
