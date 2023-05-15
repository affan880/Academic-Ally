import crashlytics from '@react-native-firebase/crashlytics';

class CrashlyticsService {
    constructor() { }

    static async setUserId(userId) {
        try {
            await crashlytics().setUserId(userId);
        } catch (e) {
            console.log(e);
        }
    }

    static async setAttribute(key, value) {
        try {
            await crashlytics().setAttribute(key, value);
        } catch (e) {
            console.log(e);
        }
    }

    static async setAttributesJson(attributes) {
        try {
            await crashlytics().setAttributes(attributes);
        } catch (e) {
            console.log(e);
        }
    }

    static log(data) {
        try {
            crashlytics().log(data);
        } catch (e) {
            console.log(e);
        }
    }

    static recordError(error) {
        try {
            crashlytics().recordError(
                new Error('NO_CRASH_ERROR:' + JSON.stringify(error)),
            );
        } catch (e) {
            console.log(e);
        }
    }

    static forceCrash() {
        crashlytics().crash();
    }
}
export default CrashlyticsService;
