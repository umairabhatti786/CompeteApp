import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import sizeHelper from '../../../utils/Helpers';
import ScreenLayout from '../../../components/ScreenLayout';
import CustomText from '../../../components/Text';
import {fonts} from '../../../utils/Themes/fonts';
import {theme} from '../../../utils/Themes';
import icons from '../../../utils/Constants/icons';
import {appStyles} from '../../../utils/GlobalStyles';
import CustomHeader from '../../../components/Header/inde';

const TermAndCondition = ({navigation}: any) => {

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingTop: sizeHelper.calHp(10),
          paddingHorizontal: sizeHelper.calWp(40),
        }}>
        <CustomHeader title={'Term and Conditions'} />

        <CustomText
          text={
            "Lorem Ipsum Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores "
          }
          style={{textAlign: 'justify'}}
          size={21}
        />
      </ScreenLayout>
    </>
  );
};

export default TermAndCondition;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: '10%',
  },
});
