import { NavigationProp, ParamListBase } from '@react-navigation/native'
import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { NavBtn } from '../../../components/CustomFormComponents/CustomBtn'

type Props = {}
interface IProps {
    navigation: NavigationProp<ParamListBase>
}


const Verification: FC<IProps> = ({ navigation }) => {
    return (
        <View>
            <Text>Check your mailbox to get verified! </Text>
            <Text>Bounce back to the back if verified.</Text>
            <NavBtn color='green' title='Verified' onPress={() => {}} />
            <NavBtn color='red' title='Back' onPress={() => { navigation.goBack() }} />
        </View>
    )
}

export default Verification

const styles = StyleSheet.create({})