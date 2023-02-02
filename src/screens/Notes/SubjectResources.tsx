import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React,{useEffect, useState, useMemo} from 'react'
import { RouteProp, useNavigation, useRoute, NavigationProp, ParamListBase } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import NavigationLayout from '../../interfaces/navigationLayout';
import createStyles from './styles';
import { NavBtn } from '../../components/CustomFormComponents/CustomBtn';
import { Syllabus,Notes, Qp, OtherRes } from '../../assets/images/icons';

type RootStackParamList = {
  Home: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: string
  };
};
type MyStackParamList = {
  NotesList: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: string,
    selected: string,
    subject: string
  },
  UploadScreen: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: string,
    selected: string,
    subject: string
  }
}
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'NotesList'>

type  uploadScreenNavigationProp = StackNavigationProp<MyStackParamList, 'UploadScreen' >


type notesTypes = {
  fileName: string,
}



const NotesScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const { userData } = route.params;
  const { notesData }: any = route.params;
  const { subject }: any = route.params;
  const [notesbtnStyle, setNotesStyle] = useState(false)
  const [syllabusbtnStyle, setSyllabusStyle] = useState(false)
  const [qpbtnStyle, setQpStyle] = useState(false)
  const [otherResbtnStyle, setOtherResStyle] = useState(false)
  const [selected, setSelected] = useState("")
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<MyScreenNavigationProp>();
  const navigationUpload = useNavigation<uploadScreenNavigationProp>();

  const [availableNotes, setavailableNotes] = useState<Array<notesTypes>>([])

  return (
    <NavigationLayout rightIconFalse={true}>
      <View style={styles.categoryBtnsContainer}>
      <View >
        {
            notesData.syllabus.length > 0 ?
          <TouchableOpacity style={[styles.categoryBtns, syllabusbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(false)
            setSyllabusStyle(true)
            setQpStyle(false)
            setOtherResStyle(false)
            setSelected("syllabus")
          }}>
            <Syllabus />
            <Text style={styles.btnText}>Syllabus</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={[styles.disabledBtn, syllabusbtnStyle ? styles.disabledBtnClicked : null]}
                onPress={() => {
                  setNotesStyle(false)
                  setSyllabusStyle(true)
                  setQpStyle(false)
                  setOtherResStyle(false)
                  setSelected("syllabus")
                }}
              >
                <Syllabus />
                <Text style={styles.btnText}>Syllabus</Text>
              </TouchableOpacity>
          }
          </View>
          <View>{
            notesData.notes.length > 0 ?
          <TouchableOpacity style={[styles.categoryBtns, notesbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(true)
            setSyllabusStyle(false)
            setQpStyle(false)
            setOtherResStyle(false)
            setSelected("notes")
          }} >
            <Notes />
            <Text style={styles.btnText}>Notes</Text>
          </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.disabledBtn, notesbtnStyle ? styles.disabledBtnClicked : null]} onPress={() => {
                setNotesStyle(true)
                setSyllabusStyle(false)
                setQpStyle(false)
                setOtherResStyle(false)
                setSelected("notes")
              }}  >
                <Notes />
                <Text style={styles.btnText}>Notes</Text>
              </TouchableOpacity> 
          }
          </View>
          <View>{
            notesData.questionPapers.length > 0 ?
          <TouchableOpacity style={[styles.categoryBtns, qpbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(false)
            setSyllabusStyle(false)
            setQpStyle(true)
            setOtherResStyle(false)
            setSelected("questionPapers")
          }}>
            <Qp />
            <Text style={styles.btnText}>QP</Text>
          </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.disabledBtn, qpbtnStyle ? styles.disabledBtnClicked : null]} onPress={() => {
                setNotesStyle(false)
                setSyllabusStyle(false)
                setQpStyle(true)
                setOtherResStyle(false)
                setSelected("questionPapers")
              }} >
                <Qp />
                <Text style={styles.btnText}>QP</Text>
              </TouchableOpacity>
          }
          </View>
          <View>{
            notesData.otherResources.length > 0 ?
          <TouchableOpacity style={[styles.categoryBtns, otherResbtnStyle ? styles.categoryBtnClicked : null]} onPress={() => {
            setNotesStyle(false)
            setSyllabusStyle(false)
            setQpStyle(false)
            setOtherResStyle(true)
            setSelected("otherResources")
          }}>
            <OtherRes />
            <Text style={styles.btnText}>Other Resources</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={[styles.disabledBtn, otherResbtnStyle ? styles.disabledBtnClicked : null]}
                onPress={() => {
                  setNotesStyle(false)
                  setSyllabusStyle(false)
                  setQpStyle(false)
                  setOtherResStyle(true)
                  setSelected("otherResources")
                }}
              >
                <OtherRes />
                <Text style={styles.btnText}>Other Resources</Text>
              </TouchableOpacity>
          }
        </View>
      </View>
        <View style={styles.selectBtn}>
          <NavBtn title={selected === "" ? "Select" : notesData[selected].length > 0 ? "Select" : "Upload"} color={selected === "" ? "#7A7D7D" : notesData[selected].length > 0 ? "#6360FF" : "#FF8181" } onPress={() => {
            selected === "" ? null : notesData[selected].length > 0 ? navigation.navigate('NotesList', {
              userData: userData,
              notesData: notesData,
              selected: selected,
              subject: subject
            }) : navigation.navigate('UploadScreen', {
              userData: userData,
              notesData: notesData,
              selected: selected,
              subject: subject
            }) 
          }} />
        </View>  
    </NavigationLayout>
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
