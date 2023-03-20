import { View, Dimensions, Image, TouchableOpacity, ScrollView, PermissionsAndroid} from 'react-native';
import React, {useRef, useState, useMemo, useEffect} from 'react';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import NavigationLayout from '../../interfaces/navigationLayout';
import {
  CustomBtn,
  NavBtn,
} from '../../components/CustomFormComponents/CustomBtn';
import {CustomTextInput} from '../../components/CustomFormComponents/CustomTextInput';
import Form from '../../components/Forms/form';
import DropdownComponent from '../../components/CustomFormComponents/Dropdown';
import {UploadvalidationSchema} from '../../utilis/validation';
import createStyles from './styles';
import {Actionsheet, Avatar, useDisclose, Toast, Stack, Text, Box, Modal} from 'native-base';
import auth from '@react-native-firebase/auth';
import {
  AddtoUserUploads,
  getFirestoreData,
  logOut,
  updateFirestoreData,
} from '../../Modules/auth/firebase/firebase';
import {useSelector, useDispatch} from 'react-redux';
import {setUsersData, setUserProfile} from '../../redux/reducers/usersData';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StackNavigationProp} from '@react-navigation/stack';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const Search = () => {
  const theme = useSelector((state: any) => state.theme);
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), [theme]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [limit, setLimit] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const list:any = useSelector((state: any) => state.subjectsList.list || []);
  const [subjectListDetail, setSubjectListDetail] = useState<any[]>(list); 
  const { isOpen, onOpen, onClose } = useDisclose();
  const dispatch = useDispatch();
  const formRef: any = useRef();
  const uid = auth().currentUser?.uid;
  const userFirestoreData = useSelector((state: any) => { return state.usersData });
  const userImage = useSelector((state: any) => { return state.usersData.userProfile });
  const user = auth().currentUser;
  const initialValues :any = {
    course: userFirestoreData.usersData.course,
    branch: userFirestoreData.usersData.branch,
    Year: userFirestoreData.usersData.Year,
    sem: userFirestoreData.usersData.sem, 
    type:"",
    subject: "",
    units: "",
  };
  const [pdf, setPdf] = useState<any>(undefined);
  const [selectedAvatar, setSelectedAvatar] = React.useState<any>(auth().currentUser?.photoURL);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [uploadingResult, setUploadingResult] = React.useState(null);
  const navigation = useNavigation();
  const [choosenPdf, setChoosenPdf] = useState<any>(0);
  const [uploadTask, setUploadTask] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  useEffect(() => {
    const subjectList:any = []
    if(list.length > 0){
      list.map((item: any) => {
      subjectList.push({
        label: item.subject,
        value: item.subject,
      })
    });
    setSubjectListDetail(subjectList);
    }
  },[list]);
  const CourseData: any = [
    {label: 'B.E', value: 'BE'},
  ];
  const CourseData1: any = [
    {label: 'B.TECH', value: 'BTECH'},
  ];
  const SemList: any = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
    {label: '6', value: '6'},
    {label: '7', value: '7'},
    {label: '8', value: '8'},
  ];

  const YearData: any = [
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
  ];

  const BranchData: any = [
    {label: 'IT', value: 'IT'},
    {label: 'CSE', value: 'CSE'},
    {label: 'ECE', value: 'ECE'},
    {label: 'MECH', value: 'MECH'},
    {label: 'CIVIL', value: 'CIVIL'},
    {label: 'EEE', value: 'EEE'},
  ];

  const Type = [
    {label: 'Syllabus', value: 'Syllabus'},
    {label: 'Notes', value: 'Notes'},
    {label: 'Question Paper', value: 'QuestionPaper'},
    {label: 'Other Resources', value: 'OtherResources'},
  ]

  const UniversityData: any = [{label: 'Osmania University', value: 'OU'}];
  

const handleYearChange = (event: any) => {
   if(event?.value === '' || event?.value === undefined || event?.value === null){
        return;
      }
    const yearValue = event?.value;
    setSelectedYear(yearValue);
    setSelectedSem('');
    formRef.current?.setFieldValue('sem', '');
  };

  const handleSemChange = (event :any) => {
     if(event?.value === '' || event?.value === undefined || event?.value === null){
        return;
      }
    const semValue = event?.value;
    setSelectedSem(semValue);
     if (!selectedYear || selectedYear === initialValues.year) {
      if (semValue <= 2) {
        setSelectedYear('1');
        initialValues.year = '1';
      } else if (semValue <= 4) {
        setSelectedYear('2');
        initialValues.year = '2';
      } else if (semValue <= 6) {
        setSelectedYear('3');
        initialValues.year = '3';
      } else {
        setSelectedYear('4');
        initialValues.year = '4';
      }
    }
  };

  const filteredSemList = SemList.filter((sem: any) => {
  if (selectedYear === '1') {
    return sem.value === '1' || sem.value === '2';
  } else if (selectedYear === '2') {
    return sem.value === '3' || sem.value === '4';
  } else if (selectedYear === '3') {
    return sem.value === '5' || sem.value === '6';
  } else if (selectedYear === '4') {
    return sem.value === '7' || sem.value === '8';
  } else {
    return true;
  }
});

