import React, {useEffect, useState} from 'react';
import { StatusBar } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../../screens/Auth/Onboarding';
import {AppStackParamList} from '../../utils/Types';
import LoginAndSignupScreen from '../../screens/Auth/LoginAndSignup';
import LoginScreen from '../../screens/Auth/Login';
import SignupScreen from '../../screens/Auth/Signup';
import BottomTab from '../BottomTab';
import AllProducts from '../../screens/Main/AllProducts';
import SuccessScreen from '../../screens/Main/Success';
import EnterEmailScreen from '../../screens/Auth/EnterEmail';
import TwoFAScreen from '../../screens/Auth/2FA';
import ForgotPassword from '../../screens/Auth/ForgotPassword';
import AboutUsScreen from '../../screens/Main/AboutUs';
import TermAndCondition from '../../screens/Main/TermAndCondition';
import EditProfileScreen from '../../screens/Main/EditProfile';
import NotificationScreen from '../../screens/Main/Notification';
import SearchScreen from '../../screens/Main/Search';
import Splash from '../../screens/Auth/Splash';
import OrderHistoryScreen from '../../screens/Main/OrderHoistory';
import OrderHistoryDetail from '../../screens/Main/OrderHistoryDetail';
import BlogDetail from '../../screens/Main/BlogDetail';
import {OneSignal, LogLevel} from 'react-native-onesignal';

const Stack = createNativeStackNavigator<AppStackParamList>();
const AppStack = () => {


  useEffect(() => {
    // ✅ Initialize with your OneSignal App ID
    OneSignal.initialize('16fae45c-5ef8-4c57-bff2-29f3ec8c7c71');
  
    // ✅ Request iOS permission to show notifications
    OneSignal.Notifications.requestPermission(true);
    OneSignal.User.pushSubscription.addEventListener('change', (event) => {
      console.log("Push Subscription State:", event);
      // event.to.id = Player ID
      // event.to.token = APNs token (must not be null)
      // event.to.optedIn = true if user allowed
    });
  
    // ✅ Foreground notification handler
    const foregroundHandler:any = OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log('[OneSignal] Foreground Notification:', event);
      event.preventDefault(); // Optional: prevent default banner
      event.notification.display(); // Manually show it
    });
  
    // ✅ Background or tapped notification handler
    const clickHandler:any = OneSignal.Notifications.addEventListener('click', async (event) => {
      console.log('[OneSignal] Notification Clicked:', event);
  
   
    });
  
    // ✅ Cleanup on unmount
    return () => {
      foregroundHandler.remove();
      clickHandler.remove();
    };
  }, []);



  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
        
      <Stack.Screen name={'Splash'} component={Splash} />
      <Stack.Screen name={'Onboarding'} component={OnboardingScreen} />
      <Stack.Screen name={'LoginAndSignup'} component={LoginAndSignupScreen} />
      <Stack.Screen name={'Login'} component={LoginScreen} />
      <Stack.Screen name={'EnterEmailScreen'} component={EnterEmailScreen} />
      <Stack.Screen name={'TwoFAScreen'} component={TwoFAScreen} />
      <Stack.Screen name={'ForgotPassword'} component={ForgotPassword} />
      <Stack.Screen name={'AboutUsScreen'} component={AboutUsScreen} />
      <Stack.Screen name={'TermAndCondition'} component={TermAndCondition} />
      <Stack.Screen name={'EditProfileScreen'} component={EditProfileScreen} />
      <Stack.Screen name={'BlogDetail'} component={BlogDetail} />
      <Stack.Screen
        name={'OrderHistoryDetail'}
        component={OrderHistoryDetail}
      />

      <Stack.Screen
        name={'NotificationScreen'}
        component={NotificationScreen}
      />
      <Stack.Screen name={'SearchScreen'} component={SearchScreen} />
      <Stack.Screen
        name={'OrderHistoryScreen'}
        component={OrderHistoryScreen}
      />
      <Stack.Screen name={'Signup'} component={SignupScreen} />
      <Stack.Screen name={'BottomTab'} component={BottomTab} />
      <Stack.Screen name={'AllProducts'} component={AllProducts} />
      <Stack.Screen name={'SuccessScreen'} component={SuccessScreen} />
    </Stack.Navigator>
  );
};
export default AppStack;
