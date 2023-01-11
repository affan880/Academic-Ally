import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useMemo } from 'react'
import { Syllabus, Notes,Qp, OtherRes } from '../../../assets/images/icons'
import createStyles from './styles'

const QuickAccess = () => {
    const styles = useMemo(() => createStyles(), []);
  return (
      <View style={styles.categories}>
          <TouchableOpacity style={styles.itemContainer}>
              <View style={styles.syllabusIconContainer}>
                <Syllabus/>
              </View>
              <Text style={styles.iconLabel}>Syllabus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemContainer}>
              <View style={styles.notesIconContainer}>
                  <Notes/>
              </View>
              <Text style={styles.iconLabel}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemContainer}>
              <View style={styles.questionsIconContainer}>
                 <Qp/>
              </View>
              <Text style={styles.iconLabel}>QP's</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.itemContainer}>
              <View style={styles.otherResourcesIconContainer}>
                 <OtherRes/>
              </View>
              <Text style={styles.iconLabel}>Others</Text>
          </TouchableOpacity>
      </View>
  )
}

export default QuickAccess