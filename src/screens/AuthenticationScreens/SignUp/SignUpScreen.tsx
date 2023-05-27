import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { Toast } from 'native-base';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';

import { SIGNUPILLUSTRATION } from '../../../assets';
import { CustomBtn, NavBtn } from '../../../components/CustomFormComponents/CustomBtn';
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput';
import DropdownComponent from '../../../components/CustomFormComponents/Dropdown';
import Form from '../../../components/Forms/form';
import CustomLoader from '../../../components/loaders/CustomLoader';
import { createUser } from '../../../Modules/auth/firebase/firebase';
import { setUsersData } from '../../../redux/reducers/usersData';
import { setCustomLoader } from '../../../redux/reducers/userState';
import NavigationService from '../../../services/NavigationService';
import { validationSchema } from '../../../utilis/validation';
import createStyles from './styles';

const screenWidth = Dimensions.get('screen').width;

interface IProps {
  navigation: NavigationProp<ParamListBase>;
}
const SignUpScreen: FC<IProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(), []);
  const formRef: any = useRef();
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSem, setSelectedSem] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<{ label: string; value: string; }[]>([]);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    sem: '',
    branch: '',
    year: '',
    university: '',
    college: '',
  };
  const courses: any = {
    OU: [
      { label: 'B.E', value: 'BE' },
    ],
    JNTUH: [
      { label: 'B.TECH', value: 'BTECH' },
    ]
  }
  const CourseData: any = [
    { label: 'B.E', value: 'BE' },
  ];
  const CourseData1: any = [
    { label: 'B.TECH', value: 'BTECH' },
  ];

  const SemList: any = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
  ];

  const YearData: any = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
  ];

  const BranchData: any = [
    { label: 'IT', value: 'IT' },
    { label: 'CSE', value: 'CSE' },
    { label: 'ECE', value: 'ECE' },
    { label: 'MECH', value: 'MECH' },
    { label: 'CIVIL', value: 'CIVIL' },
    { label: 'EEE', value: 'EEE' },
  ];

  const UniversityData: any = [
    { label: 'Osmania University', value: 'OU' },
    { label: 'Jawaharlal Nehru Technological University', value: 'JNTUH' },
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

  const onSubmit = (email: string, password: string, initialValues: any) => {
    createUser(email, password, initialValues, dispatch)
      .then(() => {
        firestore()
          .collection('Users')
          .doc(auth().currentUser?.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              dispatch(setUsersData(doc.data()));
            }
          });
      })
      .catch(error => {
        dispatch(setCustomLoader(false));
        Alert.alert(error.message);
      });
  };

  useEffect(() => {
    firestore()
      .collection('utils').doc('meta-data').get().then((doc) => {
        console.log(doc.data());
      }
      )
  }, []);

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <CustomLoader />
      <StatusBar
        animated={true}
        translucent={true}
        backgroundColor={'transparent'}
      />

      <LinearGradient
        colors={['#FF8181', '#6360ff']}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.LinearGradient}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEnabled={true}>
          <Image source={SIGNUPILLUSTRATION} style={styles.studyIcon} />
          <Text style={styles.welcomeText}> Hi there!</Text>
          <Text style={styles.loginText}>Let's Get Started</Text>
          <View style={styles.inputContainer}>
            <Form
              innerRef={formRef}
              validationSchema={validationSchema}
              initialValues={initialValues}
              onSubmit={values => {
                dispatch(setCustomLoader(true));
                onSubmit(values?.email, values?.password, values);
              }}>
              <CustomTextInput
                leftIcon="user"
                placeholder="Full Name"
                name="name"
              />
              <CustomTextInput
                leftIcon="mail"
                placeholder="Email"
                name="email"
              />
              <CustomTextInput
                leftIcon="lock"
                placeholder="Password"
                name="password"
              />
              <CustomTextInput
                leftIcon="lock"
                placeholder="Confirm Password"
                handlePasswordVisibility
                name="confirmPassword"
              />
              <DropdownComponent
                name="university"
                data={UniversityData}
                placeholder={'Select the name of your university'}
                leftIcon="ellipsis1"
                width={screenWidth - 50}
                handleOptions={(item: any) => {
                  if (item?.value) {
                    setSelectedCourse(courses[item?.value])
                  }
                }}
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
                  placeholder={'Course'}
                  leftIcon="Safety"
                  width={screenWidth / 2.5}
                  handleOptions={() => {
                    if (formRef.current?.values?.course === '' && formRef.current?.values?.university === '') {
                      Toast.show({
                        title: 'Please Select a university first',
                        duration: 4000,
                        backgroundColor: '#FF0101',
                      })
                    }
                  }}
                />
                <DropdownComponent
                  name="branch"
                  data={BranchData}
                  placeholder={'Branch'}
                  leftIcon="bars"
                  width={screenWidth / 2.5}
                  handleOptions={() => { }}
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
                  name="year"
                  data={YearData}
                  placeholder={'Studying year'}
                  leftIcon="bars"
                  width={screenWidth / 2.5}
                  handleOptions={handleYearChange}
                />
                <DropdownComponent
                  name="sem"
                  data={filteredSemList}
                  placeholder={'Semester'}
                  leftIcon="ellipsis1"
                  width={screenWidth / 2.5}
                  handleOptions={handleSemChange}
                />
              </View>

              <CustomTextInput
                leftIcon="user"
                placeholder="College Name"
                name="college"
              />
              <View style={styles.SignupButton}>
                <CustomBtn title="Sign Up" color="#6360FF" />
              </View>
              <Text style={styles.orText}>Or</Text>
              <View style={styles.LoginButton}>
                <NavBtn
                  title="Log In"
                  onPress={() => {
                    NavigationService.navigate(NavigationService.screens.Login);
                  }}
                  color="#FF8181"
                />
              </View>
            </Form>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUpScreen;
