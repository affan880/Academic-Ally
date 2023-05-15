import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

class NavigationService {
    static navigationRef = createNavigationContainerRef();
    static screens = {};

    static navigate(name, params) {
        if (this.navigationRef.isReady() &&
            this.navigationRef.getCurrentRoute().name !== name
        ) {
            this.navigationRef.navigate(name, params);
        }
    }

    static goBack() {
        if (this.navigationRef.isReady() && this.navigationRef.canGoBack()) {
            this.navigationRef.goBack();
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
        if (this.navigationRef.isReady() && this.navigationRef.getCurrentRoute().name !== name) {
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

