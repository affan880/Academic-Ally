import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView } from 'react-native'
import React,{useState} from 'react'
import { logOut, firestoreDB } from '../../Modules/auth/firebase/firebase'
import firebase from "@react-native-firebase/app"
import firestore from "@react-native-firebase/firestore"


const HomeScreen = () => {
  const documentPath = "users/hey"
  const [data, setData] = useState("ddd")
  

  const DeleteAcc = async () => {
    console.log("Deleting user")
  }


  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#E6E6E6',
    }} >
      <StatusBar
        // animated={true}
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
      <ScrollView>
        <View style={{
          flex: 1,
          backgroundColor: '#ffffff',
          height: height,
          width: width,
          justifyContent: 'center',
          alignItems: 'center',
        }} >
          <Text
            onPress={() => {
              DeleteAcc()
            }}
            style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000000',
          }} >Home Screen</Text>
          <Text
            onPress={() => {
              logOut()
            }}
            style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#000000',
          }} >Log out</Text>
        </View>

      </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})