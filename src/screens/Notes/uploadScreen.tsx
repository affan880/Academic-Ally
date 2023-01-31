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
        selected: string
    };
};

const UploadScreen = (props: Props) => {
    const route = useRoute<RouteProp<RootStackParamList, 'Notes'>>();

    const { userData } = route.params;
    const { notesData } = route.params;
    const { selected } = route.params;
    console.log(selected)
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text>upload</Text>
        </View>
    )
}

export default UploadScreen

const styles = StyleSheet.create({})