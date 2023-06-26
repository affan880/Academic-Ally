import { Easing, Notifier } from 'react-native-notifier';

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import CrashlyticsService from "../../services/CrashlyticsService";
import { setCustomClaims, setProtectedUtils, setRequiredVersion, setUtilis } from "./BootSlice";

class BootActions {
    static loadUserCustomClaims = (user, currentUser) => async (dispatch) => {
        try {
            const doc = await firestoreDB()
                .collection('ImmutableUserData')
                .doc(user?.uid)
                .get();

            if (doc.exists) {
                const data = doc.data();
                if (data) {
                    const claims = data.customClaims;
                    dispatch(setCustomClaims(claims));
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    }

    static loadProtectedUtils = (user, currentUser) => async (dispatch) => {
        try {
            await firestoreDB()
                .collection('UtilsProtected')
                .doc('meta-data')
                .get().then((doc) => {
                    const data = doc.data();
                    const protectedUtils = data.resourcesProtectedData;
                    dispatch(setProtectedUtils(protectedUtils));
                }).catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
            CrashlyticsService.recordError(error);
        }
    }

    static loadUtils = () => async (dispatch) => {
        try {
            await firestoreDB()
                .collection('utils')
                .doc('meta-data')
                .get().then((doc) => {
                    const data = doc.data();
                    const utils = data;
                    dispatch(setUtilis(utils));
                    dispatch(setRequiredVersion(data?.credentials?.requiredVersion));
                }).catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            CrashlyticsService.recordError(error);
            console.log(error);
        }
    }

    static handleNotification = (messageObj) => {
        try {
            Notifier.showNotification({
                title: messageObj?.notification?.title,
                description: messageObj?.notification?.body,
                swipeEnabled: true,
                duration: 10000,
                showAnimationDuration: 800,
                showEasing: Easing.linear,
                onHidden: () => { },
                onPress: () => { },
                hideOnPress: false,
            });
        }
        catch (error) {
            CrashlyticsService.recordError(error);
        }
    }
    static handleCustomNotification = (messageObj, customNotification, onPress, onSkip, ...other) => {
        try {
            Notifier.showNotification({
                title: messageObj?.notification?.title,
                description: messageObj?.notification?.body,
                swipeEnabled: true,
                duration: 10000,
                Component: () => {
                    return (
                        { customNotification }
                    )
                },
                showAnimationDuration: 800,
                showEasing: Easing.linear,
                onHidden: () => { },
                onPress: () => { },
                hideOnPress: false,
                ...other
            });
        }
        catch (error) {
            CrashlyticsService.recordError(error);
        }
    }
}
export default BootActions;
