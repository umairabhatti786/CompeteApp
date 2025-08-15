import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import {theme} from '../../../utils/Themes';
import ScreenLayout from '../../../components/ScreenLayout';
import CustomButton from '../../../components/Button';
import CustomText from '../../../components/Text';
import {fonts} from '../../../utils/Themes/fonts';
import CustomInput from '../../../components/Input';
import {appStyles} from '../../../utils/GlobalStyles';
import icons from '../../../utils/Constants/icons';
import CustomToast from '../../../components/CustomToast';
import ScreenLoader from '../../../components/ScreenLoader';
import {emailRegex, passwordRegex} from '../../../utils/Regex';
import {ApiServices} from '../../../api/ApiServices';
import { NotificationServices, isIpad } from '../../../utils/CommonHooks';

const LoginScreen = ({navigation}: any) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>('');
  const [messageColor, setMessageColor] = useState(theme.colors.red);
  const [loading, setloading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [showPassword,setShowPassword]=useState(true)

  const [errors, setErrors] = useState({
    phone_error: '',
    email_error: '',
    password_error: '',
  });

  const [values, setValues] = useState({
    phoneNumber: '',
    email: '',
    password: '',
  });

  const onLogin = async() => {
    const deviceState = await NotificationServices.getDeviceStatus();
    console.log("deviceState",deviceState)

    Keyboard.dismiss();
    if (!values?.email) {
      setMessage('Email is required');
      setIsMessage(true);
      return false;
    }
    if (values?.email) {
      if (!emailRegex.test(values?.email)) {
        setMessage('Invalid Email Address');
        setIsMessage(true);
        setMessageColor(theme.colors.red);

        return;
      }
    }
    if (!values?.password) {
      setMessage('Password is required');
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }
    // if (!passwordRegex.test(values?.password)) {
    //   setMessage(
    //     'Your password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character',
    //   );
    //   setIsMessage(true);
    //   setMessageColor(theme.colors.red);

    //   return;
    // }
    // navigation.navigate('BottomTab');
    setloading(true);
    setIsDisable(true);
    const formData = new FormData();
    formData.append('email', values.email?.trim());
    formData.append('password', values.password?.trim());
    formData.append('device_id', deviceState);

    ApiServices.authenticate(formData, async ({isSuccess, response}: any) => {
      console.log('responsse', response);
      if (isSuccess) {
        let result = JSON.parse(response);
        if (result?.success) {
          setIsMessage(true);
          setloading(false);
          setMessage(result?.message);
          setMessageColor(theme.colors.primary)
          setTimeout(() => {
            setIsMessage(false);
            navigation.navigate('TwoFAScreen', {
              data: result?.data,
              email: values.email,
            });
            setIsDisable(false);
          }, 500);
        } else if (result?.message?.phone) {
          setMessage('User not exist');
          setIsMessage(true);
          setloading(false);
          setIsDisable(false);
          setMessageColor(theme.colors.red)

        } else {
          setMessage(result?.message);
          setIsMessage(true);
          setloading(false);
          setIsDisable(false);
          setMessageColor(theme.colors.red)

        }
      } else {
        setMessageColor(theme.colors.red)

        setMessage(response?.message);
        setIsMessage(true);
        setloading(false);
        setIsDisable(false);
      }
    });
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingHorizontal: sizeHelper.calWp(isIpad? 30:40),
          paddingTop: sizeHelper.calHp(20),
          gap: sizeHelper.calWp(30),
        }}>
        <TouchableWithoutFeedback
          style={{flex: 1, gap: sizeHelper.calWp(30)}}
          onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, gap: sizeHelper.calHp(30)}}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 10} // Adjust if header present
          >
            <View>
              <CustomText
                text={'Welcome'}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.primary}
                size={50}
              />
              <CustomText
                text={'Please Login'}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                // style={{lineHeight: sizeHelper.calHp(60)}} // ✅ Add lineHeight close to font size
                color={theme.colors.primary}
                size={50}
              />
            </View>

            <CustomText
              text={'Pleae login to your account and enjoy your experience'}
              color={theme.colors.secondry}
              size={25}
            />
            <View style={{flex: 1}}>
              <View style={{gap: sizeHelper.calWp(15)}}>
                <CustomInput
                  label={'Email'}
                  value={values.email}
                
                  focusedInput={focusedInput}
                  onChangeText={(txt: string) =>
                    setValues({...values, email: txt})
                  }
                  keyboard={"email-address"}
                  autoCapitalize={"none"}
                  leftSource={icons.email}
                  setFocusedInput={setFocusedInput}
                  placeholder="John@email.com"
                  inputKey="email"
                />
                <CustomInput
                  label={'Password'}
                  value={values.password}

                  rightSource={ showPassword? icons.hidden:icons.eye}
                  placeholder="Password"
                  secureTextEntry={showPassword}
                  rightIconPress={()=>setShowPassword(!showPassword)}
                  onChangeText={(txt: string) =>
                    setValues({...values, password: txt})
                  }
                  focusedInput={focusedInput}
                  setFocusedInput={setFocusedInput}
                  leftSource={icons.lock}
                  inputKey="password"
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate('EnterEmailScreen')}
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    paddingVertical: sizeHelper.calHp(4),
                  }}>
                  <CustomText
                    text={'Forgot Password?'}
                    color={theme.colors.primary}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.botttom}>
              <CustomButton text="Login" onPress={onLogin} width={'100%'} />
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                style={{
                  ...appStyles.row,
                  gap: sizeHelper.calWp(7),
                  alignSelf: 'center',
                }}>
                <CustomText
                  text={'Don’t have account?'}
                  color={theme.colors.secondry}
                  size={20}
                />
                <CustomText
                  text={'Sign Up'}
                  fontFam={fonts.Poppins_Medium}
                  fontWeight="600"
                  color={theme.colors.primary}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        backgroundColor={messageColor}
        setIsVisable={setIsMessage}
        message={message}
      />
      {loading && <ScreenLoader />}
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: '10%',
  },
});
