import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import {theme} from '../../../utils/Themes';
import CustomText from '../../../components/Text';
import {appStyles} from '../../../utils/GlobalStyles';
import {fonts} from '../../../utils/Themes/fonts';
import images from '../../../utils/Constants/images';
import icons from '../../../utils/Constants/icons';
import { WINDOW_WIDTH } from '@gorhom/bottom-sheet';

type Props = {
  data: any;
};
const NotificationCard = ({data}: Props) => {
  return (
    <View
      style={{
        // height: windowHeight / 6.6,
        width: '100%',
        backgroundColor: theme.colors.white,
        flexDirection: 'row',
        alignItems:"center",
        borderRadius: sizeHelper.calWp(20),
        padding: sizeHelper.calWp(20),
        overflow: 'hidden',
        gap:sizeHelper.calWp(20)
      }}>
      <Image
        style={{
          width: sizeHelper.calWp(50),
          height: sizeHelper.calWp(50),
          resizeMode: 'contain',
        }}
        source={icons.alert}
      />

      <View
        style={{
          width: WINDOW_WIDTH/1.4,
          gap: sizeHelper.calHp(4),
        }}>
        <CustomText
          text={data?.title}
          fontWeight="600"
          numberOfLines={1}
          fontFam={fonts.Poppins_SemiBold}
          size={20}
        />
        <CustomText
          text={data?.message}
          numberOfLines={4}
          // style={{width:WINDOW_WIDTH/1}}
          size={20}
          // color={theme.colors.text_black}
        />
      </View>
    </View>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({});
