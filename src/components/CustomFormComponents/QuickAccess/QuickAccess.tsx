import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useMemo} from 'react';
import {Syllabus, Notes, Qp, OtherRes} from '../../../assets/images/icons';
import createStyles from './styles';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

type Props = {
  selected: string;
  setSelectedCategory: (selected: string) => void;
};

const QuickAccess = ({selected, setSelectedCategory}:Props) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.categories}>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {
        setSelectedCategory('syllabus');
      }}>
        <View style={
          selected === 'syllabus' ? [styles.syllabusIconContainer, {
          transform: [{scale: 1.2}],
          borderColor: '#6360FF',
          borderWidth: 2,
          padding: 5,
        }]: styles.syllabusIconContainer
        }>
          <Syllabus />
        </View>
        <Text style={styles.iconLabel}>Syllabus</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={()=>{
         setSelectedCategory('notes');
      }} >
        <View style={
          selected === 'notes' ? [styles.notesIconContainer, {
          transform: [{scale: 1.2}],
          borderColor: '#6360FF',
          borderWidth: 2,
          padding: 5,
        }]: styles.notesIconContainer
        }>
          <Notes />
        </View>
        <Text style={styles.iconLabel}>Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={()=>{
         setSelectedCategory('questionPapers');
      }} >
        <View style={
          selected === 'questionPapers' ? [styles.questionsIconContainer, {
          transform: [{scale: 1.2}],
          borderColor: '#6360FF',
          borderWidth: 2,
          padding: 5,
        }]: styles.questionsIconContainer
        }>
          <Qp />
        </View>
        <Text style={styles.iconLabel}>QP's</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {
         setSelectedCategory('otherResources');
      }}>
        <View style={
          selected === 'otherResources' ? [styles.otherResourcesIconContainer, {
          transform: [{scale: 1.2}],
          borderColor: '#6360FF',
          borderWidth: 2,
          padding: 5,
        }]: styles.otherResourcesIconContainer
        }>
          <OtherRes />
        </View>
        <Text style={styles.iconLabel}>Others</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickAccess;