function getOrdinalSuffix(text :string) {
  const number = parseInt(text, 10);
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const lastDigit = number % 10;
  const suffix = suffixes[(lastDigit === 1 && number !== 11) ? 1
     : (lastDigit === 2 && number !== 12) ? 2
     : (lastDigit === 3 && number !== 13) ? 3
     : 0];
  return `${number}${suffix}`;
  }

  
  const uploadPDFToFirestore = async (pdf:any) => {
        const updateData = {
          resources: firestore.FieldValue.arrayUnion({
            name: pdf?.name,
            uploaderName: auth().currentUser?.displayName,
            uploaderEmail: auth().currentUser?.email,
            uploaderUid: auth().currentUser?.uid,
            subject: pdf.subject,
            selected: pdf.type,
            path: pdf.path,
            units : pdf.units,
          }),
        };
        firestore()
          .collection('UsersUploads')
          .doc(userFirestoreData.usersData.university)
          .collection(pdf?.course)
          .doc(userFirestoreData.usersData.branch)
          .collection(userFirestoreData.usersData.sem)
          .doc(pdf.subject)
          .collection(pdf.type)
          .doc('list')
          .get()
          .then(docSnapshot => {
            if (docSnapshot?.exists) {
              // Update the existing array
              firestore()
                .collection('UsersUploads')
                .doc(userFirestoreData.usersData.university)
                .collection(pdf.course)
                .doc(pdf.branch)
                .collection(pdf.sem)
                .doc(pdf.subject)
                .collection(pdf.type)
                .doc('list')
                .update(updateData);
            } else {
              firestore()
                 .collection('UsersUploads')
                .doc(userFirestoreData.usersData.university)
                .collection(pdf.course)
                .doc(pdf.branch)
                .collection(pdf.sem)
                .doc(pdf.subject)
                .collection(pdf.type)
                .doc('list')
                .set({
                  resources: [
                    {
                      name: pdf?.name,
                      uploaderName: auth().currentUser?.displayName,
                      uploaderEmail: auth().currentUser?.email,
                      uploaderUid: auth().currentUser?.uid,
                      subject: pdf.subject,
                      selected: pdf.type,
                      path: pdf.path,
                      units : pdf.units,
                    },
                  ],
                });
            }
            AddtoUserUploads({
              name: pdf?.name,
              uploaderName: auth().currentUser?.displayName,
              uploaderEmail: auth().currentUser?.email,
              uploaderUid: auth().currentUser?.uid,
              subject: pdf.subject,
              selected: pdf.type,
              path: pdf.path,
              units : pdf.units,
              verified: false,
            })
          });
}

  const uploadPDF = async (pdf:any) => {
    const formValues = formRef.current?.values;
    const {course, branch, Year, sem, type, subject, units} = formValues;
    const path = `${userFirestoreData.usersData.university}/${course}/${branch}/${Year}/${sem}/${type}/${subject}/${units}/${pdf?.name}`;
    const storageRef = storage().ref(path);
    setModalVisible(true);
    const task: any = storageRef.putFile(pdf?.uri);
    setUploadTask(task);
    task.on('state_changed', (snapshot:any) => {
      let progress =
        Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    },
    
    (error:any) => {
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
   setUploadProgress(totalMBs);
  }
    );
     try {
    await task;
    task.then((snapshot:any)=>{
        setUploadProgress(0);
        setUploadTask(null);
        setChoosenPdf(null);
        setPdf(null);
        setCompleted(true);
        uploadPDFToFirestore({name: pdf?.name, subject, type, path, course, branch, Year, sem, units});
    })
  } catch (error) {
    setUploadTask(null);
  } finally {
    setCompleted(true);
    setUploadProgress(0);
  }
  };

  const cancelUpload = () => {
    setModalVisible(false);
    if (uploadTask) {
      uploadTask.cancel();
      setUploadTask(null);
    }
  };

  const pickPDF = async () => {
    try {
      const result:any = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
        copyTo: 'cachesDirectory',
      });
      setPdf({uri: result.fileCopyUri, name: result.name});
      if(result !== undefined && result !== null && result.uri !== undefined && result.uri !== null ){
        setChoosenPdf(result);
        uploadPDF({uri: result.fileCopyUri, name: result.name});
        return result;
      }
      else{
        return null;
      }
    } catch (error) {
    }
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
        pickPDF();
        setPermissionGranted(true);
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
      Toast.show({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        placement: 'bottom',
        duration: 2000,
      });
    }
  };
  function bytesToMB(bits :any) {
  const megabytes = bits / 1000000 ;
  return megabytes.toFixed(2) + " MB";
}
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Ionicons name="cloud-upload" size={theme.sizes.iconMedium} color="#FFFFFF" />
          <Text style={styles.headerText}>Upload</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <ScrollView
          showsVerticalScrollIndicator={false}
           style={{
            width: screenWidth,
          }}>
           <Form
          validationSchema={UploadvalidationSchema}
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={()=> handleUpload()}>
          <Box style={{width: screenWidth,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
             }}>
          <CustomTextInput
            leftIcon="user"
            placeholder="Full Name"
            name="name"
          />
          <View
            style={{
              flexDirection: 'row',
              width: screenWidth -50,
              justifyContent: 'space-between',
            }}>
            <DropdownComponent
              name="course"
              data={userFirestoreData.usersData.university === 'OU' ? CourseData : CourseData1 }
              placeholder={userFirestoreData.usersData.course}
              leftIcon="bars"
              width={screenWidth / 2.5}
              handleOptions={()=>{}}
            />
            <DropdownComponent
              name="branch"
              data={BranchData}
              placeholder={userFirestoreData.usersData.branch}
              leftIcon="ellipsis1"
              width={screenWidth / 2.5}
              handleOptions={()=>{}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: screenWidth - 50,
              justifyContent: 'space-between',
            }}>
            <DropdownComponent
              name="Year"
              data={YearData}
              placeholder={getOrdinalSuffix(initialValues.Year) + ' yr'}
              leftIcon="Safety"
              width={screenWidth / 2.5}
              handleOptions={handleYearChange}
            />
            <DropdownComponent
              name="sem"
              data={filteredSemList}
              placeholder={getOrdinalSuffix(userFirestoreData.usersData.sem) + ' Sem'}
              leftIcon="bars"
              width={screenWidth / 2.5}
              handleOptions={handleSemChange}
            />
          </View>
           <DropdownComponent
              name="subject"
              data={subjectListDetail}
              placeholder={'Subject'}
              leftIcon="Safety"
              width={screenWidth - 50}
              handleOptions={handleYearChange}
            />
            <DropdownComponent
              name="type"
              data={Type}
              placeholder={'Select Type of resource'}
              leftIcon="Safety"
              width={screenWidth - 50}
              handleOptions={handleYearChange}
            />
            <CustomTextInput
              leftIcon="user"
              placeholder="Units Covered"
              name="units"
            />
          <View style={styles.disabledIp} >
                <Feather name = "mail" size = {theme.sizes.iconSmall} color = "#91919F" />
                <Text style = {{fontSize: theme.sizes.subtitle, color: '#91919F', marginLeft: 10}} >{userFirestoreData.usersData.email}</Text>
              </View>
              <View style={styles.SignupButton}>
            <CustomBtn title="Pick a pdf" color={theme.colors.primary}/>
          </View>
          </Box>
        </Form>
        </ScrollView>
          <Modal isOpen={modalVisible} size={'xl'}>
        <Modal.Content maxH={screenHeight}>
          {
            !completed && (
              <>
              <Stack
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: 10,
            }}>
            <Text fontSize={screenHeight * 0.0235} fontWeight={'700'} color={theme.colors.primaryText} lineHeight={screenHeight*0.052} >
              Uploading
            </Text>

            <Text fontSize={screenHeight * 0.0235} fontWeight={'700'} color={theme.colors.primaryText}lineHeight={screenHeight*0.05}>
              {choosenPdf?.name}
            </Text>
            <Text fontSize={screenHeight * 0.015} fontWeight={'300'} color={theme.colors.primaryText}lineHeight={screenHeight*0.05}>
              {(uploadProgress).toFixed(1)}MB of {bytesToMB(choosenPdf?.size)}
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
                width: screenWidth,
                height: screenHeight / 2.5,
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
            }}>
            <TouchableOpacity onPress={cancelUpload}>
              <Text fontWeight={700} fontSize={theme.sizes.title} color={theme.colors.primary}>
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
                    <Box w="100%" h={screenHeight *0.2} px={2} my={4} justifyContent="center" alignItems={"center"} >
                      <AntDesign name="checkcircle" size={50} color={theme.colors.primary} />
                      <Text fontSize={theme.sizes.title} color={theme.colors.primaryText} fontWeight={700} marginTop={4} >
                        Uploaded Successful
                      </Text>
                      <Text fontSize={theme.sizes.textSmall} padding={screenHeight *0.01} paddingTop={screenHeight *0.01} color={theme.colors.textSecondary} textAlign={"center"} fontWeight={700} >
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
                  }}>
                  <TouchableOpacity onPress={()=>{
                    setModalVisible(false);
                    setCompleted(false);
                  }}>
                    <Text fontWeight={700} paddingY={2} fontSize={theme.sizes.title} color={theme.colors.primary}>
                      Cancel{' '}
                    </Text>
                    </TouchableOpacity>
                </Box>
                    </>
                  )
          }
        </Modal.Content>
      </Modal>
        </View>
      </View>
    </View>
  );
};

export default Search;
 