import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import createStyles from './styles';
import { useSelector } from 'react-redux';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Entypo from "react-native-vector-icons/Entypo"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';

type MyStackParamList = {
    SubjectResources: { userData: object, notesData: string, subject: string };
}
type MyScreenNavigationProp = StackNavigationProp<MyStackParamList, 'SubjectResources'>
type Props = {}

const Recommendation = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const userData = useSelector((state: any) => {
        return state.usersData;
    })
    const styles = useMemo(() => createStyles(), []);
    const [subjectList, setSubjectList] = useState([]);
    const [initial, setInital] = useState("");
    const navigation = useNavigation<MyScreenNavigationProp>();
    const [list, setList] = useState<any[]>([]);

    async function fetchData() {
        try {
            firestore().collection('Users').doc(auth().currentUser?.uid).get().then(async (userFirestoreData: any) => {
                setList([]);
                await firestore().collection('Universities').doc('OU').collection(`${userFirestoreData.data().Course}`).doc(`${userFirestoreData.data().Branch}`).collection(`${userFirestoreData.data().Sem}`).doc('SubjectsList').get().then(async (data) => {
                    for (const items of data.data()?.list) {
                        await firestore().collection('Universities').doc('OU').collection(`${userFirestoreData.data().Course}`).doc(`${userFirestoreData.data().Branch}`).collection(`${userFirestoreData.data().Sem}`).doc('Subjects').collection(items.subjectName).get().then((item) => {
                            setList((prev) => [...prev, {
                                subjectName: items.subjectName,
                                notes: item.docs[0]?.data().resources,
                                otherResources: item.docs[1]?.data().resources,
                                questionPapers: item.docs[2]?.data().resources,
                                syllabus: item.docs[3]?.data().resources,
                            }]);
                        })

                    }
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setList([]);
        // console.log("list");
        fetchData();
    }, [userData]);


    return (
        <View style={styles.body}>
            {
                list.length > 1 ? list.map((item: any, index) => {
                    return (
                        <View style={styles.reccomendationContainer} key={index} >
                            <View style={styles.reccomendationStyle}>
                                <TouchableOpacity style={styles.subjectContainer} onPress={() => {
                                    navigation.navigate('SubjectResources', {
                                        userData: userData.usersData,
                                        notesData: item,
                                        subject: item.subjectName,
                                    })
                                }} >
                                    <View style={{
                                        width: '75%',
                                        height: '100%',
                                        justifyContent: 'space-evenly',
                                        alignItems: 'flex-start',
                                        paddingLeft: 10,
                                        paddingVertical: 15,

                                    }} >
                                        <Text style={styles.subjectName}>
                                            {item.subjectName}
                                        </Text>
                                        <View style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingRight: 10,
                                        }}>
                                            <View style={styles.subjectCategory}>
                                                <Text style={styles.subjectCategoryText}>Notes</Text>
                                                <Entypo name={item.notes?.length > 0 ? 'check' : 'cross'} size={20} color={item.notes?.length > 0 ? styles.subjectCategoryCheckIcon.color : styles.subjectCategoryUnCheckIcon.color} />
                                            </View>

                                            <View style={styles.subjectCategory}>
                                                <Text style={styles.subjectCategoryText}>Syllabus</Text>
                                                <Entypo name={item.syllabus?.length > 0 ? 'check' : 'cross'} size={20} color={item.syllabus?.length > 0 ? styles.subjectCategoryCheckIcon.color : styles.subjectCategoryUnCheckIcon.color} />
                                            </View>
                                            <View style={styles.subjectCategory}>
                                                <Text style={styles.subjectCategoryText}>Question  Papers</Text>
                                                <Entypo name={item.questionPapers?.length > 0 ? 'check' : 'cross'} size={20} color={item.questionPapers?.length > 0 ? styles.subjectCategoryCheckIcon.color : styles.subjectCategoryUnCheckIcon.color} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={styles.containerText}>
                                            {item.subjectName[0]}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
                    : <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 450,
                    }}>
                        <LottieView source={require('../../../assets/lottie/loading.json')} autoPlay loop />
                    </View>
            }
        </View>
    )
}

export default Recommendation