import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Used via AppConstants.baseMargin
const appConstants = {
    companyId: 1000,
    width,
    height,
    OS: Platform.OS,
    version: Platform.Version,
};

export default appConstants;
