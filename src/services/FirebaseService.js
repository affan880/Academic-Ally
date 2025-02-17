import messaging from '@react-native-firebase/messaging';

class FirebaseService {
    constructor() { }

    static parseMessage(message) {
        console.log(message);
    }

    static requestUserPermission() {
        messaging()
            .requestPermission()
            .then(authStatus => {
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            });
    }
}
export default FirebaseService;
