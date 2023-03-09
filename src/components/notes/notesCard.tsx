import {StyleSheet, View, TouchableOpacity, Animated, Linking} from 'react-native';
import React, {useMemo, useState, useRef, useEffect} from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import NavigationLayout from '../../interfaces/navigationLayout';
import createStyles from './styles';
import {manageBookmarks} from '../../Modules/auth/firebase/firebase';
import {userAddToRecentsStart} from '../../redux/reducers/usersRecentPdfsManager';
import { ReportIconWhite, ShareIcon } from '../../assets/images/icons';
import { ReportIconBlack } from '../../assets/images/images';
import {
  Box,
  Icon,
  Text,
  Modal,
  Actionsheet,
  useDisclose,
  Stack,
  Center,
  Checkbox,
  Toast,
  Card
} from 'native-base';
import {
  userAddBookMarks,
  userRemoveBookMarks,
} from '../../redux/reducers/userBookmarkManagement';
import {NavBtn} from '../CustomFormComponents/CustomBtn';
import { ViewCount, submitRating, submitReport, getMailId, shareNotes, ratedResourcesList } from '../../services/fetch';

type Props = {
  item: any;
  key: number;
  userData: any;
  notesData: any;
  selected: string;
  subject: string;
};
type RootStackParamList = {
  NotesList: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: any;
    selected: string;
    subject: string;
  };
};
type MyStackParamList = {
  NotesList: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
  PdfViewer: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
  UploadScreen: {
    userData: {
      Course: string;
      Branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
};

type pdfViewer = StackNavigationProp<MyStackParamList, 'PdfViewer'>;

function remove(filename: string) {
  if (filename.endsWith(".pdf")) {
  filename = filename.slice(0, -4); 
  if (filename.length > 15) {
    return filename.substring(0, 20) ;
  }
  return filename;
  }
}

function KbsToMB(bits :any) {
  const megabytes = bits / 1024 ;
  return megabytes.toFixed(2) + " MB";
}


const NotesCard = ({item, key, userData, notesData, selected, subject}: Props) => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<pdfViewer>();
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [saved, setSaved] = useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [ratingCount , setRatingCount] = useState(0);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const userFirestoreData = useSelector((state: any) => state.usersData);
  const [ratedList, setRatedList] = useState<any>([]);
  const [submitted, setSubmitted] = useState(false);
  const ReportsList = [];
  const userBookmarks = useSelector(
    (state: any) => state.userBookmarkManagement,
  ).userBookMarks;

  useEffect(() => {
    async function getRatedList() {
      const ratedList:any = await ratedResourcesList();
      setRatedList(ratedList);
    }
    getRatedList();
  }, []);

  const BookmarkStatus = (item: any) => {
    if (userBookmarks?.some((bookmark: any) => bookmark.did === item)) {
      return true;
    } else {
      return false;
    }
  };
  const RatedStatus = (item: any) => {
    if (ratedList?.some((rate: any) => rate === item)) {
      return true;
    } else {
      return false;
    }
  };

  function formatViewCount(count: any) {
    if (count >= 1000) {
      count = Math.floor(count / 1000) + "K";
    }
    return count;
  }

  function submitRatingCount() {
    setModalVisible(false);
    submitRating({
          University : userData.University,
          Branch: userData.Branch,
          Course: userData.Course,
          Sem: userData.Sem,
          type: selected.charAt(0).toUpperCase() + selected.slice(1),
          subjectName: subject,
          id : item.id,
          rating : item.rating,
          ...item
        },
        ratingCount
    )
  }

  async function mail() {
    const mailId = await getMailId();
    Linking.openURL(`mailto:${mailId}?body=Report for notes Id : ${item.id}, ${userData.Course} ${userData.Branch}, Semester ${item.sem} ${selected.charAt(0).toUpperCase() + selected.slice(1)} of ${subject}  `)
  }

  return (
            <View style={styles.reccomendationContainer} key={key}>
              <View style={styles.reccomendationStyle}>
                <TouchableOpacity
                  style={styles.subjectContainer}
                  onPress={() => {
                     ViewCount({
                      University : userFirestoreData.usersData.University,
                      Branch: userData.Branch || item.branch,
                      Course: userData.Course || userData.course,
                      Sem: userData.Sem || item.sem,
                      type: selected.charAt(0).toUpperCase() + selected.slice(1),
                      subjectName: subject,
                      id : item.id,
                    })
                    navigation.navigate('PdfViewer', {
                      userData: {
                        Course: userData.Course,
                        Branch: userData.Branch,
                        Sem: userData.Sem,
                      },
                      notesData: item,
                      selected: selected,
                      subject: subject,
                    });
                    dispatch(userAddToRecentsStart({...item, "viewedTime": `${new Date()}`, "category": selected}));
                  }}>
                  <View style={styles.containerBox}>
                    <View style={styles.containerText}>
                      
                    </View>
                  </View>
                  <View
                    style={{
                      width: '65%',
                      height: '90%',
                      justifyContent: 'space-evenly',
                      alignItems: 'flex-start',
                      paddingTop: 5,
                      paddingLeft: 10,
                    }}>
                    <Text style={styles.subjectName}>
                      {remove(item.name)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#161719',
                        fontWeight: '400',
                      }}>
                      {selected.charAt(0).toUpperCase() + selected.slice(1)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: item.units === "" ? "#91919F" : "#161719",
                        fontWeight: '400',
                      }}>
                      {item.units === "" ? "Unknown" : item.units + " Units"}
                    </Text>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingRight: 10,
                        maxWidth: '100%',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 10,
                        }}>
                        <Ionicons name="md-eye-outline" size={13} color="#161719" style={{
                          paddingTop: 2,
                        }} />
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#161719',
                            fontWeight: '600',
                            paddingLeft: 5,
                          }}>{
                          item?.views ? formatViewCount(item.views) : 0
                          }
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 5,
                        }}>
                        <AntDesign name="star" size={13} color="#FFC960" />
                        <Text
                          style={{
                            fontSize: 16,
                            color: item.rating < 1 ? "#91919F" : "#161719",
                            fontWeight: '600',
                            paddingLeft: 5,
                          }}>
                          {item.rating < 1 ? "Unrated" : item.rating}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Entypo name="dot-single" size={20} color="#91919F" style={{
                          paddingTop: 2,
                        }} />
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#91919F',
                            fontWeight: '400',
                            paddingLeft: 0,
                            alignItems: 'center',
                          }}>
                            {KbsToMB(item.size)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSaved(!saved);
                      const status = BookmarkStatus(item.did);
                      !status
                        ? dispatch(
                            userAddBookMarks({
                              name: item.name,
                              subject: subject,
                              did: item.did,
                              category: selected,
                              ...item,
                            }),
                          )
                        : dispatch(
                            userRemoveBookMarks({
                              name: item.name,
                              subject: subject,
                              did: item.did,
                              category: selected,
                              ...item,
                            }),
                          );
                      manageBookmarks(item, status);
                    }}>
                    <FontAwesome
                      name={
                        BookmarkStatus(item.did)
                          ? 'bookmark'
                          : 'bookmark-o'
                      }
                      size={25}
                      color={'#161719'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View style={styles.cardOptions}>
                <TouchableOpacity style={styles.cardOptionContainer} onPress={()=>{
                  {
                    RatedStatus(item.did) ? (
                      Toast.show({
                        title: "You can only rate once",
                        duration: 2000,
                      })
                    ) : setModalVisible(true)
                  }
                }} >
                  <Text style={styles.cardOptionText}>Rate</Text>
                  <AntDesign name={RatedStatus(item.did) ? 'star' : 'staro' } size={20} color={RatedStatus(item.did) ? '#FFC960' : "#FFF" } />    
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardOptionContainer} onPress={onOpen} >
                  <Text style={styles.cardOptionText}>Report</Text>
                  <ReportIconWhite /> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardOptionContainer} onPress={()=>{
                  shareNotes(item)
                }} >
                  <Text style={styles.cardOptionText}>Share</Text>
                  <ShareIcon />    
                </TouchableOpacity>
              </View>
          <Modal isOpen={modalVisible} onClose={setModalVisible} size={'xl'}>
        <Modal.Content >
          <Box margin={2} >
            <Text fontSize={'14px'} fontWeight={'700'} marginTop={3} textAlign="center" >
            How likely are you to recommend this resources to your friends/colleagues?
          </Text>
          <Stack direction="row" space={2} marginY={10} alignItems="center" justifyContent="center" >
            <AntDesign name={ratingCount > 1 || ratingCount === 1 ? "star" : "staro" } size={50} onPress={()=>{
              setRatingCount(1);
            }} color="#FFC960" />  
            <AntDesign name={ratingCount > 2 || ratingCount === 2 ? "star" : "staro" } size={50} onPress={()=>{
              setRatingCount(2);
            }} color="#FFC960" />  
            <AntDesign name={ratingCount > 3 || ratingCount === 3 ? "star" : "staro" } size={50} onPress={()=>{
              setRatingCount(3);
            }} color="#FFC960" />  
            <AntDesign name={ratingCount > 4 || ratingCount === 4 ? "star" : "staro" } size={50} onPress={()=>{
              setRatingCount(4);
            }} color="#FFC960" />  
            <AntDesign name={ratingCount > 5 || ratingCount === 5 ? "star" : "staro" } size={50} onPress={()=>{
              setRatingCount(5);
            }} color="#FFC960" />  
          </Stack>
          <Stack direction="row" space={2} marginY={5} alignItems="center" justifyContent="space-evenly" >
             <TouchableOpacity onPress={()=>{
              setModalVisible(false);
            }} >
              <Text fontSize={'16px'} fontWeight={'700'} textAlign="center" color={"#6360FF"} >
                Cancel
              </Text>
            </TouchableOpacity>
             <TouchableOpacity style={{
              backgroundColor: '#6360FF',
              borderRadius: 10,
              paddingHorizontal: 25,
              paddingVertical: 10,
             }} onPress={()=>{
              setModalVisible(false);
            }} >
              <Text fontSize={'16px'} fontWeight={'700'} textAlign="center" color={"#FFF"} onPress={()=>{
                submitRatingCount();
              }} >
                Confirm
              </Text>
            </TouchableOpacity>
             
          </Stack>  
          </Box>
        </Modal.Content>
      </Modal>
       <Center>
      <Actionsheet isOpen={isOpen} onClose={onClose} borderRadius={0}>
        {
          !submitted ? (
            <Card style={{
              backgroundColor: "#FFF",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <ReportIconBlack /> 
          <Box w="100%" h={60} px={4} my={4} justifyContent="center" alignItems={"center"} >
            <Text fontSize="16" color="#161719" fontWeight={700} >
            Why are you reporting this resource?
            </Text>
            <Text fontSize="12" color="#91919F" textAlign={"center"} fontWeight={700} >
            Your report is anonymous, except if you are reporting an intellectual property infringement
            </Text>
          </Box>
          <Actionsheet.Item style={{
            borderBottomWidth: 1,
            borderBottomColor: "#91919F",
            borderRadius: 10,
          }} onPress={()=>{
            setChecked1(!checked1);
          }}>
            <Checkbox onChange={(value)=>{
              setChecked1(!checked1);
            }} value={"Checked 1"}  colorScheme="green" >
              <Text fontSize="14" color="#161719" fontWeight={700} paddingLeft={4} >
              Copyrights: The notes or this resource file contain copyrighted material
              </Text>
            </Checkbox>
          </Actionsheet.Item>
          <Actionsheet.Item style={{
            borderBottomWidth: 1,
            borderBottomColor: "#91919F",
            borderRadius: 10,
          }} onPress={()=>{
            setChecked2(!checked2);
          }}>
            <Checkbox onChange={(value)=>{
              setChecked2(!checked2);
            }} value={"Checked 1"}  colorScheme="green" >
              <Text fontSize="14" color="#161719" fontWeight={700} paddingLeft={4} >
              Misleading resource: The uploaded source contains inaccurate and false information.
              </Text>
            </Checkbox>
          </Actionsheet.Item>
          <Actionsheet.Item style={{
            borderBottomWidth: 1,
            borderBottomColor: "#91919F",
            borderRadius: 10,
          }} onPress={()=>{
            setChecked3(!checked3);
          }}>
            <Checkbox onChange={(value)=>{
              setChecked3(!checked3);
            }} value={"Checked 1"}  colorScheme="green" >
              <Text fontSize="14" color="#161719" fontWeight={700} paddingLeft={4} >
              Spam: This file contains content other than notes and resources.
              </Text>
            </Checkbox>
          </Actionsheet.Item>
          <Box w="100%" h={60} px={4} my={2} justifyContent="center" alignItems={"center"} >
            <Text fontSize="16" color="#6360FF" fontWeight={700} onPress={()=>{
              mail()
            }} >
              Reason not listed here? Write to Us
            </Text>
          </Box>
          <Stack direction="row" space={2} marginY={5} paddingX={5} alignItems="center" justifyContent="space-evenly" width={"100%"} >
             <TouchableOpacity onPress={onClose} >
              <Text fontSize={'16px'} fontWeight={'700'} textAlign="center" color={"#6360FF"} >
                Cancel
              </Text>
            </TouchableOpacity>
             <TouchableOpacity style={{
              backgroundColor: '#6360FF',
              borderRadius: 10,
              paddingHorizontal: 25,
              paddingVertical: 10,
             }} onPress={()=>{
              submitReport(userFirestoreData?.usersData, {
                checked1,
                checked2,
                checked3
              });
              setSubmitted(true);
            }} >
              <Text fontSize={'16px'} fontWeight={'700'} textAlign="center" color={"#FFF"} >
                Confirm
              </Text>
            </TouchableOpacity>
          </Stack>  
          <Ionicons name="close-circle" size={30} onPress={onClose} color="#BCC4CC" style={{
              position: "absolute",
              top: 15,
              right: 15,
            }} />
        </Card>
          ) : (
            <Card style={{
              height: 400,
              backgroundColor: "#FFF",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }} >
            <AntDesign name="checkcircle" size={50} color="#6360FF" />
            <Box w="100%" h={60} px={4} my={4} justifyContent="center" alignItems={"center"} marginBottom={20} >
              <Text fontSize="16" color="#161719" fontWeight={700} >
              Thanks for letting us know!
              </Text>
              <Text fontSize="14" padding={2} paddingTop={4} color="#91919F" textAlign={"center"} fontWeight={700} >
              We will review your report and take appropriate action.
              </Text>
            </Box>
            <TouchableOpacity style={{
              backgroundColor: '#6360FF',
              borderRadius: 10,
              width: "100%",
              paddingVertical: 10,
              marginVertical: 50,
              position: "absolute",
              height: 50,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
             }} onPress={()=>{
              onClose();
            }} >
              <Text fontSize={'16px'} fontWeight={'700'} textAlign="center" color={"#FFF"} >
                Close
              </Text>
            </TouchableOpacity>
            <Ionicons name="close-circle" size={30} onPress={onClose} color="#BCC4CC" style={{
              position: "absolute",
              top: 15,
              right: 15,
            }} />
            </Card>
          ) 
        }
      </Actionsheet>
    </Center>
    </View>
  );
};

export default NotesCard;

const styles = StyleSheet.create({});
