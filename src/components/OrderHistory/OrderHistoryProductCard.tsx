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
import {dollarSymbol, generateUniqueIdGenerator, isIpad} from '../../utils/CommonHooks';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCartData,

} from '../../redux/reducers/cartReducer';
const OrderHistoryProductCard = ({item, onPress, isSelected,orderStatus}: any) => {
  const [quantity, setQuantity] = useState(0);
  const cardData = useSelector(getCartData);
  const dispatch = useDispatch();
  const foundCardIndex = cardData.findIndex((it: any) => it?.id === item?.id);

  console.log('orderStatus', orderStatus);

  let isDisable = false;

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{...appStyles.row, gap: sizeHelper.calWp(20),paddingLeft:2}}>
          {
            orderStatus&&(
              <TouchableOpacity
              onPress={onPress}
              style={{
                width: sizeHelper.calWp(isIpad?35: 42),
                height: sizeHelper.calWp(isIpad?35: 42),
                borderRadius: sizeHelper.calWp(isIpad?8 :10),
                borderWidth:isSelected?-1: 1.5,
                borderColor: theme.colors.text_gray,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:isSelected?theme.colors.primary:"transparent",
              }}>
              {isSelected && (
                <Image
                  style={{width: '100%', height: '100%',tintColor:theme.colors.white}}
                  source={icons.check}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>

            )
          }
       

        <TouchableOpacity
        disabled={orderStatus}
          onPress={onPress}
          style={[
            {
              ...styles.Container,
            },
          ]}>
          <Image
            source={{uri: item?.image}}
            resizeMode="cover"
            style={{
              width: sizeHelper.calWp(150),
              height: '100%',
              opacity: isDisable ? 0.5 : 1,
            }}
          />
          <View
            style={{
              padding: sizeHelper.calWp(20),
              gap: sizeHelper.calHp(5),
              flex: 1,
            }}>
            <View style={{...appStyles.rowjustify}}>
              <View>
                <View
                  style={{
                    ...appStyles.row,
                    gap: sizeHelper.calWp(5),
                    width: '80%',
                  }}>
                  <CustomText
                    text={item?.name}
                    fontWeight="600"
                    style={{opacity: isDisable ? 0.5 : 1}}
                    numberOfLines={1}
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.secondry}
                    size={22}
                  />
                  {item?.unit_of_measurement != '' && (
                  <CustomText
                    text={`(${item?.unit_of_measurement})`}
                    fontWeight="600"
                    style={{opacity: isDisable ? 0.5 : 1}}
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.gray}
                    size={19}
                  />
                )}
                </View>
                <CustomText
                text={item?.description}
                style={{
                  opacity: isDisable ? 0.5 : 1,
                  width: sizeHelper.calWp(380),
                }}
                numberOfLines={1}
                color={theme.colors.gray}
                size={16}
              />

               
                {isDisable ? (
                  <CustomText
                    color={'red'}
                    text={'OUT OF STOCK'}
                    size={20}
                    style={{marginTop: sizeHelper.calHp(10)}}
                  />
                ) : (
                  <>
                    {item?.discounted_price > 0 && (
                      <CustomText
                        text={
                          dollarSymbol +
                          `${Number(item.discounted_price*item?.quantity).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}`
                        }
                        style={{opacity: isDisable ? 0.5 : 1}}
                        textDecorationLine="line-through"
                        color={theme.colors.gray}
                        size={20}
                      />
                    )}
                  </>
                )}
              </View>
             
            </View>

            <View
              style={{
                ...appStyles.rowjustify,
                gap: sizeHelper.calWp(10),
                marginTop: sizeHelper.calHp(6),
              }}>
              <CustomText
                text={`Quantity: ${item?.quantity}`}
                // style={{opacity: isDisable ? 0.5 : 1}}
                fontWeight="600"
                fontFam={fonts.Poppins_SemiBold}
                color={theme.colors.primary}
                size={24}
              />
              <CustomText
                text={
                  dollarSymbol +
                  `${Number(item.price*item?.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
                // style={{opacity: isDisable ? 0.5 : 1}}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.primary}
                size={25}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </>
  );
};
export default OrderHistoryProductCard;
const styles = StyleSheet.create({
  img: {width: 23, height: 23},
  Container: {
    height: sizeHelper.calHp(160),
    // width:"100%",
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: sizeHelper.calWp(15),
    alignItems: 'center',
    // justifyContent:"space-between",
    gap: sizeHelper.calWp(10),
    borderWidth: 1,
    borderColor: '#F2F2F2',
    overflow: 'hidden',
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
