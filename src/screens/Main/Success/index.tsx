import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import ScreenLayout from '../../../components/ScreenLayout';
import images from '../../../utils/Constants/images';
import CustomText from '../../../components/Text';
import {fonts} from '../../../utils/Themes/fonts';
import {theme} from '../../../utils/Themes';
import CustomButton from '../../../components/Button';

const SuccessScreen = ({navigation}: any) => {
  return (
    <ScreenLayout
      style={{
        flex: 1,
        paddingHorizontal: sizeHelper.calWp(50),
        paddingTop: sizeHelper.calHp(60),
        alignItems: 'center',
      }}>
      <View style={{flex: 1, paddingTop: '35%', gap: sizeHelper.calWp(30)}}>
        <Image
          source={images.check}
          style={{
            width: sizeHelper.calWp(250),
            height: sizeHelper.calWp(250),
            alignSelf: 'center',
          }}
        />
        <CustomText
          text={'Thank You For Your Order.'}
          fontWeight="600"
          style={{textAlign: 'center'}}
          fontFam={fonts.Poppins_SemiBold}
          color={theme.colors.black}
          size={30}
        />
        <CustomText
          text={
            'Our team will review the details, and you will receive a confirmation once the order has been accepted.'
          }
          fontWeight="600"
          style={{textAlign: 'center'}}
          fontFam={fonts.Poppins_Medium}
          color={theme.colors.black}
          size={20}
        />
      </View>

      <CustomButton
        width={'100%'}
        style={{marginBottom: sizeHelper.calHp(100)}}
        onPress={() => navigation.navigate('BottomTab')}
        text="Back to Home"
      />
    </ScreenLayout>
  );
};

export default SuccessScreen;

const styles = StyleSheet.create({

});
