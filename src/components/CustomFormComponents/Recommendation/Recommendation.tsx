import { View, Text, TouchableOpacity } from 'react-native'
import React,{useEffect, useMemo, useState} from 'react'
import createStyles from './styles';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type MyStackParamList = {
    NotesList: { userData: object, notesData: string };
}
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'NotesList'>
type Props = {}

const Recommendation = (props: Props) => {
    const categories = ["Syllabus","QuestionPapers","OtherRes"]
    const userFirestoreData = useSelector((state: any) => {
        return state.usersData;
    })
    const styles = useMemo(() => createStyles(), []);
    const [subjectList, setSubjectList] = useState([]);
    const [initial, setInital] = useState("");
    const navigation = useNavigation<MyScreenNavigationProp>();
    useEffect(() => {
        firestore().collection('Subjects').doc('OU').collection(`${userFirestoreData.usersData.Course}`).doc(`${userFirestoreData.usersData.Branch}`).get().then((data) => {
            setSubjectList(data.data()?.subject.sem[`${parseInt(userFirestoreData.usersData.Sem) - 1}`].subjectsList);
        })
        firestore().collection('Resources').doc('OU').collection(`${userFirestoreData.usersData.Course}`).doc(`${userFirestoreData.usersData.Branch}`).collection(`${userFirestoreData.usersData.Sem}`).doc('Syllabus').get().then((data) => {
            console.log(data.data()?.syllabus.length);
        })
    },[])

  return (
      <View style={styles.body}>
          {
            subjectList &&  subjectList.map((item:any, index) => {
                  //get initial of words in the text
                //   let initial = item.split(" ").map((item :any) => {
                //       return item[0]
                //   }).join("")
                  return (
                      <View style={styles.reccomendationContainer} key={index} >
                          <View style={styles.reccomendationStyle}>
                              <TouchableOpacity style={styles.subjectContainer} onPress={() => {
                                  navigation.navigate('NotesList', {
                                      userData: userFirestoreData.usersData,
                                        notesData: item
                                  })
                              }} > 
                                  <View style={{
                                      width:'70%'
                                  }} >
                                      <Text style={styles.subjectName}>
                                            {item}
                                      </Text>
                                      <View style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                      }}>
                                      <Text style={{
                                          color: '#000000',
                                          fontSize: 12,
                                          fontWeight: 'bold',
                                          marginTop: 5,
                                          textAlign:"auto"
                                        }}>
                                          Notes <Ionicons name="md-checkmark-done-circle-outline" size={20} color={'#6360FF'} />
                                      </Text>
                                      <Text style={{
                                          color: '#000000',
                                          fontSize: 12,
                                          fontWeight: 'bold',
                                          marginTop: 5,
                                          textAlign:"auto"
                                        }}>
                                          Syllabus <Ionicons name="md-checkmark-done-circle-outline" size={20} color={'#6360FF'} />
                                      </Text>
                                      <Text style={{
                                          color: '#000000',
                                          fontSize: 12,
                                          fontWeight: 'bold',
                                          marginTop: 5,
                                          textAlign:"auto"
                                        }}>
                                          Question Papers <Ionicons name="md-checkmark-done-circle-outline" size={20} color={'#6360FF'} />
                                      </Text>
                                          </View>
                                  </View>
                                  <View style={styles.container}>
                                      <Text style={styles.containerText}>
                                          {item[0]}
                                      </Text>
                                  </View>
                              </TouchableOpacity>
                          </View>
                      </View>
                  )
              })
          }
      </View>
  )
}

export default Recommendation