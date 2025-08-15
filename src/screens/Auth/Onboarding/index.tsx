import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import sizeHelper, {screenWidth, screentHeight} from '../../../utils/Helpers';
import images from '../../../utils/Constants/images';
import {appStyles} from '../../../utils/GlobalStyles';
import CustomText from '../../../components/Text';
import {fonts} from '../../../utils/Themes/fonts';
import {theme} from '../../../utils/Themes';
import icons from '../../../utils/Constants/icons';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
    const navigation:any=useNavigation()
  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={{flex: 1}}>
        <View
          style={{
            height: screentHeight / 1.9,
          }}>
          <ImageBackground
            style={{
              flex: 1,
              marginTop: sizeHelper.calHp(-150),
              alignItems: 'center',
            }}
            source={images.onboard_circle}>
            <Image style={styles.logo_img} source={images.logo} />
          </ImageBackground>
          <View style={{position: 'absolute', bottom: sizeHelper.calHp(-130)}}>
            <Image style={styles.fruits_bag} source={images.fruit_bag} />
          </View>
        </View>
        <View
          style={{
            paddingTop: sizeHelper.calHp(150),
            paddingHorizontal: sizeHelper.calWp(50),
          }}>
          <View
            style={{
              ...appStyles.row,
              gap: sizeHelper.calWp(10),
              alignSelf: 'center',
            }}>
            <CustomText
              text={'Easy'}
              fontWeight="600"
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.light_primary}
              size={50}
              style={{lineHeight: 50}} // ✅ Add lineHeight close to font size
            />
            <CustomText
              text={'Shopping'}
              fontWeight="600"
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.dark_primary}
              size={50}
              style={{lineHeight: 52}} // ✅ Add lineHeight close to font size
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: sizeHelper.calWp(10),
              alignSelf: 'center',
            }}>
            <CustomText
              text={'No'}
              fontWeight="600"
              style={{lineHeight: Platform.OS == 'ios' ? 35 : 25}}
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.dark_primary}
              size={50}
            />
            <CustomText
              text={'Hassle'}
              fontWeight="600"
              fontFam={fonts.Poppins_SemiBold}
              style={{lineHeight: Platform.OS == 'ios' ? 35 : 25}}
              color={theme.colors.light_primary}
              size={50}
            />
          </View>

          <CustomText
            text={
              'We believe that your time is valuable, which is why we" ve designed a shopping experience that prioritizes convenience and simplicity.'
            }
            style={{textAlign: 'center', marginTop: sizeHelper.calHp(20)}}
            color={theme.colors.text_black}
            size={20}
          />
        </View>
      </View>
      <View
        style={{
          ...appStyles.rowjustify,
          marginBottom: sizeHelper.calWp(70),
          paddingHorizontal: sizeHelper.calWp(50),
        }}>
        <TouchableOpacity
          style={{
            ...styles.next_box,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#B7EFC5',
          }}>
          <Image style={styles.back_arrow} source={icons.back_arrow} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('LoginAndSignup')}
          style={{
            ...appStyles.row,
            gap: sizeHelper.calWp(20),
          }}>
          <CustomText
            text={'Next'}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.primary}
            size={25}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginAndSignup')}
            style={styles.next_box}>
            <Image style={styles.next_arrow} source={icons.next_arrow} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  next_box: {
    width: sizeHelper.calWp(95),
    height: sizeHelper.calWp(95),
    alignItems: 'center',
    borderRadius: sizeHelper.calWp(70),
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
  },
  logo_img: {
    width: sizeHelper.calWp(330),
    height: sizeHelper.calHp(300),
    marginTop: sizeHelper.calWp(Platform.OS == 'ios' ? 230 : 200),
    resizeMode: 'contain',
  },
  fruits_bag: {
    width: screenWidth,
    height: sizeHelper.calHp(600),
    resizeMode: 'contain',
  },
  next_arrow: {
    width: sizeHelper.calWp(35),
    height: sizeHelper.calHp(35),
    resizeMode: 'contain',
  },
  back_arrow: {
    width: sizeHelper.calWp(40),
    height: sizeHelper.calHp(40),
    resizeMode: 'contain',
  },
});
