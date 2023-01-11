import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React,{useEffect, useState, useMemo} from 'react'
import { RouteProp, useNavigation, useRoute, NavigationProp, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavBtn } from '../../components/CustomFormComponents/CustomBtn';
import { Syllabus,Notes, Qp, OtherRes } from '../../assets/images/icons';

type RootStackParamList = {
  NotesList: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: string
  };
};
type MyStackParamList = {
  Notes: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: string,
    selected: string
  }
}
type  MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'Notes'>


type notesTypes = {
  fileName: string,
}



const NotesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const { userData } = route.params;
  const { notesData } = route.params;
  const [notesbtnStyle, setNotesStyle] = useState(false)
  const [syllabusbtnStyle, setSyllabusStyle] = useState(false)
  const [qpbtnStyle, setQpStyle] = useState(false)
  const [otherResbtnStyle, setOtherResStyle] = useState(false)
  const [selected, setSelected] = useState("")
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<MyScreenNavigationProp>();

  const [availableNotes, setavailableNotes] = useState<Array<notesTypes>>([])
  
  useEffect(() => {    
    firestore().collection('Resources').doc('OU').collection(`${userData?.Course}`).doc(`${userData?.Branch}`).collection(`${userData?.Sem}`).doc('Subjects').collection(`${notesData}`).doc('Notes').get().then((data) => {
      setavailableNotes(data.data()?.Notes);
      console.log(data.data()?.Notes);
    });
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name='chevron-back-outline' size={20} color="#ffffff" onPress={() => {
          navigation.goBack()
        }}/>
        <MaterialCommunityIcons name="backup-restore" size={30} color="#ffffff"/>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <TouchableOpacity style={[styles.categoryBtns, syllabusbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(false)
            setSyllabusStyle(true)
            setQpStyle(false)
            setOtherResStyle(false)
            setSelected("1")
          }}>
            <Syllabus />
            <Text style={styles.btnText}>Syllabus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryBtns, notesbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(true)
            setSyllabusStyle(false)
            setQpStyle(false)
            setOtherResStyle(false)
            setSelected("2")
          }} >
            <Notes />
            <Text style={styles.btnText}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryBtns, qpbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(false)
            setSyllabusStyle(false)
            setQpStyle(true)
            setOtherResStyle(false)
            setSelected("3")
          }}>
            <Qp />
            <Text style={styles.btnText}>QP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryBtns, otherResbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(false)
            setSyllabusStyle(false)
            setQpStyle(false)
            setOtherResStyle(true)
            setSelected("4")
          }}>
            <OtherRes />
            <Text style={styles.btnText}>Other Resources</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.selectBtn}>
          <NavBtn title='Select' color={selected === "" ? "#7A7D7D" : "#6360FF"} onPress={() => {
            selected !== "" ? navigation.navigate('Notes', {
              userData: userData,
              notesData: notesData,
              selected: selected
            }): null
          }} />
        </View>  
      </View>
    </View>
  )
}


export default NotesScreen

// import React from 'react';
// import { StyleSheet, Dimensions, View } from 'react-native';
// import ScreenLayout from '../../interfaces/screenLayout';
// import Pdf from 'react-native-pdf';

// export default class PDFExample extends React.Component {
//   render() {
//     const source = { uri: 'https://drive.google.com/u/0/uc?id=1BIlTlX9obwlDkH7FnSS1G-1TERrUuDLb', cache: true };
//     //const source = require('./test.pdf');  // ios only
//     //const source = {uri:'bundle-assets://test.pdf' };
//     //const source = {uri:'file:///sdcard/test.pdf'};
//     //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};
//     //const source = {uri:"content://com.example.blobs/xxxxxxxx-...?offset=0&size=xxx"};
//     //const source = <{uri:"blob:xxxxxxxx-...?offset=0&size=xxx"};

//     return (
//       <ScreenLayout>
//       <View style={styles.container}>
//         <Pdf
//           trustAllCerts={false}
//           source={source}
//           onLoadComplete={(numberOfPages, filePath) => {
//             console.log(`Number of pages: ${numberOfPages}`);
//           }}
//           onPageChanged={(page, numberOfPages) => {
//             console.log(`Current page: ${page}`);
//           }}
//           onError={(error) => {
//             console.log(error);
//           }}
//           onPressLink={(uri) => {
//             console.log(`Link pressed: ${uri}`);
//           }}
//           style={styles.pdf} />
//       </View>
// </ScreenLayout>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   }
// });
