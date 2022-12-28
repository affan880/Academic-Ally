import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView, Button} from 'react-native'
import React, { useState } from 'react'
import ScreenLayout from '../../interfaces/screenLayout';
import { COLORS } from '../../constants/colors';
const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;
const HomeScreen = () => {
  const [index, setIndex] = useState(0);


  return (
    <ScreenLayout>
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Home</Text>
      </View>
      
    </ScreenLayout>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000'
  },
  titleContainer: {
    // height: height * 0.15,
    // width: width,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: COLORS.light,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 30,
  }
})