import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useMemo } from 'react'
import createStyles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'

const navigationLayout = ({ children }) => {
    const navigation = useNavigation();
    const styles = useMemo(() => createStyles(), []);
  return (
      <View style={styles.container}>
          <View style={styles.headerContainer}>
              <Ionicons name='chevron-back-outline' size={20} color="#ffffff" onPress={() => {
                  navigation.goBack()
              }} />
              <MaterialCommunityIcons name="backup-restore" size={30} color="#ffffff" />
          </View>
          <View style={styles.body}>
              <View style={styles.bodyContent}>
                  <ScrollView showsVerticalScrollIndicator={false} >
                  {children}
                  </ScrollView>
              </View>
          </View>
      </View>
  )
}

export default navigationLayout

const styles = StyleSheet.create({})