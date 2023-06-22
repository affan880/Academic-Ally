import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useSelector } from 'react-redux';

const RestrictedScreen = ({ children, name }) => {
    const potrait = useSelector((state) => state.theme).isPotrait;

    useEffect(() => {
        if (name === "PdfViewer") {
            Orientation.lockToPortrait()
        }
        else {
            Orientation.lockToPortrait()
        }
    }, [])

    useEffect(() => {
        // if (!potrait) {
        const backAction = () => {
            if (!potrait) {
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
        // }
    }, [potrait]);


    return (
        <>
            {children}
        </>
    );
};

export default RestrictedScreen;