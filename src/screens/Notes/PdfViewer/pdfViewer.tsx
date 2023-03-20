import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  Fab,
  Icon,
  Popover,
  Button,
  VStack,
  Actionsheet,
  useDisclose,
  Text,
  Box,
  Center,
  HStack,
  Toast,
} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {
  userRemoveFromRecents,
  userClearRecents,
} from '../../../redux/reducers/usersRecentPdfsManager';
import {
  userAddBookMarks,
  userRemoveBookMarks,
} from '../../../redux/reducers/userBookmarkManagement';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {manageBookmarks} from '../../../Modules/auth/firebase/firebase';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import usersData from '../../../redux/reducers/usersData';
import {TextInput} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');
type RootStackParamList = {
  NotesList: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: any;
    selected: string;
    subject: string;
  };
};

type MyStackParamList = {
  PdfViewer: {
    userData: {
      course: string;
      branch: string;
      sem: string;
    };
    notesData: any;
    selected: string;
    subject: string;
  };
};

type MyScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'PdfViewer'
>;

const PdfViewer = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage]:any = useState(0);
  const [saved, setSaved] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclose();
  const {userData} = route.params;
  const {notesData} = route.params;
  const {selected} = route.params;
  const [pageNo, setPageNo] = useState(0);
  const [loading, setLoading] = useState(true);
  const source = {
    uri: `https://drive.google.com/u/0/uc?id=${notesData.did}`,
    cache: true,
    expiration: 60 * 60 * 24 * 7,
  };
  const styles = createStyles();
  const pdfRef = useRef(null);
  const navigation = useNavigation<MyScreenNavigationProp>();
  const dispatch = useDispatch();
  const [userRecents, setUserRecents] = useState<any>([]);

  const userBookmarks = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;
  const BookmarkStatus = (item: any) => {
    if (userBookmarks?.some((bookmark: any) => bookmark.did === item)) {
      return true;
    } else {
      return false;
    }
  };
  const recentsList = useSelector(
    (state: any) => state.userRecentPdfs.RecentViews,
  );

  useEffect(() => {
    setUserRecents(recentsList);
  }, [recentsList]);
  async function createDynamicLink() {
         const link = await dynamicLinks().buildShortLink(
      {
        link: `https://getacademically.co/${notesData.category}/${notesData.course}/${notesData.branch}/${notesData.sem}/${notesData.subject}/${notesData.did}/${notesData.units}/${notesData.name}`,
        domainUriPrefix: 'https://academicallyapp.page.link',
        android: {
          packageName: 'com.academically',
        },
      },
      dynamicLinks.ShortLinkType.SHORT,
    ).catch((error) => {
      Toast.show({
        title: 'Something went wrong, Please try again later',
        duration: 3000,
      })
    });
    Share.share({
      title: `${notesData.subject} ${notesData.category} `,
      message: `I just discovered some amazing ${notesData.course} ${notesData.sem}th semester ${notesData.subject} on Academic Ally! Check them out 📚!
      ${link}`,
    });
  }

  const SharePdf = async () => {
    createDynamicLink();
  };

  function remove(str: string) {
    if (str.includes('(oufastupdates.com)') || str.includes('.pdf')) {
      const text = str.replace(/\(oufastupdates.com\)|\.pdf/g, '');
      return text.slice(0, 35) + '...';
    }
    if (str?.length > 15) {
      return str.slice(0, 5) + '...';
    }
    return str;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="chevron-back-outline"
          size={20}
          color="#ffffff"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            paddingRight: 10,
          }}>
          <TextInput
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#ffffff',
              width: '50%',
              paddingVertical: 5,
              textAlign: 'right',
              left: 2,
              top: -1,
            }}
            value={`${currentPage}`}
            onChangeText={(text:any) => setCurrentPage(text)}
            keyboardType="number-pad"
            maxLength={3}
            onSubmitEditing={() => {
              setPageNo(parseInt(currentPage));
            }}
          />
          <Text style={{fontSize: 18, color: '#ffffff', fontWeight: 'bold'}}>
            /{totalPages}
          </Text>
        </View>

        <Fontisto name="history" size={20} color="#ffffff" onPress={onOpen} />
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <View style={pdfStyle.container}>
            <Pdf
              ref={pdfRef}
              trustAllCerts={false}
              source={source}
              scale={1}
              spacing={10}
              enableRTL={true}
              enableAnnotationRendering={true}
              onLoadComplete={(numberOfPages, filePath) => {
                setLoading(false);
              }}
              onPageChanged={(page, numberOfPages) => {
                setCurrentPage(page);
                setTotalPages(numberOfPages);
              }}
              page={pageNo}
              renderActivityIndicator={progress => {
                var progressBar = progress * 100;
                return (
                  <View>
                    <ActivityIndicator
                      animating={true}
                      color="#FF8181"
                      size="large"
                    />
                    <Text style={{textAlign: 'center'}}>
                      {progressBar.toFixed(2)}% Loaded
                    </Text>
                  </View>
                );
              }}
              onError={error => {
                Toast.show({
                  title: 'Error Loading Pdf',
                  description: 'Please try again later or reload the page',
                  duration: 3000,
                });
              }}
              // onPressLink={(uri) => {
              //   console.log(`Link pressed: ${uri}`);
              // }}
              style={pdfStyle.pdf}
            />
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
                onPress={() => {
                  SharePdf();
                }}
                colorScheme="blue"
                variant="outline">
                <Entypo name="share" size={25} color={'#6360FF'} />
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
                    navigation.navigate('PdfViewer', {
                      userData: userData,
                      notesData: item,
                      selected: selected,
                      subject: notesData.subject,
                    });
                    onClose();
                  }}>
                  <Box
                    flexDirection={'row'}
                    width={'100%'}
                    justifyContent={'space-between'}>
                    <Text textAlign={'left'} width={'90%'}>
                      {remove(item.name)}
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
    </View>
  );
};

export default PdfViewer;
const pdfStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  pdf: {
    width: width,
    height: height,
    borderRadius: 40,
    marginBottom: height * 0.12,
  },
});
