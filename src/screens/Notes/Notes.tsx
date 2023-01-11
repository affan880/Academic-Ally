import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute, RouteProp } from '@react-navigation/native'

type Props = {}
type RootStackParamList = {
  Notes: {
    userData: {
      Course: string,
      Branch: string,
      Sem: string,
    },
    notesData: string,
    selected:string
  };
};

const Notes = (props: Props) => {
  const route = useRoute<RouteProp<RootStackParamList, 'Notes'>>();

  const { userData } = route.params;
  const { notesData } = route.params;
  const { selected } = route.params;
  console.log(selected)
  return (
    <View>
      <Text>Notes</Text>
    </View>
  )
}

export default Notes

const styles = StyleSheet.create({})