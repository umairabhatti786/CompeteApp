import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import sizeHelper, {screenWidth, screentHeight} from '../../../utils/Helpers';
import images from '../../../utils/Constants/images';
import {theme} from '../../../utils/Themes';
import ScreenLayout from '../../../components/ScreenLayout';
import CustomButton from '../../../components/Button';
import { isIpad } from '../../../utils/CommonHooks';

const LoginAndSignupScreen = ({navigation}: any) => {
  return (
    <ScreenLayout
      style={{
        flex: 1,
        paddingHorizontal: sizeHelper.calWp(50),
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}>
        <View
          style={{
            paddingTop: isIpad?"10%": '40%',
          }}>
          <View style={styles.basket_circle}></View>
          <Image style={styles.basket_img} source={images.fruit_basket} />
        </View>
      </View>

      <View
        style={{
          gap: sizeHelper.calHp(20),
          paddingBottom: isIpad?"10%": '20%',
        }}>
        <CustomButton 
        onPress={()=>navigation.navigate("Login")}
        text="Login" width={'100%'} />
        <CustomButton
          textColor={'#10451D'}
          onPress={()=>navigation.navigate("Signup")}
          bgColor={theme.colors.light_primary}
          text="Signup"
          width={'100%'}
        />
      </View>
    </ScreenLayout>
  );
};

export default LoginAndSignupScreen;

const styles = StyleSheet.create({
  basket_img: {
    width: screenWidth,
    height: screentHeight / 1.6,
    position: 'absolute',
    bottom: sizeHelper.calHp( isIpad?-40:-170),
    left: sizeHelper.calWp(-100),
    resizeMode: 'contain',
  },
  fruits_bag: {
    width: screenWidth,
    height: sizeHelper.calHp(600),
    resizeMode: 'contain',
  },

  basket_circle: {
    width: sizeHelper.calWp(isIpad?500: 590),
    height: sizeHelper.calWp(isIpad?500: 590),
    borderRadius: sizeHelper.calWp(isIpad?500: 590),
    backgroundColor: '#B7EFC5',
  },
});
