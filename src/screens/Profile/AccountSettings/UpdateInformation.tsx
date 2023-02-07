import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React,{useRef} from 'react'
import NavigationLayout from '../../../interfaces/navigationLayout';
import { CustomBtn, NavBtn } from '../../../components/CustomFormComponents/CustomBtn'
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput'
import Form from '../../../components/Forms/form'
import DropdownComponent from '../../../components/CustomFormComponents/Dropdown'
import { updatevalidationSchema } from '../../../utilis/validation'
import createStyles from './styles'
import { Avatar } from 'native-base'
import auth from '@react-native-firebase/auth';
import { getFirestoreData, logOut, updateFirestoreData } from '../../../Modules/auth/firebase/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setUsersData } from '../../../redux/reducers/usersData';
import { useNavigation } from '@react-navigation/native';

const User = require('../../../assets/images/user.jpg');

const screenWidth = Dimensions.get('screen').width

type NavigationLayout = {
    navigation: any;
    route: any;
}

const UpdateInformation = () => {
    const navigation = useNavigation<NavigationLayout>();
    const dispatch = useDispatch();
    const formRef: any = useRef();
    const uid = auth().currentUser?.uid;
    const userFirestoreData = useSelector((state: any) => {
        return state.usersData;
    })

    const styles = createStyles();
    const initialValues = {
        name: userFirestoreData.usersData.Name,
        course: userFirestoreData.usersData.Course,
        sem: userFirestoreData.usersData.Sem,
        branch: userFirestoreData.usersData.Branch,
        year: userFirestoreData.usersData.Year,
    }
    const CourseData: any = [
        { label: 'B.E', value: '1' },
        { label: 'B.TECH', value: '2' },
    ];
    const SemData: any = [
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
    ]

    const BranchData: any = [
        { label: 'IT', value: '1' },
        { label: 'CSE', value: '2' },
        { label: 'ECE', value: '3' },
        { label: 'MECH', value: '4' },
        { label: 'CIVIL', value: '5' },
        { label: 'EEE', value: '6' },
    ];

    const updateReduxData = (data: any) => {
        dispatch(setUsersData(data));
        navigation.navigate('BottomTabBar', {
            screen: 'HomeScreen',
        })
    }

    

    const updateData = async (values: any ) => {
        const data = {
            Name: values.name,
            Course: values.course,
            Sem: values.sem,
            Branch: values.branch,
            Year: values.year,
        }
        updateFirestoreData(uid, data);
        getFirestoreData(uid, updateReduxData);

    }
  return (
    <NavigationLayout rightIconFalse={true} >
          <View style={{
              flex: 1,
              justifyContent: "center",
                alignItems: "center",
          }} >
            <Avatar source={User} size={'2xl'} alignSelf={'center'} mt={10} />
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10, color:"#000000" }} >Course: {userFirestoreData.usersData.Course}</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10, color:"#000000" }} >Sem: {userFirestoreData.usersData.Sem}</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10,color:"#000000" }} >Branch: {userFirestoreData.usersData.Branch}</Text>
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 10, color:"#000000" }} >Year: {userFirestoreData.usersData.Year}</Text>
        <Form validationSchema={updatevalidationSchema} innerRef={formRef} initialValues={initialValues} onSubmit={(values) =>
                    updateData(values)
              } >
              <CustomTextInput leftIcon="user" placeholder="Full Name" name='name' />
              <View style={{ flexDirection: 'row', width: screenWidth - 50, flex: 1, justifyContent: "space-between" }}>
                  <DropdownComponent name='course' data={CourseData} placeholder={"Course"} leftIcon="Safety" width={screenWidth / 2.5} />
                  <DropdownComponent name='branch' data={BranchData} placeholder={"Branch"} leftIcon="bars" width={screenWidth / 2.5} />
              </View>
              <View style={{ flexDirection: 'row', width: screenWidth - 50, flex: 1, justifyContent: "space-between" }}>
                  <DropdownComponent name='year' data={YearData} placeholder={"Studying year"} leftIcon="bars" width={screenWidth / 2.5} />
                  <DropdownComponent name='sem' data={SemData} placeholder={"Semester"} leftIcon="ellipsis1" width={screenWidth / 2.5} />
              </View>
                  <View style={styles.SignupButton}>
                      <CustomBtn title="Update" color="#19647E" />
                  </View>
          </Form>      
        </View>
    </NavigationLayout>
  )
}

export default UpdateInformation

const styles = StyleSheet.create({})