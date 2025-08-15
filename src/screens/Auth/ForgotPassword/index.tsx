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
import CustomHeader from '../../../components/Header/inde';

const ForgotPassword = ({navigation}: any) => {
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <ScreenLayout
      style={{
        flex: 1,
        paddingHorizontal: sizeHelper.calWp(50),
        paddingTop: sizeHelper.calHp(20),
        gap: sizeHelper.calWp(30),
      }}>
              <CustomHeader title={'Change Password'} />

      <TouchableWithoutFeedback
        style={{flex: 1, gap: sizeHelper.calWp(30)}}
        onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1,gap:sizeHelper.calHp(30)}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 15 : 10} // Adjust if header present
        >
          <View>
            <CustomText
              text={'Reset '}
              fontWeight="700"
              fontFam={fonts.Poppins_Bold}
              color={theme.colors.primary}
              size={50}
            />
            <CustomText
              text={'Your Password'}
              fontWeight="700"
              fontFam={fonts.Poppins_Bold}
              style={{lineHeight: 40}} // ✅ Add lineHeight close to font size
              color={theme.colors.primary}
              size={50}
            />
          </View>

          <CustomText
            text={'Enter a strong new password and confirm it to complete the reset process.'}
            color={theme.colors.secondry}
            size={22}
          />
          <View style={{flex: 1}}>
            <View style={{gap: sizeHelper.calWp(15)}}>
              <CustomInput
                label={'New password'}
                focusedInput={focusedInput}
                leftSource={icons.email}
                setFocusedInput={setFocusedInput}
                placeholder="John@email.com"
                inputKey="password"
              />
              <CustomInput
                label={'Confirm Password'}
                focusedInput={focusedInput}
                setFocusedInput={setFocusedInput}
                leftSource={icons.lock}
                placeholder="Password"
                inputKey="confirm password"
              />
           
            </View>
          </View>

          <View style={styles.botttom}>
            <CustomButton text="Proceed"
            onPress={()=>navigation.navigate("BottomTab")}
             width={'100%'} />
         
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScreenLayout>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: '10%',
  },
});
