import storage from '@react-native-firebase/storage';
import { formatDistanceToNow } from 'date-fns';
import LottieView from 'lottie-react-native';
import { Box, Button, Divider, Icon, Input, Modal, Stack, Text, Toast, useDisclose } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux'

import { ReportIconBlack, ReportIconWhite } from '../../assets/images/images';
import SeekHubActions from '../../screens/SeekHub/SeekHubAction';

const {height, width} = Dimensions.get('screen')

type Props = {}

const seekHubTabList = (props: Props) => {
  const [completed, setCompleted] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [choosenPdf, setChoosenPdf] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const {usersData} = useSelector((state: any) => { return state.usersData });
  const subscribedTopics = usersData.subscribeArray;
  const {uid}: any = useSelector((state: any)=> state.bootReducer.userInfo);

  const uploadPDFToFirestore = async (pdf: any, storageId: any) => {
    SeekHubActions.uploadPDFToFirestore(usersData, {
      ...pdf,
      storageId,
    })
  }
  const handleFileUpload = async (item: any) => {
  try {
    const fileResponse: any = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
      copyTo: 'cachesDirectory',
    });

    if (!fileResponse?.cancelled) {
      const { uri, name, fileCopyUri } = fileResponse[0];
      setModalVisible(true);
      const path = `SeekHub/university/course/${item.id}`
      const uploadTask = storage().ref(path).putFile(fileCopyUri)

      uploadTask.on('state_changed',
        (snapshot: any) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error: any) => {
          Toast.show({
            title: 'Error uploading file',
            description: `${error}`,
            backgroundColor: '#FF0000',
            placement: 'bottom'
          })
          setModalVisible(false);
        },
        async () => {
          setCompleted(true);
          setModalVisible(false);
          setChoosenPdf({ uri, name });
          uploadPDFToFirestore({ name, path, id: item?.id }, item.id);
        }
        );
        setCompleted(false);
    }
  } catch (error) {
    Toast.show({
      title: 'Error selecting file',
      description: `${error}`,
      backgroundColor: '#FF0000',
      placement: 'bottom'
    })
  }
};

  
  const formatDateDistance = (dateObj: any) => {
    const dateInSeconds = dateObj.seconds;
    const date = new Date(dateInSeconds * 1000); // Convert seconds to milliseconds
  
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const theme = useSelector((state: any) => { return state.theme });
  const seekList = useSelector((state: any) => { return state.SeekHubReducer.resourceRequestList });
  const [list, setList] = useState(seekList);

  useEffect(()=>{
    setList(seekList)
  },[seekList, usersData])

  const isNotificationOn = (id: any) => {
     if(subscribedTopics?.includes(id)){
       return true
      }
      else {
      return false
     }
  }

  const ListEmptyComponent = React.memo(() => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LottieView
        style={{
          height: theme.sizes.lottieIconHeight,
          alignSelf: 'center',
        }}
        source={require('../../assets/lottie/NoBookMarks.json')}
        autoPlay
        loop
      />
      <Text
        style={{
          fontSize: theme.sizes.title,
          color: theme.colors.primaryText,
          fontWeight: 'bold',
        }}
      >
        No Requests
      </Text>
    </View>
  ));

  const renderCard = (item: any) => {
    const data = item?.item;
    return (
      <Box backgroundColor={theme.colors.primary} borderRadius={10} marginY={5} width={theme.sizes.width * 0.9} overflow={'hidden'}  >
      <View style={{
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.quaternary,
        paddingHorizontal: 10,
        paddingVertical: 10,  
      }}  >
        <View style={{flexDirection: 'row', width: '100%'}}>
          <Box flexDirection={'column'}  >
          <Image source={{
            uri: data?.seekerPhoto || "https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2Fdefault.png?alt=media&token=b8e8a831-811e-4132-99bc-e6c2e01461da"
          }} style={{width: 76, height: 76, borderRadius: 10}} />
          </Box>
          <Box marginLeft={5} h={68} flexDirection={'column'} justifyContent={'space-between'}  >
            <Text fontSize={14} fontWeight={700} color={theme.colors.primaryText}>{data?.subject}</Text>
            <Text fontSize={14} fontWeight={500} color={theme.colors.primaryText}>{data?.category}</Text>
            <Box flexDirection={'row'}>
              <Box flexDirection={'row'} >
                <Text fontSize={14} fontWeight={700} color={theme.colors.terinaryText} >Branch : </Text>
                <Text fontSize={14} fontWeight={400} color={theme.colors.primaryText} >{data?.branch}</Text>
              </Box>
              <Box flexDirection={'row'} pl={5} >
                <Text fontSize={14} fontWeight={700} color={theme.colors.terinaryText} >Sem : </Text>
                <Text fontSize={14} fontWeight={400} color={theme.colors.primaryText} >{data?.sem}</Text>
              </Box>
            </Box>
          </Box>
        </View>
        <Box pt={3} >
          <Text fontSize={14} fontWeight={700} color={theme.colors.primaryText}>{data?.seekerName}</Text>
          <Box flexDirection={'row'}>
            <Text fontSize={14} fontWeight={400} color={theme.colors.primaryText} >{formatDateDistance(data.requestedOn)}</Text>
          </Box>
        </Box>
      </View>
      <Box flexDirection={'row'} justifyContent={'space-evenly'} width={'100%'} py={2} px={5}  >
        <TouchableOpacity onPress={()=>{
          handleFileUpload(data)
        }}  style={{ flexDirection: 'row', alignItems: 'center', padding: 5, width:'50%', justifyContent:'center'}} >
          <Text fontSize={16} fontWeight={700}color={theme.colors.white} pr={2} >Fulfill</Text>
          <FontAwesome5 name="hands-helping" size={16} color={theme.colors.white} />
        </TouchableOpacity>
        <Divider orientation="vertical" />
        <TouchableOpacity onPress={()=>{
          SeekHubActions.handleNotification(subscribedTopics, data?.id, uid)
        }} style={{ flexDirection: 'row', alignItems: 'center', padding: 5, width:'50%', justifyContent:'center' }} >
          <Text fontSize={16} fontWeight={700} color={theme.colors.white} pr={2} >Notify</Text>
          <MaterialIcons name={isNotificationOn(data?.id) ? "notifications-on" : "notifications-off"} size={22} color={theme.colors.white} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 5  }} onPress={onOpen} >
          <Text fontSize={16} fontWeight={700} color={theme.colors.white} pr={2} >Report</Text>
          <Icon as={ReportIconWhite} color={theme.colors.white} size="md" />
        </TouchableOpacity> */}
      </Box>
      <Modal isOpen={modalVisible} size={'xl'}>
        <Modal.Content maxH={height}>
          {
            !completed && (
              <>
                <Stack
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: 10,
                    paddingBottom: 0,
                  }}>
                  <Text fontSize={height * 0.0235} fontWeight={'700'} color={theme.colors.black} lineHeight={height * 0.052} >
                    Uploading
                  </Text>

                  <Text fontSize={height * 0.0235} fontWeight={'700'} color={theme.colors.black} lineHeight={height * 0.05}>
                    {choosenPdf?.name}
                  </Text>
                  <Text fontSize={height * 0.015} fontWeight={'300'} color={theme.colors.black} lineHeight={height * 0.05}>
                    {(uploadProgress).toFixed(1)}% of 100%
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
                      height: height / 2.5,
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
                    paddingTop: 0,
                  }}>
                  <TouchableOpacity onPress={()=>{}}>
                    <Text fontWeight={700} fontSize={theme.sizes.title} color={theme.colors.black}>
                      Cancel{' '}
                    </Text>
                  </TouchableOpacity>
                </Box>
              </>
            )
          }
          {
            completed && (
              <>
                <Modal.Body
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Box w="100%" h={theme.sizes.height * 0.2} px={2} my={4} justifyContent="center" alignItems={"center"} >
                    <AntDesign name="checkcircle" size={50} color={theme.colors.primary} />
                    <Text fontSize={theme.sizes.title} color={theme.colors.black} fontWeight={700} marginTop={4} >
                      Uploaded Successfully
                    </Text>
                    <Text fontSize={theme.sizes.textSmall} padding={theme.sizes.height * 0.01} paddingTop={theme.sizes.height * 0.01} color={theme.colors.black} textAlign={"center"} fontWeight={700} >
                      Thank you! The file has been uploaded successfully. It will be available for others to download once we finish verifying the contents of the file
                    </Text>
                  </Box>
                </Modal.Body>
                <Box
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    padding: 10,
                    paddingTop: 0,
                  }}>
                  <TouchableOpacity onPress={() => {
                    setModalVisible(false);
                    setCompleted(false);
                  }}>
                    <Text fontWeight={700} fontSize={theme.sizes.title} color={theme.colors.black}>
                      Cancel{' '}
                    </Text>
                  </TouchableOpacity>
                </Box>
              </>
            )
          }
        </Modal.Content>
      </Modal>
    </Box>
    )
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <FlatList data={list} renderItem={renderCard} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} ListEmptyComponent={ListEmptyComponent} initialNumToRender={6} />
    </View>
  )
}

export default seekHubTabList

const styles = StyleSheet.create({})