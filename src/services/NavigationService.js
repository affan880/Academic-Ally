import { createNavigationContainerRef, StackActions, useNavigation } from '@react-navigation/native';

class NavigationService {
    static navigationRef = createNavigationContainerRef();
    static screens = {
        Intro: 'Intro',
        Login: 'Login',
        SignUp: 'SignUp',
        ForgotPassword: 'ForgotPassword',
        ConnectionError: 'ConnectionError',
        BottomTabNavigator: 'BottomTabNavigator',
        DrawerNavigator: 'DrawerNavigator',
        Home: 'Home',
        Search: 'Search',
        Upload: 'Upload',
        UploadScreen: 'UploadScreen',
        Bookmark: 'Bookmark',
        Profile: 'Profile',
        SubjectResourcesScreen: 'SubjectResourcesScreen',
        Resources: 'Resources',
        PdfViewer: 'PdfViewer',
        UpdateProfile: 'UpdateProfile',
        AboutUs: 'AboutUs',
        PrivacyPolicy: 'PrivacyPolicy',
        TermsAndConditions: 'TermsAndConditions',
        UserRequestsPdfViewer: 'UserRequestsPdfViewer',
        Download: 'Download',
        AllyBot: 'AllyBot',
        SeekHub: 'SeekHub'
    };

    static navigate(name, params) {
        this.navigationRef.navigate(name, params);
    }

    static goBack(onNavigateBack) {
        if (this.navigationRef.isReady() && this.navigationRef.canGoBack()) {
            this.navigationRef.goBack();
            if (typeof onNavigateBack === 'function') {
                onNavigateBack(); // Execute the callback function when navigating back
            }
        }
    }

    static push(name, params) {
        if (this.navigationRef.isReady() && this.navigationRef.getCurrentRoute().name !== name) {
            this.navigationRef.dispatch(StackActions.push(name, params));
        }
    }

    static pop(count) {
        if (this.navigationRef.isReady() && this.navigationRef.canGoBack()) {
            this.navigationRef.dispatch(StackActions.pop(count));
        }
    }

    static popToTop() {
        if (this.navigationRef.isReady() && this.navigationRef.canGoBack()) {
            this.navigationRef.dispatch(StackActions.popToTop());
        }
    }

    static replace(name, params) {
        if (this.navigationRef.isReady()) {
            this.navigationRef.dispatch(StackActions.replace(name, params));
        }
    }

    static navigateToConnectionError() {
        this.push('ConnectionError');
    }

    static navigateToLogin() {
        this.popToTop();
        this.push(NavigationService.screens.Login);
    }
}

export default NavigationService;

