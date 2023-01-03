import React from 'react'
import AuthStack from './AuthStack/authStack';
import StackNavigation from './AppStack/appStack';
import { useAuthentication } from '../utilis/hooks/useAuthentication';
import {getCurrentUser} from '../Modules/auth/firebase/firebase';
const Providers = () => {
  const { user } = useAuthentication();
  const currentUser = getCurrentUser();
  
  // return user && user.emailVerified || currentUser !== null && currentUser.emailVerified  ? <AppStack/> : <AuthStack/>
  return user || currentUser !== null ? <StackNavigation /> : <AuthStack/>
}

export default Providers

