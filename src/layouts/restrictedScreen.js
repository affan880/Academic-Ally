import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useSelector } from 'react-redux';

const RestrictedScreen = ({ children }) => {
    const potrait = useSelector((state) => state.theme).isPotrait;
    const route = useRoute();
    const currentScreenName = route.name;
    
    useEffect(() => {
        if (currentScreenName === "PdfViewer") {
            Orientation.unlockAllOrientations()
        }
        else {
            Orientation.lockToPortrait()
        }
    }, [])

    // useEffect(() => {
    //     if (currentScreenName === "PdfViewer") {
    //     const backAction = () => {
    //         if (!potrait) {
    //             return true;
    //         }
    //         return false;
    //     };

    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    //     return () => backHandler.remove();
    //     }
    // }, [potrait]);


    return (
        <>
            {children}
        </>
    );
};

export default RestrictedScreen;