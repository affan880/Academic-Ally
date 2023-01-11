import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React,{useEffect, useState, useMemo} from 'react'
import createStyles from './styles';
import QuickAccess from '../../components/CustomFormComponents/QuickAccess/QuickAccess';
import Recommendation from '../../components/CustomFormComponents/Recommendation/Recommendation';
import ScreenLayout from '../../interfaces/screenLayout';
import { useSelector, useDispatch } from 'react-redux';
import { setUsersData } from '../../redux/reducers/usersData';
import firestore from '@react-native-firebase/firestore';
import auth, { firebase } from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Qp } from '../../utilis/Qp';
import { notesDe } from '../../utilis/notes';


const User = require('../../assets/images/user.jpg');

type MyStackParamList = {
  Notes: { itemId: number };
}
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'Notes'>
type Props = {}

const HomeScreen = (props: Props) => {
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation < MyScreenNavigationProp>();
  const dispatch = useDispatch()
  const userFirestoreData = useSelector((state:any) => {
    return state.usersData;
  })
  ///Resources/OU/B.E/IT/6
  useEffect(() => {
    // notesDe.map((item) => {
    //   firestore().collection('Resources').doc('OU').collection('B.E').doc('IT').collection('6').doc('Subjects').collection('Machine Learning').doc('Notes').update({
    //     Notes: firebase.firestore.FieldValue.arrayUnion({
    //       fileName: item.name,
    //       college: null,
    //       facultyName: null,
    //       notesId: item.notesid,
    //       uploaderEmail: item.ownerEmail,
    //       uploaderName: 'Affan',
    //       uploaderUid: 'mAoHs0lNQtUXyCir1QbkSMSJpu72',
    //       reviews: 0,
    //       rating: 0,
    //       ratingCount: 0,
    //       comments: [],
    //       likes: 0,
    //       dislikes: 0,
    //       likedBy: [],
    //       dislikedBy: [],
    //       views: 0,
    //       viewedBy: [],
    //       downloads: 0,
    //       date: Date.now(),
    //       time: new Date().getTime(),
    //       shared: 0,
    //       sharedBy: [],
    //       sharedWith: [],
    //     })
    //   })
    //   console.log(item.name)
    // },[])

    const subscriber = firestore()
    .collection('Users')
    .doc(auth().currentUser?.uid)
    .onSnapshot(documentSnapshot => {
      dispatch(setUsersData(documentSnapshot.data()))
      });
    return () => subscriber();
  }, []);


  return (
    <ScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}
      style={{
      flex: 1,
        marginBottom: 70,
      backgroundColor: '#6360FF',
    }}>
        <View style={styles.header}>
        <View >
            <View style={styles.userInfo}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
             <View style={styles.userImgContainer}>
               <Image source={User} style={styles.userImg} />
             </View>
                <View style={{
                  marginLeft: 10,
             }}>
               <Text style={styles.salutation}>Welcome back</Text>
               <Text style={styles.userName}>{ userFirestoreData.usersData.Name }</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name='ios-notifications-outline' color={"#ffffff"} size={20} />
              </TouchableOpacity>
           </View>
         </View>
      </View>
      <QuickAccess />
        <View style={{
          marginTop: -120,
          backgroundColor: '#F1F1FA',
          paddingTop: 80,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <Text style={{
          color: '#161719',
          lineHeight: 30,
          fontSize: 16,
          fontWeight: '700',
          fontFamily: 'DM Sans',
          paddingLeft: 20,
          fontStyle: "normal",
        }} >Recommended</Text>
      <View>
        <Recommendation />
      </View>
      </View>
      </ScrollView>
    </ScreenLayout>
  )
}

export default HomeScreen