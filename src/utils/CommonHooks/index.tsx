import moment from 'moment';
import {Alert, BackHandler, Linking} from 'react-native';
import {Image, Video} from 'react-native-compressor';
import {setUserData} from '../../redux/reducers/authReducer';
import {setEmptyCard} from '../../redux/reducers/cartReducer';
import {StorageServices} from '../StorageService';
import DeviceInfo from "react-native-device-info";
import {OneSignal, LogLevel} from 'react-native-onesignal';

export const dollarSymbol = '£';
export const isIpad = DeviceInfo.getModel().includes("iPad");

export const generateUniqueIdGenerator = (max = 10000) => {
  const ids = Array.from({length: max + 1}, (_, i) => i);

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  return () => ids.pop(); // Return an arrow function to get next unique ID
};

export const NotificationServices = {
  getDeviceStatus: async () => {
    let deviceState =  await OneSignal.User.pushSubscription.getPushSubscriptionId();
    return deviceState;

  
  },
};

export const sessionCheck = async (
  appUpdateStatus?: any,
  session_expire?: any,
  error?:any,
  dispatch?: any,
  navigation?: any,
 
) => {
  console.log("Erroror",error)
  dispatch(setUserData(null));
  dispatch(setEmptyCard([]));
  StorageServices.removeAll();

  navigation.navigate('Login');
  if (appUpdateStatus == 1) {
    // const version = await checkVersion();
    // console.log("version", version);
    {
      Alert.alert(
        'Updates',
        'Please ensure the app is updated to access its latest features.',
        [
          {
            text: 'update',
            onPress: () => {
              // BackHandler.exitApp();
              // Linking.openURL(version?.url);
            },
          },
        ],
        {cancelable: false},
      );
    }
    return;
  }
  if (session_expire) {
    Alert.alert(
      'Session Expired',
      'Your session has expired. Please login again.',
      [
        {
          text: 'OK',
          onPress: async () => {
            dispatch(setUserData(null));
            dispatch(setEmptyCard([]));

            StorageServices.removeAll();

            navigation.navigate('Login');
          },
        },
      ],
    );
  }
  if(error.length>0){

    Alert.alert(
      'Alert',
      'Your account status is inactive',
      [
        {
          text: 'OK',
          onPress: async () => {
            dispatch(setUserData(null));
            dispatch(setEmptyCard([]));

            StorageServices.removeAll();

            navigation.navigate('Login');
          },
        },
      ],
    );


  }
};

export const capitalizeFirstWord = (text: any) => {
  if (text.length === 0) return text; // Edge case: Empty string
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatus = (status: any) => {
  switch (status) {
    case '0':
      return {status: 'Pending', status_color: '#FFC400'};
    case '1':
      return {status: 'Accepted', status_color: '#10451D'};
    case '2':
      return {status: 'Processing', status_color: '#2DC653'};
    case '3':
      return {status: 'Shipped', status_color: '#404040'};
    case '4':
      return {status: 'Delivered', status_color: '#2DC653'};
    case '5':
      return {status: 'Cancelled', status_color: '#FF0000'};
    default:
      return {status: 'Unknown', color: '#999999'};
  }
};

export const formatSQLDateTime = (date: any) => {
  return (
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')} ` +
    `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes(),
    ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.000000`
  );
};
export const formatToUTC = (dateTime: any) => {
  return moment(dateTime).format('YYYY-MM-DD HH:mm:ss.SSSSSS');
};

export const formatDate = (isoString: any) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })?.format(date);
  // .replace(" ", ", ",);
};

export const convertToUTC = (localTime: any) => {
  return moment(localTime, 'YYYY-MM-DD HH:mm:ss.SSSSSS')
    .utc()
    .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

export const compressImage = async (uri: any) => {
  let result;
  result = await Image.compress(
    uri,
    {
      compressionMethod: 'manual',
      quality: 0.3,
    },
    progress => {
      if (progress) {
        console.log('CompressStoryImage', progress);
      }
    },
  );

  return result;
};
