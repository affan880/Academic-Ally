import { RouteProp, useRoute } from '@react-navigation/native';
import { Alert, Box, Center, CloseIcon, HStack, Icon, IconButton, Modal, Text, Toast, VStack } from 'native-base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import Pdf from 'react-native-pdf';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import RestrictedScreen from '../../layouts/restrictedScreen';
import { firestoreDB } from '../../Modules/auth/firebase/firebase';
import { userAddToRecentsStart } from '../../redux/reducers/usersRecentPdfsManager';
import AllyChatBot from '../../sections/PdfViewer/AllyChatBot/AllyChatBot';
import ExistingChatList from '../../sections/PdfViewer/ExistingChatListModal';
import PdfPageSplitter from '../../sections/PdfViewer/PdfPageSplitter';
import PopOver from '../../sections/PdfViewer/PopOver';
import RecentlyVisited from '../../sections/PdfViewer/RecentlyVisited';
import NavigationService from '../../services/NavigationService';
import UtilityService from '../../services/UtilityService';
import PdfViewerAction from './pdfViewerAction';
import createStyles from './styles';

type RootStackParamList = {
  NotesList: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: any;
    category: string;
    subjectName: string;
  };
};

const PdfViewer = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage]: any = useState(0);
  const [landscape, setLandscape] = useState(false);
  const [scale, setScale] = useState(1);
  const [pageNo, setPageNo] = useState(0);
  const [Display, setDisplay] = useState<any>(true);
  const [viewRecentSheet, setViewRecentSheet] = useState<any>(false);
  const [splitPages, setSplitPages] = useState<any>([]);
  const [visibleSpliterModal, setVisibleSpliterModal] = useState<any>(false)
  const [filePath, setFilePath]= useState<any>(null);
  const [viewPdfChatModal, setViewPdfChatModal] = useState<boolean>(false)
  const [existingChatList, setExistingChatList] = useState<any>([])
  const [existingChatListModal, setExistingChatListModal] = useState<any>(false)
  const [currentProgress, setCurrentProgress] = useState<any>('started...')
  const [startedProcessing, setStartedProcessing] = useState<any>(false)
  const [sourceId, setSourceId] = useState<string>('');
  const [choosenDoc, setchoosenDoc] = useState<any>( null )

  const { userData, notesData } = route.params;
  const { university, course, branch, sem, did, uid, uid2, uid3, category } = notesData;
  const name = UtilityService.replaceUnusualCharacters(notesData?.name, '&');
  const subject = UtilityService.replaceUnusualCharacters(notesData?.subject, '&');
  const pdfRef = useRef(null);
  const dispatch: any = useDispatch();

  const placeholdersValues = [university, course, branch, sem, category, name, subject, did, uid, uid2, uid3];
  const mainUrl = useSelector((state: any) => state.bootReducer.protectedUtils?.mainUrl);
  const secondaryUrl = useSelector((state: any) => state.bootReducer.protectedUtils?.secondaryUrl);
  const userInfo: any = useSelector((state: any) => state.bootReducer.userInfo);
  const theme = useSelector((state: any) => { return state.theme; });
  const potrait = useSelector((state: any) => state.theme).isPotrait;
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes, landscape), [theme, potrait]);
  const [url, setUrl] = useState<any>(null);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setLandscape(width > height ? true : false);

      if (landscape) {
        setDisplay(false)
        setScale(3);
      }
      else {
        setDisplay(true)
        setScale(1)
      }
    };

    updateOrientation();
  }, []);

  useEffect(() => {
    if (potrait) {
      setDisplay(true);
      setScale(1)
    }
    else {
      setDisplay(false)
      setScale(3)
    }
  }, [potrait])

  useEffect(() => {
    if (url === null || url === undefined || url === "") {
      PdfViewerAction.checkIfFileExists(notesData).then((res: any) => {
        if (res) {
          setUrl(res)
        }
        else {
          setUrl(UtilityService.replaceString(mainUrl, placeholdersValues))
        }
      });
    }
  }, [mainUrl, placeholdersValues, secondaryUrl, url]);

  const source: object = {
    uri: url,
    cache: true,
    expiration: 60 * 60 * 24 * 7,
  };

  const handleChat = () => {
    if(existingChatList?.length > 0){
      setExistingChatListModal(true)
    }
    else if (totalPages > 30 && existingChatList.length === 0){
      setVisibleSpliterModal(true);
    }
    else {
      setViewPdfChatModal(true);
    }
  }

  const createChat = (pages: any) => {
    const uid = userInfo.uid
      PdfViewerAction.handleCreateFile(notesData, url, pages, uid, setCurrentProgress, setStartedProcessing).then((res: any)=>{
        if(res?.sourceId){
          PdfViewerAction.getChatDoc(uid, res?.docId).then((data)=>{
            setchoosenDoc([data])
            setSourceId(res?.docId);
            setVisibleSpliterModal(false);
            setViewPdfChatModal(true);
          })
        }
        else{
          if(res.message){
            Toast.show({
              title: `${res.message}`,
              placement: 'top-right',
              backgroundColor: theme.colors.redError,
            });
          }
          else{
            Toast.show({
              title: 'Error, Initiating chat',
              placement: 'top-right',
              backgroundColor: theme.colors.redError,
            });
          }
        }
      })
  }

  const handleAddNewChat = () =>{
    if (totalPages > 30 ){
      setVisibleSpliterModal(true);
    }
    else {
      const newRange = Array.from({ length: totalPages - 1 + 1 }, (_, index) => 1 + index);
    }
  }
  
  useEffect(()=>{
    firestoreDB().collection('Users').doc('HES4HzSncnfg0s2F5jvV7Nxrqba2').collection('InitializedPdf')
    .where('docId', '>=', notesData.id)
    .where('docId', '<=', `${notesData.id}\uf8ff`)
    .get()
    .then((querySnapshot) => {
      const documents = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const date = data.date.toDate();
          return { ...data, date, docId: doc.id }; 
        })
        .sort((a, b) => b.date - a.date);
        setExistingChatList(documents)
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });
  },[])

  return (
    <RestrictedScreen name={'PdfViewer'} >
      {
        viewPdfChatModal &&
        <AllyChatBot open={viewPdfChatModal} close={()=> setViewPdfChatModal(false)} docId={sourceId} choosenDoc={choosenDoc} />
      }
      <ExistingChatList existingChatList={existingChatList} open={existingChatListModal} close={()=>{ setExistingChatListModal(false) }} handleAddNewChat={handleAddNewChat} setDocId={(id: any)=>{
        setVisibleSpliterModal(false);
        setViewPdfChatModal(true);
        setSourceId(id);
        setchoosenDoc(existingChatList.filter((doc: any)=> doc.docId === id))
      }} />
      <PdfPageSplitter setSplitPages={setSplitPages} splitPages={splitPages} setVisibleSpliterModal={setVisibleSpliterModal} createChat={createChat} visibleSpliterModal={visibleSpliterModal} filePath={filePath} currentProgress={currentProgress} startedProcessing={startedProcessing} />
      <View style={styles.container}>
        <View style={Display ? styles.headerContainer : { display: 'none' }} >
          <IconButton borderRadius={'full'} _hover={{ bg: '#D3D3D3', }} _pressed={{ bg: '#D3D3D3', }} onPress={() => { NavigationService.goBack() }} variant="ghost" icon={<Icon as={Ionicons} name="chevron-back-outline" size={'lg'} color={theme.colors.white} />} p={0} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '60%' }}>
            <Text style={{ fontSize: 18, color: '#ffffff', fontWeight: '600', width: '100%', textAlign: 'center' }}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>
          <IconButton borderRadius={'xl'} _hover={{ bg: '#D3D3D3', }} onPress={() => setViewRecentSheet(true)} variant="ghost" icon={<Icon as={Fontisto} name="history" size={'md'} color={theme.colors.white} />} p={0} />
          <IconButton borderRadius={'xl'} _hover={{ bg: '#D3D3D3', }} onPress={() => { 
            handleChat()
           }} variant="ghost" icon={<Icon as={Ionicons} name="md-chatbubble-ellipses-outline" size={'lg'} color={theme.colors.white} />} p={0} />
        </View>
        <View style={styles.body}>
          <View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {
                url && <Pdf
                  ref={pdfRef}
                  trustAllCerts={false}
                  source={source}
                  scale={scale}
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
                    if (potrait) {
                      setDisplay(Display ? false : true);
                    }
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
                      setUrl(UtilityService.replaceString(secondaryUrl, placeholdersValues))
                    }
                  }}
                  onLoadComplete={(numberOfPages, filePath) => {
                    dispatch(userAddToRecentsStart({ ...notesData, "viewedTime": `${new Date()}`, "category": category }));
                    setFilePath(filePath)
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              }
            </View>
          </View>
        </View>
        <PopOver url={url} notesData={notesData} />
        <RecentlyVisited toggleOpen={viewRecentSheet} toggleClose={() => setViewRecentSheet(false)} userData={userData} notesData={notesData} />
      </View>
    </RestrictedScreen>
  );
};

export default PdfViewer;
