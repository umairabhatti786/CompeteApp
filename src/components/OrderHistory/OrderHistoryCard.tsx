import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  Alert,
} from 'react-native';
import sizeHelper, {screenWidth, screentHeight} from '../../utils/Helpers';
import {fonts} from '../../utils/Themes/fonts';
import {theme} from '../../utils/Themes';
import icons from '../../utils/Constants/icons';
import CustomText from '../Text';
import {appStyles} from '../../utils/GlobalStyles';
import {dollarSymbol, generateUniqueIdGenerator, getOrderStatus} from '../../utils/CommonHooks';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../Button';
import moment from 'moment';

const OrderHistoryCard = ({item, onDetail}: any) => {

  console.log("IsPreorder",item)

  const { status, status_color } = getOrderStatus(item.status);

  return (
    <>
      <View
        style={[
          {
            ...styles.Container,
          },
        ]}>
        <View style={{...appStyles.rowjustify}}>
          <CustomText
            text={`ORDER NO ${item?.id}`}
            fontWeight="600"
            numberOfLines={1}
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={22}
          />

          <CustomText
            text={status}
            numberOfLines={1}
            color={
              status_color
            }
            size={18}
          />
        </View>
        <CustomText
          text={`Created Date: ${moment(item?.created_at).format('DD-MM-YYYY')}`}
          numberOfLines={1}
          color={theme.colors.text_gray}
          size={20}
        />
          <CustomText
          text={`Order Date: ${moment(item?.is_preorder_data?.date!='N/A'? item?.is_preorder_data?.date:item?.created_at).format('DD-MM-YYYY')}`}
          numberOfLines={1}
          color={theme.colors.text_gray}
          size={20}
        />

        <View style={{...appStyles.rowjustify}}>
          <CustomText

            text={
              
              `Total Bill: ${dollarSymbol +item?.total?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            fontWeight="600"
            numberOfLines={1}
            fontFam={fonts.Poppins_SemiBold}
            color={
              status_color
            }
            size={22}
          />
          <CustomButton
            size={16}
            height={46}
            borderRadius={15}
            paddingHorizontal={sizeHelper.calWp(25)}
            // style={{marginTop: sizeHelper.calHp(20)}}
            onPress={onDetail}
            text="View Details"
          />
        </View>
      </View>
    </>
  );
};
export default OrderHistoryCard;
const styles = StyleSheet.create({
  img: {width: 23, height: 23},
  Container: {
    // height: sizeHelper.calHp(150),
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: sizeHelper.calWp(20),
    gap: sizeHelper.calWp(10),
    borderColor: '#F2F2F2',
    overflow: 'hidden',
    padding: sizeHelper.calWp(20),
  },
  inputContainer: {
    flex: 1,
    fontSize: sizeHelper.calHp(22),
    fontFamily: fonts.Poppins_Regular,
    padding: 0,
  },
  quantityMain: {
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeHelper.calWp(55),
    width: sizeHelper.calWp(55),
  },
  quantityInner: {
    height: sizeHelper.calWp(50),
    width: sizeHelper.calWp(50),
    borderRadius: sizeHelper.calWp(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity_icon: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },
});
