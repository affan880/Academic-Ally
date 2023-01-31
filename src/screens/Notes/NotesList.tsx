import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useMemo} from 'react'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import NavigationLayout from '../../interfaces/navigationLayout'
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';

type Props = {}
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
  PdfViewer: {
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

type pdfViewer = StackNavigationProp<MyStackParamList, 'PdfViewer' >

function remove(str:string) {
  if (str.includes("(oufastupdates.com)")|| str.includes(".pdf")) {
    return str.replace(/\(oufastupdates.com\)|\.pdf/g, "");
  } else {
    return str;
  }
}

const NotesList = (props: Props) => {
  const styles = useMemo(() => createStyles(), []);
  const navigation = useNavigation<pdfViewer>();
  
  const route = useRoute<RouteProp<RootStackParamList, 'NotesList'>>();
  const { userData } = route.params;
  const { notesData } = route.params;
  const { selected } = route.params;
  const { subject } = route.params;
   
  console.log(subject)
  return (
    <NavigationLayout>
      <View style={styles.notesListHeaderContainer} >
        <View style={{
          width: '75%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }} >
          <Text style={styles.notesListHeaderText} >Results for {selected} of "{subject}"</Text>
        </View>
        <View style={{
          width: '25%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
          <Text style={styles.notesListValueText} >Total {notesData[selected].length}</Text>
        </View>
      </View>
      {
        notesData[selected].map((item: any, index: number) => {
          return (
            <View style={styles.reccomendationContainer} key={index}  >
              <View style={styles.reccomendationStyle}>
                <TouchableOpacity style={styles.subjectContainer} onPress={() => {
                  navigation.navigate('PdfViewer', {
                    userData: userData,
                    notesData: item,
                    selected: selected,
                    subject: subject
                  })
                }} >
                  <View style={styles.containerBox}>
                    <View style={styles.containerText}>
                      <Ionicons name="eye-sharp" size={20} color="#fff" style={{
                        alignSelf: 'center',
                        transform: [{ rotate: '135deg' }],
                      }} />
                    </View>
                  </View>
                  <View style={{
                    width: '65%',
                    height: 80,
                    justifyContent: 'space-evenly',
                    alignItems: 'flex-start',
                    paddingLeft: 10,
                  }} >
                    <Text style={styles.subjectName}>
                      {
                        remove(item.fileName)
                      }
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      color: '#161719',
                      fontWeight: 'bold',
                    }}>
                      {
                        //make the first letter of the subject name capital
                        selected.charAt(0).toUpperCase() + selected.slice(1)
                      }
                    </Text>
                    <View style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingRight: 10,
                      maxWidth: "100%",
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        width: '15%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginRight: 10,
                      }} >
                      <Ionicons name="eye-sharp" size={13} color="#161719" />
                        <Text style={{
                          fontSize: 13,
                          color: '#161719',
                          fontWeight: '700',
                          paddingLeft: 5,
                      }} >{
                        item.reviews < 10 ? `${item.reviews + 10 }` : item.reviews
                      }</Text>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        width: '12%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5,
                      }} >
                        <AntDesign name="star" size={13} color="#FFC960" />
                        <Text style={{
                          fontSize: 13,
                          color: '#161719',
                          fontWeight: '700',
                          paddingLeft: 5,
                        }} >{
                          item.rating < 1 ? 5 : item.rating
                      }</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity >
                    <Fontisto name={'bookmark'} size={25} color={'#161719'}  />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          )
        })
      }
    </NavigationLayout>
  )
}

export default NotesList

const styles = StyleSheet.create({})