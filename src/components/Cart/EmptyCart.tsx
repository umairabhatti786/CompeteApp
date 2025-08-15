import {Image, Pressable, Text, View, TouchableOpacity} from 'react-native';
import CustomText from '../Text';
import sizeHelper, {screenWidth, screentHeight} from '../../utils/Helpers';
import {theme} from '../../utils/Themes';
import images from '../../utils/Constants/images';
import CustomButton from '../Button';
import {fonts} from '../../utils/Themes/fonts';

interface cartData {}
type Props = {
  onPress?: any;
  EmptyCartTitle?: string;
  EmptyCartDescription?: string;
  EmptyCartOrderButton?: string;
};

const EmptyCart = ({onPress}: Props) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: sizeHelper.calWp(40),
      }}>
      <View style={{flex: 1, paddingTop: '25%'}}>
        <View
          style={{
            width: screenWidth / 1.5,
            justifyContent: 'center',
            gap: sizeHelper.calHp(25),
          }}>
          <CustomText
            text={'Your Cart’s Empty!'}
            size={30}
            fontWeight="700"
            fontFam={fonts.Poppins_Bold}
            color={theme.colors.secondry}
            style={{textAlign: 'center'}}
          />
          <CustomText
            text={'Looks like you haven’t added anything to your cart yet!'}
            size={25}
            style={{textAlign: 'center'}}
            fontFam={fonts.Poppins_Medium}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Image
            source={images.empty_cart}
            resizeMode="contain"
            style={{width: screenWidth / 1.5, height: screentHeight / 3}}
          />
        </View>
      </View>

      <CustomButton
        text={'Order'}
        width={'100%'}
        style={{marginBottom: sizeHelper.calHp(110)}}
        onPress={onPress}
      />
    </View>
  );
};
export default EmptyCart;
