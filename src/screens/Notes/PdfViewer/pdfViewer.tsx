import React,{useState, useEffect} from 'react';
import { StyleSheet, Dimensions, View, ScrollView, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  NotesList: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: any,
    selected: string,
    subject: string
  };
};

const PdfViewer = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const [offline, setOffline] = useState(false);
  const { userData } = route.params;
  const { notesData } = route.params;
  const { selected } = route.params;
  const { subject } = route.params;
  const [expire , setExpire] = useState(10)
  const [source, setSource] = useState({ uri: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`, cache: true, expiration: 0  });
  // const source = { uri: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`, cache: true, expiration: 60*60 }
  // const setSource = { uri: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`, cache: true, expiration: 60 * 60  }
  const styles = createStyles();
  const navigation = useNavigation();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload]);


  function remove(str: string) {
    if (str.includes("(oufastupdates.com)") || str.includes(".pdf")) {
      return str.replace(/\(oufastupdates.com\)|\.pdf/g, "");
    } else {
      return str;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name='chevron-back-outline' size={20} color="#ffffff" onPress={() => {
          navigation.goBack()
        }} />
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#ffffff',
          maxWidth: '80%',
        }} >
          {
            notesData.fileName.length > 20 ? remove(notesData.fileName).substring(0, 20) + "..." :
            remove(notesData.fileName).substring(0, 20)
          }
        </Text>
        <MaterialCommunityIcons name="backup-restore" size={30} color="#ffffff" onPress={() => {
          console.log("offline");
          setSource({ uri: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`, cache: true, expiration: 0 });
          setReload(true);
        }} />
      </View>
      <View style={styles.body}>
        <View style={styles.bodyContent}>
         <View style={styl.container}>
         <Pdf
          trustAllCerts={false}
          source={source}
          scale={1}
          spacing={10}
          enableRTL={true}
          enableAnnotationRendering={true}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
            console.log(`File path: ${filePath}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
              }}
          style={styl.pdf} />
      </View>
        </View>
      </View>
    </View>
  )
}

export default PdfViewer

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

const styl = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  pdf: {
    width: width,
    height: height ,
    borderRadius: 40,
    marginBottom: height * 0.12,
  }
});
