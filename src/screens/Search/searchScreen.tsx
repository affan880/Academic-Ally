import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native'
import React, { useMemo, useState, useRef } from 'react'
import ScreenLayout from '../../interfaces/screenLayout';
import { CustomTextInput } from '../../components/CustomFormComponents/CustomTextInput';
import Form from '../../components/Forms/form';
import { CustomBtn, NavBtn } from '../../components/CustomFormComponents/CustomBtn'
import DropdownComponent from '../../components/CustomFormComponents/Dropdown'
import { UploadvalidationSchema } from '../../utilis/validation'
import createStyles from './styles'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Search = () => {
  const formRef: any = useRef();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const styles = useMemo(() => createStyles(), []);
  const [searchValue, setSearchValue] = useState('');

  const onSubmitBTN = (values: any) => {
    // const createUserDocument = async (values: any) => { /Resources/OU/B.E/CSE/1/Mathematics-1
      firestore()
        .collectionGroup("VLSI Design").get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          });
        }
        )
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
  return (
    <ScreenLayout>
      <View style={styles.inputContainer}>
        <Form validationSchema={UploadvalidationSchema} innerRef={formRef} initialValues={initialValues} onSubmit={(values) =>  
          onSubmitBTN(values)
        }  >
          <CustomTextInput leftIcon="user" placeholder="Faculty Name" name='facultyName' />
          
          <View style={styles.SignupButton}>
            <CustomBtn title="Search" color="#19647E" />
          </View>
        </Form>
      </View>
    </ScreenLayout>
  )
}


export default Search

const styles = StyleSheet.create({})