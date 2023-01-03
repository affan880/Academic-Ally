import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React,{useEffect, useState, useMemo} from 'react'
import createStyles from './styles';
import QuickAccess from '../../components/CustomFormComponents/QuickAccess/QuickAccess';
import Recommendation from '../../components/CustomFormComponents/Recommendation/Recommendation';
import ScreenLayout from '../../interfaces/screenLayout';
import { useSelector, useDispatch } from 'react-redux';
import { setUsersData } from '../../redux/reducers/usersData';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


const User = require('../../assets/images/user.jpg');

type MyStackParamList = {
  Notes:undefined
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
  useEffect(() => {
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
              <TouchableOpacity onPress={() => {
                navigation.navigate('Notes')
              }}>
                <Ionicons name='ios-notifications-outline' color={"#ffffff"} size={20} />
              </TouchableOpacity>
           </View>
         </View>
      </View>
      <QuickAccess />
        <View style={{
          marginTop: -30,
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