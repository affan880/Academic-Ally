import React,{useEffect, useState} from "react";
import auth from '@react-native-firebase/auth';

// export function useAuthentication() {
//     const [user, setUser] = useState(User);

//     useEffect(() => {
//         const unsubscribeFromAuthStatuChanged = auth().onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 setUser(user);
//             } else {
//                 setUser(false);
//             }
//         });

//         return unsubscribeFromAuthStatuChanged;
//     }, []);

//     return {
//         user
//     };
// }
export function useAuthentication(){
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    if (initializing) return false;

    return {
        user
    }
}
