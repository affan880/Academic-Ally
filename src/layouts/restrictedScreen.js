import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { BackHandler, Platform } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { useSelector } from 'react-redux';

const RestrictedScreen = ({ children }) => {
    const route = useRoute();

    useEffect(() => {
        const isPdfViewerScreen = route.name === 'PdfViewer';

        if (isPdfViewerScreen) {
            Orientation.unlockAllOrientations();
        } else {
            Orientation.lockToPortrait();
        }

        const backAction = () => {
            if (isPdfViewerScreen) {
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => {
            Orientation.lockToPortrait(); // Reset orientation on screen exit
            backHandler.remove();
        };
    }, [route]);

    return (
        <>
            {children}
        </>
    );
};

export default RestrictedScreen;
