import { Toast } from "native-base";

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import { getCurrentUser } from "../../Modules/auth/firebase/firebase";
import CrashlyticsService from "../../services/CrashlyticsService";
import NavigationService from "../../services/NavigationService";
import { useAuthentication } from "../../utilis/hooks/useAuthentication";
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
            const doc = await firestoreDB()
                .collection('UtilsProtected')
                .doc('meta-data')
                .get().then((doc) => {
                    const data = doc.data();
                    const protectedUtils = data.resourcesProtectedData;
                    dispatch(setProtectedUtils(protectedUtils));
                }).catch((error) => {
                    console.log(error);
                    CrashlyticsService.recordError(error);
                });
        } catch (error) {
            console.log(error);

        }
    }

    static loadUtils = () => async (dispatch) => {
        try {
            const doc = await firestoreDB()
                .collection('utils')
                .doc('meta-data')
                .get().then((doc) => {
                    const data = doc.data();
                    const utils = data;
                    dispatch(setUtilis(utils));
                    dispatch(setRequiredVersion(data?.credentials?.requiredVersion));
                }).catch((error) => {
                    console.log(error);
                    CrashlyticsService.recordError(error);
                });
        } catch (error) {
            console.log(error);
        }
    }
}
export default BootActions;
