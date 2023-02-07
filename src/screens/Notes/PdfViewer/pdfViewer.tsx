import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, ScrollView, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack';
import { Fab, Icon, Popover, Button, VStack, Actionsheet,useDisclose, Text, Box, Center, HStack,  } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {userAddToRecents, userRemoveFromRecents, userClearRecents } from '../../../redux/reducers/usersRecentPdfsManager';
import Entypo from 'react-native-vector-icons/Entypo';
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

type MyStackParamList = {
  SavedPdfViewer: {
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

type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'SavedPdfViewer'>



const PdfViewer = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const [offline, setOffline] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  const { userData } = route.params;
  const { notesData } = route.params;
  const { selected } = route.params;
  const { subject } = route.params;
  const source = { uri: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`, cache: true, expiration: 60 * 120 }
  // const setSource = { uri: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`, cache: true, expiration: 60 * 60  }
  const styles = createStyles();
  // const navigation = useNavigation();
  const navigation = useNavigation<MyScreenNavigationProp>();
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch();

  const userRecents = useSelector((state: any) => state.userRecentPdfs.RecentViews);

  
  useEffect(() => {
    console.log("userRecensts", userRecents, "length", userRecents.length);
    dispatch(userAddToRecents(notesData));
  }, [reload]);


  function remove(str: string) {
    if (str.includes("(oufastupdates.com)") || str.includes(".pdf")) {
      const text = str.replace(/\(oufastupdates.com\)|\.pdf/g, "");
      return text.slice(0, 35) + "...";
    } 
    if (str.length > 15) {
      return str.slice(0, 5) + "...";
    }
    return str;
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
            totalPages > 0 ? `${currentPage}/${totalPages}` : "0/0"
          }
        </Text>
        <MaterialCommunityIcons name="backup-restore" size={30} color="#ffffff" onPress={onOpen} />
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
                setCurrentPage(page);
                setTotalPages(numberOfPages);
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
      <Popover trigger={triggerProps => {
      return <Fab renderInPortal={false} backgroundColor={"#FF8181"} {...triggerProps} shadow={2} size="lg" icon={<Icon color="white" as={AntDesign} name="plus" size="lg" />} />;
    }}>
        <Popover.Content accessibilityLabel="Delete Customerd" w="20" height={"80"} >
          <Popover.Arrow />
          <Popover.Body>
            <VStack space={2}>
              <Button onPress={() => {
                console.log("offline");
                navigation.navigate('SavedPdfViewer', {
                  userData: userData,
                  notesData: notesData,
                  selected: selected,
                  subject: subject
                })
                setReload(true);
              }} colorScheme="red" variant="outline">
                Offline
              </Button>
              <Button onPress={() => {
                console.log("share");
                Share.share({
                  message: `https://drive.google.com/u/0/uc?id=${notesData.notesId}`,
                });
              }} colorScheme="blue" variant="outline">
                Share
              </Button>
            </VStack>

          </Popover.Body>
        </Popover.Content>
      </Popover>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <HStack w="100%" h={60} px={4} justifyContent="space-between">
            <Text fontSize="16" color="gray.500" _dark={{
            color: "gray.300"
          }}>
              Recents
            </Text>
            <TouchableOpacity onPress={() => {
              dispatch(userClearRecents(notesData));
              onClose()
            }}>
            <Text fontSize="12" color="#000000" >Clear</Text>
            </TouchableOpacity>
          </HStack>
          {
            userRecents.map((item: any, index: number) => {
              return (
                <Actionsheet.Item key={index} width={"100%"} paddingTop={5} onPress={()=>{
                  navigation.navigate('PdfViewer', {
                    userData: userData,
                    notesData: item,
                    selected: selected,
                    subject: subject
                  })
                  onClose() 
                }}>
                  <Box flexDirection={"row"}  width={"100%"} justifyContent={"space-between"}>
                    <Text textAlign={"left"}  width={"90%"} >{remove(item.fileName)}</Text>
                    <TouchableOpacity onPress={() => {
                      dispatch(userRemoveFromRecents(item));
                    }}>
                    <Icon as={Entypo} name="cross" size="md" color="gray.400" />
                    </TouchableOpacity>
                  </Box>

                </Actionsheet.Item>
              )
            })
          }
        </Actionsheet.Content>
      </Actionsheet>
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
    height: height,
    borderRadius: 40,
    marginBottom: height * 0.12,
  }
});
