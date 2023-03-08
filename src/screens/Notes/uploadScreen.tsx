import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import NavigationLayout from '../../interfaces/navigationLayout';
import LottieView from 'lottie-react-native';
import {
  Box,
  Icon,
  Text,
  Modal,
  HStack,
  Input,
  FormControl,
  Center,
  Button,
  VStack,
  Toast,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

interface Result {
  uri: any;
  name: any;
}

type RootStackParamList = {
  UploadScreen: {
    userData: {
      Course: string;
      branch: string;
      Sem: string;
    };
    notesData: string;
    selected: string;
    subject: string;
  };
};

const UploadPDF = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'UploadScreen'>>();
  const [pdf, setPdf] = useState<Result | undefined>(undefined);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const selected = route.params.selected;
  const subject = route.params.subject;
  const {userData} = route.params;
  const {notesData}: any = route.params;
  const path = `${userData?.Course}/${userData?.branch}/${
    userData?.Sem
  }/${subject}/${selected}/${auth().currentUser?.uid}`;
  const storageRef = storage().ref(path);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [uploadingResult, setUploadingResult] = React.useState(null);
  const navigation = useNavigation();
  const [pdfSize, setPdfSize] = useState(0);

  useEffect(() => {
    try {
      if (uploadingResult !== null) {
        setModalVisible(false);
        const updateData = {
          resources: firestore.FieldValue.arrayUnion({
            name: pdf?.name,
            uploaderName: auth().currentUser?.displayName,
            uploaderEmail: auth().currentUser?.email,
            uploaderUid: auth().currentUser?.uid,
            subject: subject,
            selected: selected,
            path: path,
          }),
        };
        firestore()
          .collection('UsersUploads')
          .doc('OU')
          .collection(userData.Course)
          .doc(userData.branch)
          .collection(userData.Sem)
          .doc(subject)
          .collection(selected)
          .doc('list')
          .get()
          .then(docSnapshot => {
            if (docSnapshot?.exists) {
              // Update the existing array
              firestore()
                .collection('UsersUploads')
                .doc('OU')
                .collection(userData.Course)
                .doc(userData.branch)
                .collection(userData.Sem)
                .doc(subject)
                .collection(selected)
                .doc('list')
                .update(updateData);
            } else {
              // Create a new array
              firestore()
                .collection('UsersUploads')
                .doc('OU')
                .collection(userData.Course)
                .doc(userData.branch)
                .collection(userData.Sem)
                .doc(subject)
                .collection(selected)
                .doc('list')
                .set({
                  resources: [
                    {
                      name: pdf?.name,
                      uploaderName: auth().currentUser?.displayName,
                      uploaderEmail: auth().currentUser?.email,
                      uploaderUid: auth().currentUser?.uid,
                      subject: subject,
                      selected: selected,
                      path: path,
                    },
                  ],
                });
            }
          });
        Toast.show({
          title: 'Thank you',
          description:
            'Your PDF has been uploaded successfully and are under verification.',
          placement: 'bottom',
          duration: 5000,
        });
        navigation.goBack();
      }
    } catch (err) {
      Toast.show({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        placement: 'bottom',
        duration: 2000,
      });
    }
  }, [uploadingResult]);

  const uploadPDF = async () => {
    setModalVisible(!modalVisible);
    await storageRef.putFile(pdf?.uri).then((snapshot: any) => {
      setUploadingResult(snapshot);
    });
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to upload files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      setPdf({uri: result.fileCopyUri, name: result.name});
      return result;
    } catch (error) {
      Toast.show({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        placement: 'bottom',
        duration: 2000,
      });
    }
  };

  const handleUpload = async () => {
    try {
      await requestPermission();
      const pdfs = await pickPDF();
      setPdfSize(pdfs?.size);
      if (pdf === undefined) {
        Toast.show({
          title: 'Error',
          description: 'Please select a PDF file.',
          placement: 'bottom',
          duration: 2000,
        });
        return;
      }
      if (pdfSize > 10000000) {
        Toast.show({
          title: 'Error',
          description: 'File size should be less than 10MB.',
          placement: 'bottom',
          duration: 2000,
        });
        return;
      }

      setModalVisible(!modalVisible);
      uploadPDF();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <NavigationLayout rightIconFalse={true}>
      <View
        style={{
          width: width,
          height: height - 110,
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}>
        <Box>
          <Box
            flexDirection={'row'}
            px={8}
            pt={16}
            alignItems={'center'}
            justifyContent={'center'}
            width={width}>
            <Text fontSize={'24px'} textAlign={'center'} fontWeight={'700'}>
              Upload {selected.charAt(0).toUpperCase() + selected.slice(1)}{' '}
            </Text>
          </Box>
          <Box
            flexDirection={'row'}
            px={8}
            pt={16}
            alignItems={'center'}
            justifyContent={'flex-start'}>
            <Text fontSize={'20px'} fontWeight={'600'} alignSelf={'center'}>
              Subject:{' '}
            </Text>
            <Text
              fontSize={'18px'}
              pl={2}
              fontWeight={'400'}
              alignSelf={'center'}>
              {notesData.subjectName}
            </Text>
          </Box>
          <Box
            flexDirection={'row'}
            px={8}
            pt={3}
            alignItems={'center'}
            justifyContent={'flex-start'}>
            <Text fontSize={'20px'} fontWeight={'600'} alignSelf={'center'}>
              Course:{' '}
            </Text>
            <Text
              fontSize={'18px'}
              pl={2}
              fontWeight={'400'}
              alignSelf={'center'}>
              {userData.Course}
            </Text>
          </Box>
          <Box
            flexDirection={'row'}
            px={8}
            pt={3}
            alignItems={'center'}
            justifyContent={'flex-start'}>
            <Text fontSize={'20px'} fontWeight={'600'} alignSelf={'center'}>
              branch:{' '}
            </Text>
            <Text
              fontSize={'18px'}
              pl={2}
              fontWeight={'400'}
              alignSelf={'center'}>
              {userData.branch}
            </Text>
          </Box>
          <Box
            flexDirection={'row'}
            px={8}
            pt={3}
            alignItems={'center'}
            justifyContent={'flex-start'}>
            <Text fontSize={'20px'} fontWeight={'600'} alignSelf={'center'}>
              Semester:{' '}
            </Text>
            <Text
              fontSize={'18px'}
              pl={2}
              fontWeight={'400'}
              alignSelf={'center'}>
              {userData.Sem}
            </Text>
          </Box>
        </Box>
        <LottieView
          source={require('../../assets/lottie/upload_Illustration.json')}
          style={{
            width: width,
            marginTop: 20,
          }}
          autoPlay
          loop
        />
        {/* <Button  title="Upload PDF" onPress={handleUpload} /> */}

        {/* {pdf && (
          <View style={{ position:"", bottom:10, }}>
            <Text>File Name: {pdf.name}</Text>
            <Text>File URI: {pdf.uri}</Text>
          </View>
        )} */}
      </View>
      <TouchableOpacity
        onPress={() => handleUpload()}
        style={{
          backgroundColor: '#FF8181',
          width: width - 30,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          borderRadius: 10,
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <Text fontWeight={700} fontSize={'18px'} color={'#FFFFFF'}>
          Upload{' '}
        </Text>
        <MaterialIcons name="file-upload" size={25} color={'#FFFFFF'} />
      </TouchableOpacity>

      <Modal isOpen={modalVisible} onClose={setModalVisible} size={'xl'}>
        <Modal.Content maxH={height}>
          <Modal.Header
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text fontSize={'16px'} fontWeight={'700'}>
              Upload {selected.charAt(0).toUpperCase() + selected.slice(1)}{' '}
            </Text>

            <Text fontSize={'16px'} fontWeight={'700'}>
              Size {(pdfSize / 1024 / 1024).toFixed(3)} MB
            </Text>
          </Modal.Header>
          <Modal.Body
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              source={require('../../assets/lottie/upload.json')}
              style={{
                width: width,
                height: height / 2,
              }}
              autoPlay
              loop
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}>
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NavigationLayout>
  );
};

export default UploadPDF;
