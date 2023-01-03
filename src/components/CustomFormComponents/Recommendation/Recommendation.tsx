import { View, Text, TouchableOpacity } from 'react-native'
import React,{useEffect, useMemo, useState} from 'react'
import createStyles from './styles';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';


type Props = {}

const Recommendation = (props: Props) => {
    const userFirestoreData = useSelector((state: any) => {
        return state.usersData;
    })
    const styles = useMemo(() => createStyles(), []);
    const [subjectList, setSubjectList] = useState([]);
    const [initial, setInital] = useState("");
    useEffect(() => {
        firestore().collection('Subjects').doc('OU').collection(`${userFirestoreData.usersData.Course}`).doc(`${userFirestoreData.usersData.Branch}`).get().then((data) => {
            setSubjectList(data.data()?.subject.sem[`${parseInt(userFirestoreData.usersData.Sem) - 1}`].subjectsList);
        })
    })

  return (
      <View style={styles.body}>
          {
            subjectList &&  subjectList.map((item:any, index) => {
                  //get initial of words in the text
                  let initial = item.split(" ").map((item :any) => {
                      return item[0]
                  }).join("")
                  return (
                      <View style={styles.reccomendationContainer} key={index} >
                          <View style={styles.reccomendationStyle}>
                              <TouchableOpacity style={styles.subjectContainer}>
                                  <View style={{
                                      width:'70%'
                                  }} >
                                      <Text style={styles.subjectName}>
                                            {item}
                                      </Text>
                                  </View>
                                  <View style={styles.container}>
                                      <Text style={styles.containerText}>
                                          {initial}
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