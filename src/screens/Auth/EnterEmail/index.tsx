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
import icons from '../../../utils/Constants/icons';
import CustomHeader from '../../../components/Header/inde';
import {emailRegex} from '../../../utils/Regex';
import CustomToast from '../../../components/CustomToast';
import ScreenLoader from '../../../components/ScreenLoader';
import { ApiServices } from '../../../api/ApiServices';
import { isIpad } from '../../../utils/CommonHooks';

const EnterEmailScreen = ({navigation}: any) => {
  const [focusedInput, setFocusedInput] = useState(null);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');



  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>('');
  const [messageColor, setMessageColor] = useState(theme.colors.red);
  const [loading, setLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

  const onVerify = () => {
    Keyboard.dismiss()
    if (!email) {
      setMessage('Email is required');
      setIsMessage(true);
      return false;
    }

    if (email) {
      if (!emailRegex.test(email)) {
        setMessage('Invalid Email Address');
        setIsMessage(true);
        setMessageColor(theme.colors.red);

        return;
      }
    }

    const formData = new FormData();
    setLoading(true);
    formData.append('email',email);
    ApiServices.forgotPassword(formData, async ({isSuccess, response}: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);
        if (result?.success) {
          setLoading(false);
          setMessage(result?.message);
          setMessageColor(theme.colors.primary)
          setIsMessage(true);
          setTimeout(() => {

            navigation.goBack()
            
          }, 1000);
        } else {
          setLoading(false);
          setMessage(result?.message);
          setMessageColor(theme.colors.red);
          setIsMessage(true);
        }
      } else {
        setLoading(false);
        setMessage(response?.message);
        setIsMessage(true);
        setMessageColor(theme.colors.red);
        setIsDisable(false);
      }
    });

    // navigation.navigate('TwoFAScreen');
  };



  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingHorizontal: sizeHelper.calWp(isIpad? 30:40),
          gap: sizeHelper.calWp(30),
          paddingTop: sizeHelper.calHp(10),
        }}>
        <CustomHeader title={'Forgot Password'} />
        <TouchableWithoutFeedback
          style={{flex: 1, gap: sizeHelper.calWp(30)}}
          onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, gap: sizeHelper.calHp(30)}}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? sizeHelper.calHp(40) : 10
            }>
            <View>
              <CustomText
                text={'Verify '}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.primary}
                size={50}
              />
              <CustomText
                text={'Your Email'}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.primary}
                size={50}
              />
            </View>

            <CustomText
              text={
                'Please enter your registered email address to receive a 2FA code for resetting your password.'
              }
              color={theme.colors.secondry}
              size={22}
            />
            <View style={{flex: 1}}>
              <View style={{gap: sizeHelper.calWp(15)}}>
              <CustomInput
                  label={'Email'}
                  value={email}
                  focusedInput={focusedInput}
                  autoCapitalize={"none"}
                  onChangeText={(txt: string) =>
                    setEmail(txt)
                  }
                  leftSource={icons.email}
                  setFocusedInput={setFocusedInput}
                  placeholder="John@email.com"
                  inputKey="email"
                />
              </View>
            </View>

            <View style={styles.botttom}>
              <CustomButton text="Verify" onPress={onVerify} width={'100%'} />
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

export default EnterEmailScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: '10%',
  },
});
