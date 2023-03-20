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
import {useSelector} from 'react-redux';
// import {listBase, list, QueryList, SubjectList} from '../../../Modules/auth/firebase/firebase';
// import { notes } from '../../../utilis/data';

type Props = {
  selected: string;
  setSelectedCategory: (selected: string) => void;
};

const QuickAccess = ({selected, setSelectedCategory}:Props) => {
  const theme = useSelector((state: any) => {
    return state.theme;
  });
  const styles = useMemo(() => createStyles(theme.colors, theme.sizes), []);

  return (
    <View style={styles.categories}>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {
        // QueryList(notes);
        // listBase( notes )
        // SubjectList(notes);
        setSelectedCategory('Syllabus');
      }}>
        <View style={
          selected === 'Syllabus' ? [styles.syllabusIconContainer, styles.selectedIconContainer]: styles.syllabusIconContainer
        }>
          <Syllabus />
        </View>
        <Text style={styles.iconLabel}>Syllabus</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={()=>{
         setSelectedCategory('Notes');
      }} >
        <View style={
          selected === 'Notes' ? [styles.notesIconContainer, styles.selectedIconContainer]: styles.notesIconContainer
        }>
          <Notes />
        </View>
        <Text style={styles.iconLabel}>Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={()=>{
         setSelectedCategory('QuestionPapers');
      }} >
        <View style={
          selected === 'QuestionPapers' ? [styles.questionsIconContainer,  styles.selectedIconContainer]: styles.questionsIconContainer
        }>
          <Qp />
        </View>
        <Text style={styles.iconLabel}>QP's</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.itemContainer} onPress={() => {
         setSelectedCategory('OtherResources');
      }}>
        <View style={
          selected === 'OtherResources' ? [styles.otherResourcesIconContainer,  styles.selectedIconContainer]: styles.otherResourcesIconContainer
        }>
          <OtherRes />
        </View>
        <Text style={styles.iconLabel}>Others</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuickAccess;
