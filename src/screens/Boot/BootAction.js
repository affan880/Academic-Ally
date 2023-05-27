import { Toast } from "native-base";

import { firestoreDB } from "../../Modules/auth/firebase/firebase";
import { getCurrentUser } from "../../Modules/auth/firebase/firebase";
import CrashlyticsService from "../../services/CrashlyticsService";
import NavigationService from "../../services/NavigationService";
import { useAuthentication } from "../../utilis/hooks/useAuthentication";
import { setCustomClaims } from "./BootSlice";

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
}

export default BootActions;
