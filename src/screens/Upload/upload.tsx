import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native'
import React, { useMemo,useState } from 'react'
import ScreenLayout from '../../interfaces/screenLayout';
import { CustomTextInput } from '../../components/CustomFormComponents/CustomTextInput';
import Form from '../../components/Forms/form';
import { CustomBtn, NavBtn } from '../../components/CustomFormComponents/CustomBtn'
import DropdownComponent from '../../components/CustomFormComponents/Dropdown'
import { UploadvalidationSchema } from '../../utilis/validation'
import createStyles from './styles'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Upload = () => {
    console.log("Upload Screen")
    const height = Dimensions.get("screen").height;
    const width = Dimensions.get("screen").width;
    const styles = useMemo(() => createStyles(), []);
    const onSubmitBTN = (values: any) => {
        // const createUserDocument = async (values: any) => {
        firestore()
            .collection('Notes')
            .doc('OU').collection(`${values.course}`).doc(`${values.branch}`).collection(`${values.sem}`).doc(`${values.subjectName}`).update({
                resources: firestore.FieldValue.arrayUnion({
                    college: values.college,
                    facultyName: values.facultyName,
                    notesId: values.notesId,
                    uploaderEmail: auth().currentUser?.email,
                    uploaderName: auth().currentUser?.displayName,
                    uploaderUid: auth().currentUser?.uid,
                    reviews: 0,
                    rating: 0,
                    ratingCount: 0,
                    comments: [],
                    likes: 0,
                    dislikes: 0,
                    likedBy: [],
                    dislikedBy: [],
                    views: 0,
                    downloads: 0,
                    date: new Date().toDateString(),
                    time: new Date().toLocaleTimeString(),
                    shared: 0,
                    sharedBy: [],
                    sharedWith: [],
                })
            })
            .then(() => { 
                console.log('User added!');
                Alert.alert("Notes Uploaded");
            })
        // };
    }

    const initialValues = {
        facultyName: "",
        college: "",
        notesId: "",
        course: "",
        branch: "",
        sem: "",
        subjectName: "",
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

    const BranchData: any = [
        { label: 'IT', value: '1' },
        { label: 'CSE', value: '2' },
        { label: 'ECE', value: '3' },
        { label: 'MECH', value: '4' },
        { label: 'CIVIL', value: '5' },
        { label: 'EEE', value: '6' },
    ];
    return (
        <ScreenLayout>
            <View style={styles.inputContainer}>
            <Form validationSchema={UploadvalidationSchema} initialValues={initialValues} onSubmit={(values) => { onSubmitBTN(values) }}  >
                <CustomTextInput leftIcon="user" placeholder="Faculty Name" name='facultyName' />
                <CustomTextInput leftIcon="user" placeholder="College Name" name='college' />
                <CustomTextInput leftIcon="user" placeholder="Notes ID" name="notesId" />
                <View style={{ flexDirection: 'row', width: width - 50, justifyContent: "space-between" }}>
                    <DropdownComponent name='course' data={CourseData} placeholder={"Course"} leftIcon="Safety" width={width / 2.5} />
                    <DropdownComponent name='branch' data={BranchData} placeholder={"Branch"} leftIcon="bars" width={width / 2.5} />
                </View>
                <View style={{ flexDirection: 'row', width: width - 50, justifyContent: "space-between" }}>
                    <DropdownComponent name='sem' data={SemData} placeholder={"Sem"} leftIcon="bars" width={width / 2.5} />
                </View>
                <CustomTextInput leftIcon="user" placeholder="Subject Name" name="subjectName" />
                <View style={styles.SignupButton}>
                    <CustomBtn title="Sign Up" color="#19647E" />
                </View>
            </Form>
            </View>
        </ScreenLayout>
    )
}


export default Upload

const styles = StyleSheet.create({})