import { StyleSheet, Text, View, SafeAreaView,Dimensions, StatusBar, Image, ScrollView, Alert } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import React, { FC, useMemo, useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { SIGNUPILLUSTRATION } from '../../../assets'
import { CustomBtn, NavBtn } from '../../../components/CustomFormComponents/CustomBtn'
import { CustomTextInput } from '../../../components/CustomFormComponents/CustomTextInput'
import Form from '../../../components/Forms/form'
import DropdownComponent from '../../../components/CustomFormComponents/Dropdown'
import { validationSchema } from '../../../utilis/validation'
import createStyles from './styles'
import { createUser } from '../../../Modules/auth/firebase/firebase'

const screenWidth = Dimensions.get('screen').width

interface IProps {
    navigation: NavigationProp<ParamListBase>
}
const SignUpScreen: FC<IProps> = ({ navigation }) => {
    const styles = useMemo(() => createStyles(), []);

    const initialValues = {
        username:'',
        email: '',
        password: '',
        confirmPassword: '',
        Course: "",
        Sem: "",
        Branch: "",
        Year: "",
    }
    const CourseData: any = [
    { label: 'B.E', value: '1' },
    { label: 'B.TECH', value: '2' },
    ];
    const SemData: any = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
    ];

    const YearData: any = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
    ]

    const BranchData: any = [
        { label: 'IT', value: '1' },
        { label: 'CSE', value: '2' },
        { label: 'ECE', value: '3' },
        { label: 'MECH', value: '4' },
        { label: 'CIVIL', value: '5' },
        { label: 'EEE', value: '6' },
    ];

    const onSubmit = (email: string, password: string, initialValues: any) => {
        createUser(email, password, initialValues)
    }

    return (
           
        <SafeAreaView style={[styles.container, {flex:1}]} >
            <StatusBar
                animated={true}
                translucent={true}
                backgroundColor={'transparent'}
            />
           
            <LinearGradient colors={['#03202B', '#A094E3']}
                start={{ x: 0.5, y: 0.5 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.LinearGradient}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEnabled={true}
                >
                <Image source={SIGNUPILLUSTRATION} style={styles.rocketIcon} />
                <Text style={styles.welcomeText}> Hi there!</Text>
                <Text style={styles.loginText}>Let's Get Started</Text>
                <View style={styles.inputContainer}>
                        <Form validationSchema={validationSchema} initialValues={initialValues} onSubmit={(values) => { onSubmit(values.email, values.password, values) }} >
                        <CustomTextInput leftIcon="user" placeholder="Full Name" name='username' />
                        <CustomTextInput leftIcon="mail" placeholder="Email" name='email' />
                        <CustomTextInput leftIcon="lock" placeholder="Password" name="password" />
                            <CustomTextInput leftIcon="lock" placeholder="Confirm Password" handlePasswordVisibility name="confirmPassword" />
                            <View style={{ flexDirection: 'row', width: screenWidth - 80, flex:1, justifyContent:"space-between" }}>
                                <DropdownComponent name='Course' data={CourseData} placeholder={"Course"} leftIcon="Safety" width={screenWidth/2.5} />
                                <DropdownComponent name='Branch' data={BranchData} placeholder={"Branch"} leftIcon="bars" width={screenWidth/2.5} />
                            </View>
                            <View style={{ flexDirection: 'row', width: screenWidth - 80, flex: 1, justifyContent: "space-between" }}>
                                <DropdownComponent name='Year' data={SemData} placeholder={"Studying year"} leftIcon="bars" width={screenWidth/2.5} />
                                <DropdownComponent name='Sem' data={SemData} placeholder={"Semester"} leftIcon="ellipsis1" width={screenWidth/2.5} />
                            </View>
                        <View style={styles.SignupButton}>
                            <CustomBtn title="Sign Up" color="#19647E" />
                        </View>
                        <Text style={styles.orText} >Or</Text>
                        <View style={styles.LoginButton}>
                            <NavBtn title="Log In" onPress={() => { navigation.navigate('LoginScreen') }} color="#A094E3" />
                        </View>
                    </Form>
                </View>
            </ScrollView>
                </LinearGradient>
        </SafeAreaView>
    )
}

export default SignUpScreen;