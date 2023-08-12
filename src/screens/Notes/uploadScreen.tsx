import storage from '@react-native-firebase/storage';
import { RouteProp, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Box, Modal, Stack, Text, Toast } from 'native-base';
import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import NavigationLayout from '../../layouts/navigationLayout';
import UploadAction from '../Upload/uploadAction';

const { width, height } = Dimensions.get('window');

interface Result {
  uri: any;
  name: any;
}

type RootStackParamList = {
  UploadScreen: {
    userData: {
      course: any;
      branch: any;
      sem: any;
      university: any;
    };
    notesData: any;
    selected: any;
    subject: any;
  };
};

const UploadPDF = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'UploadScreen'>>();
  const [pdf, setPdf] = useState<Result | undefined>(undefined);
  const selected = route.params.selected;
  const subject = route.params.subject;
  const { userData } = route.params;
  const storageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const path = `Universities/${userData.university}/${userData?.course}/${userData?.branch}/${storageId}`;
  const storageRef = storage().ref(path);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [uploadingResult, setUploadingResult] = React.useState(null);
  const [choosenPdf, setChoosenPdf] = useState<any>(0);
  const [uploadTask, setUploadTask] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useSelector((state: any) => { return state.theme });
  const {email, displayName, uid}: any = useSelector((state: any) => state.bootReducer.userInfo);

  const capitalize = (s: any) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const uploadToFirestore = async (name: any) => {
    UploadAction.uploadPDFToFirestore(
      {
        ...userData,
        uploaderEmail: email,
        uploaderName: displayName,
        uploaderId: uid,
      }
      , {
        university: userData.university,
        course: userData.course,
        branch: userData.branch,
        sem: userData.sem,
        subject: subject,
        category: capitalize(selected),
        name: name,
        path: path,
        units: "",
        storageId
      })
  };

  const uploadPDF = async (pdf: any) => {
    setModalVisible(true);
    const task: any = storageRef.putFile(pdf?.uri);
    setUploadTask(task);
    task.on('state_changed', (snapshot: any) => {
      let progress =
        Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)

      setUploadProgress(progress);
    },
      (error: any) => {
        setUploadTask(null);
        setModalVisible(false);
        Toast.show({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          placement: 'bottom',
          duration: 2000,
        });
      },
      () => {
        const totalMBs = task.snapshot.totalBytes / (1024 * 1024);
      }
    );
    try {
      await task;
      task.then((snapshot: any) => {
        setUploadingResult(snapshot);
        setUploadProgress(0);
        setCompleted(true);
      })
    } catch (error) {
      setUploadTask(null);
      setUploadProgress(0);
    } finally {
      setUploadProgress(0);
      uploadToFirestore(pdf?.name);
    }
  };

  const cancelUpload = () => {
    setModalVisible(false);
    setUploadProgress(0);
    setCompleted(false);
    setUploadTask(null);
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
      setCompleted(false);
    }
  };


  const pickPDF = async () => {
    try {
      const result: any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      setPdf({ uri: result.fileCopyUri, name: result.name });
      if (result !== undefined && result !== null && result.uri !== undefined && result.uri !== null) {
        setChoosenPdf(result);
        uploadPDF({ uri: result.fileCopyUri, name: result.name });
        return result;
      }
      else {
        return null;
      }
    } catch (error) {
    }
  };

  const requestPermission = async () => {
    try {
      const granted = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      if (granted) {
        pickPDF();
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleUpload = async () => {
    try {
      await requestPermission();
    }
    catch (err) {
    }
  };
  function bytesToMB(bits: any) {
    const megabytes = bits / 1000000;
    return megabytes.toFixed(2) + " MB";
  }

  return (
    <NavigationLayout rightIconFalse={true} title="" handleScroll={() => { }}>
      <View
        style={{
          width: width,
          height: height - 110,
        }}>
        <View
          style={{
            width: width,
            alignItems: 'center',
            padding: height * 0.019,
          }}>
          <Text
            style={{
              fontSize: height * 0.0335,
              color: theme.colors.primaryText,
              fontWeight: 'bold',
              paddingTop: height * 0.05,
            }}>
            Uh Oh!
          </Text>
          <Text
            style={{
              fontSize: height * 0.0235,
              color: theme.colors.primaryText,
              fontWeight: 'bold',
              marginTop: height * 0.025,
              textAlign: 'center',
              lineHeight: height * 0.040,
            }}>
            Looks like we don't have what you're looking for.
            Mind sharing them with rest of the community
            if you have it?
          </Text>
          <Image source={require('../../assets/images/uploadBg.webp')} style={{
            width: width * 0.9,
            height: height * 0.4,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: height * 0.05,
          }} />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleUpload}
        style={{
          backgroundColor: '#6360FF',
          width: width - 30,
          height: height * 0.07,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 5,
          borderRadius: 10,
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <Text fontWeight={700} fontSize={theme.sizes.title} color={'#F1F1FA'}>
          Upload{' '}
        </Text>
        <MaterialIcons name="file-upload" size={theme.sizes.iconSmall} color={'#F1F1FA'} />
      </TouchableOpacity>

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
                  <TouchableOpacity onPress={cancelUpload}>
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
    </NavigationLayout>
  );
};

export default UploadPDF;
