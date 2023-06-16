import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Actionsheet, Avatar, Stack, Text, Toast, useDisclose } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';

import { CustomBtn, NavBtn } from '../../../components/CustomFormComponents/CustomBtn';
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput';
import DropdownComponent from '../../../components/CustomFormComponents/Dropdown';
import Form from '../../../components/Forms/form';
import NavigationLayout from '../../../interfaces/navigationLayout';
import { updateFirestoreData } from '../../../Modules/auth/firebase/firebase';
import { setUserProfile } from '../../../redux/reducers/usersData';
import NavigationService from '../../../services/NavigationService';
import { updatevalidationSchema } from '../../../utilis/validation';
import createStyles from './styles';

type MyStackParamList = {
  'BottomTabBar': any;
  'Home': undefined;
};

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type MyScreenNavigationProp = StackNavigationProp<
  MyStackParamList,
  'BottomTabBar'
>;

const UpdateInformation = () => {
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const dispatch = useDispatch();
  const formRef: any = useRef();
  const uid = auth().currentUser?.uid;
  const userFirestoreData = useSelector((state: any) => {
    return state.usersData;
  });
  const userImage = useSelector((state: any) => {
    return state.usersData.userProfile;
  });
  const user = auth().currentUser;
  const theme = useSelector((state: any) => state.theme);
  const styles = createStyles(theme.colors, theme.sizes);
  const initialValues: any = {
    name: userFirestoreData.usersData.name,
    course: userFirestoreData.usersData.course,
    sem: userFirestoreData.usersData.sem,
    branch: userFirestoreData.usersData.branch,
    Year: userFirestoreData.usersData.Year,
    college: userFirestoreData.usersData.college,
  };
  const [selectedAvatar, setSelectedAvatar] = React.useState<any>(auth().currentUser?.photoURL);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [BranchData, setBranchData] = useState<any>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(userFirestoreData.usersData.branch);
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null);
  const [SemList, setSemList] = useState<any>([]);
  const [selectedSem, setSelectedSem] = useState<any>(null);
  const [course, setCourse] = useState<any>(userFirestoreData.usersData.course);
  const [selectedCourse, setSelectedCourse] = useState<{ label: string; value: string; }[]>([]);
  const apiResponse = useSelector((state: any) => state?.bootReducer?.utilis?.courses);

  const avatarsList = [
    {
      id: 1,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar.png?alt=media&token=e2eb7fb7-88f0-4a9f-9033-e1d9f42027ec',
    },
    {
      id: 2,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar2.png?alt=media&token=61ae44eb-bc9c-4140-b908-6b904f45be65',
    },
    {
      id: 3,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar3.png?alt=media&token=5a38de8a-5892-422a-823c-69493a19d210',
    },
    {
      id: 4,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar4.png?alt=media&token=55d92538-5eaa-4dc9-8c81-3d16a64e6a94',
    },
    {
      id: 5,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar5.png?alt=media&token=bf17dc7c-55c8-4d0e-9451-42a1e5292c9a',
    },
    {
      id: 6,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar6.png?alt=media&token=197ddb9f-5a78-42fd-b956-6ca44d4085a0',
    },
    {
      id: 7,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar7.png?alt=media&token=936a3b53-3c0c-489a-8cb3-a599847e9cf6',
    },
    {
      id: 8,
      image: 'https://firebasestorage.googleapis.com/v0/b/academic-ally-app.appspot.com/o/Avatars%2FAvatar8.png?alt=media&token=2fc7c467-aaa0-41ac-aad1-f8c8d1b300c7',
    },
  ];

  useEffect(() => {
    setSelectedUniversity(userFirestoreData.usersData.university);

    if (selectedUniversity) {
      const universityCourses = Object.keys(apiResponse[userFirestoreData?.usersData?.university]).map((course) => ({
        label: course,
        value: course
      }));
      setSelectedCourse(universityCourses)
    }

    if ((selectedUniversity && course) || (userFirestoreData.usersData.course && userFirestoreData.usersData.university)) {
      if (selectedUniversity && course) {
        const branches = Object.keys(apiResponse[selectedUniversity][course])
          .map((branch) => ({
            label: branch,
            value: branch
          }));
        setBranchData(branches);
      }
      else {
        const branches = Object.keys(apiResponse[userFirestoreData.usersData.university][userFirestoreData.usersData.course])
          .map((branch) => ({
            label: branch,
            value: branch
          }));
        setBranchData(branches);
      }
    }
    if ((course && selectedUniversity && selectedBranch) || (userFirestoreData.usersData.course && userFirestoreData.usersData.university && userFirestoreData.usersData.branch)) {
      if (course && selectedUniversity && selectedBranch) {
        const semesters = apiResponse[selectedUniversity][course][selectedBranch]?.sem.map((value: any, index: any) => {
          return {
            label: (index + 1).toString(),
            value: (index + 1).toString(),
            status: value
          };
        }).filter((value: any) => value.status === true);
        setSemList(semesters);
      }
      else {
        const semesters = apiResponse[userFirestoreData.usersData.university][userFirestoreData.usersData.course][userFirestoreData.usersData.branch]?.sem.map((value: any, index: any) => {
          return {
            label: (index + 1).toString(),
            value: (index + 1).toString(),
            status: value
          };
        }).filter((value: any) => value.status === true);
        setSemList(semesters);;
      }
    }
  }, [selectedUniversity, course, selectedBranch]);

  const YearData: any = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
  ];

  const handleYearChange = (event: any) => {
    if (event?.value === '' || event?.value === undefined || event?.value === null) {
      return;
    }
    const yearValue = event?.value;
    setSelectedYear(yearValue);

    setSelectedSem('');
    formRef.current?.setFieldValue('sem', '');
  };

  const handleSemChange = (event: any) => {
    if (event?.value === '' || event?.value === undefined || event?.value === null) {
      return;
    }
    const semValue = event?.value;
    setSelectedSem(semValue);
    if (!selectedYear) {
      if (semValue <= 2) {
        setSelectedYear('1');
      } else if (semValue <= 4) {
        setSelectedYear('2');
      } else if (semValue <= 6) {
        setSelectedYear('3');
      } else {
        setSelectedYear('4');
      }
    }
  };

  const filteredSemList = SemList?.filter((sem: any) => {
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


  const updateData = async (values: any) => {
    const data = {
      name: values?.name,
      course: values?.course,
      sem: values?.sem,
      branch: values?.branch,
      Year: values?.Year,
      college: values?.college,
      university: userFirestoreData?.usersData?.university,
      pfp: userFirestoreData?.usersData?.pfp,
      email: userFirestoreData?.usersData?.email,
    };
    updateFirestoreData(uid, data, dispatch);
    NavigationService.navigate(NavigationService.screens.BottomTabNavigator, {
      screen: NavigationService.screens.Home,
    });
    AsyncStorage.setItem('reccommendSubjects', JSON.stringify([]));
  };

  function getOrdinalSuffix(text: string) {
    const number = parseInt(text, 10);
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const lastDigit = number % 10;
    const suffix = suffixes[(lastDigit === 1 && number !== 11) ? 1
      : (lastDigit === 2 && number !== 12) ? 2
        : (lastDigit === 3 && number !== 13) ? 3
          : 0];

    return `${number}${suffix}`;
  }

  const updateUserImage = (img: string) => {
    auth()
      .currentUser?.updateProfile({
        photoURL: img,
      })
      .then(() => {
        dispatch(setUserProfile(img));
        Toast.show({
          title: 'Avatar updated successfully',
          duration: 3000,
          backgroundColor: '#00b300',
        });
      });
  };


  return (
    <NavigationLayout rightIconFalse={true} title="Update Profile" handleScroll={() => { }} >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: theme.sizes.height * 0.03,
          marginBottom: theme.sizes.height * 0.03,
        }}>
        <Avatar source={{
          uri: userImage || user?.photoURL
        }} size={'2xl'} alignSelf={'center'} style={{
          borderWidth: 2,
          borderColor: '#6360FF',
        }} />
        <Feather
          name="edit-3"
          size={13}
          color={'#FFFFFF'}
          onPress={onOpen}
          style={{
            position: 'relative',
            bottom: 32,
            left: 45,
            zIndex: 999,
            padding: 5,
            backgroundColor: '#6360FF',
            borderRadius: 50,
          }}
        />

        <Form
          validationSchema={updatevalidationSchema}
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={values => updateData(values)}>
          <CustomTextInput
            leftIcon="user"
            placeholder="Full Name"
            name="name"
          />
          <View
            style={{
              flexDirection: 'row',
              width: screenWidth - 50,
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <DropdownComponent
              name="course"
              data={selectedCourse}
              placeholder={userFirestoreData.usersData.course}
              leftIcon="bars"
              width={screenWidth / 2.5}
              handleOptions={(item: any) => {
                if (item?.value) {
                  setCourse(item.value)
                  formRef.current?.setFieldValue('branch', '');
                  formRef.current?.setFieldValue('year', '');
                  formRef.current?.setFieldValue('sem', '');
                }
              }}
            />
            <DropdownComponent
              name="branch"
              data={BranchData}
              placeholder={userFirestoreData.usersData.branch}
              leftIcon="ellipsis1"
              width={screenWidth / 2.5}
              handleOptions={(item: any) => {
                if (item?.value) {
                  setSelectedBranch(item?.value)
                  setSemList([])
                  course ? null : setCourse(userFirestoreData.usersData.course)
                  formRef.current?.setFieldValue('year', '');
                  formRef.current?.setFieldValue('sem', '');
                }
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: screenWidth - 50,
              flex: 1,
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
          {
            userFirestoreData.usersData?.college !== '' ? (
              <View style={styles.disabledIp} >
                <FontAwesome5 name="university" size={theme.sizes.iconSmall} color="#91919F" />
                <Text style={{ fontSize: theme.sizes.subtitle, color: '#91919F', marginLeft: 10 }} >{userFirestoreData.usersData.college}</Text>
              </View>
            ) :
              (
                <CustomTextInput
                  leftIcon="college"
                  placeholder="college"
                  name="college"
                />
              )
          }
          <View style={styles.disabledIp} >
            <Feather name="mail" size={theme.sizes.iconSmall} color="#91919F" />
            <Text style={{ fontSize: theme.sizes.subtitle, color: '#91919F', marginLeft: 10 }} >{userFirestoreData.usersData.email}</Text>
          </View>
          <View style={styles.SignupButton}>
            <CustomBtn title="Update" color="#6360FF" />
          </View>
        </Form>
      </View>
      <Actionsheet isOpen={isOpen} onClose={onClose} borderRadius={0}  >
        <Actionsheet.Content height={screenHeight * 0.65} backgroundColor={theme.colors.actionSheet} >
          <Avatar source={{
            uri: selectedAvatar
          }} size={screenHeight * 0.14} alignSelf={'center'} marginTop={screenHeight * 0.01} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: screenHeight * 0.05 }}>
            <Text style={{ fontSize: theme.sizes.subtitle, color: theme.colors.primaryText, fontWeight: 'bold', textAlign: "center" }}>select from a variety of avatars to represent yourself</Text>
          </View>
          <Stack style={styles.gridContainer} >
            {
              avatarsList.map((item) => {
                return (
                  <TouchableOpacity key={item.id} onPress={() => {
                    setSelectedAvatar(item.image)
                  }}>
                    <Avatar source={
                      {
                        uri: item.image
                      }
                    } size={screenHeight * 0.07} style={[styles.gridItem, {
                      borderWidth: selectedAvatar === item.image ? 2 : 0,
                      borderColor: theme.colors.mainTheme
                    }]} alignSelf={'center'} />
                  </TouchableOpacity>
                )
              })
            }
          </Stack>
          <Stack direction="row" space={2} marginY={screenHeight * 0.05} paddingX={screenWidth * 0.02} alignItems="center" justifyContent="space-evenly" width={"100%"} >
            <TouchableOpacity onPress={onClose} >
              <Text fontSize={theme.sizes.title} fontWeight={'700'} textAlign="center" color={theme.colors.terinaryText} >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: '#6360FF',
              borderRadius: 10,
              paddingHorizontal: screenWidth * 0.1,
              paddingVertical: screenHeight * 0.012,
            }} onPress={() => {
              updateUserImage(selectedAvatar)
              onClose()
            }}>
              <Text fontSize={theme.sizes.title} fontWeight={'700'} textAlign="center" color={"#FFF"} >
                Confirm
              </Text>
            </TouchableOpacity>
          </Stack>
        </Actionsheet.Content>
      </Actionsheet>
    </NavigationLayout>
  );
};

export default UpdateInformation;

const styles = StyleSheet.create({});
