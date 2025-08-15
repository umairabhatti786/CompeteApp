import {
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    StyleProp,
    ViewStyle,
  } from 'react-native';
  import sizeHelper, {screenWidth, screentHeight} from '../../utils/Helpers';
  import {fonts} from '../../utils/Themes/fonts';
  import {theme} from '../../utils/Themes';
  import icons from '../../utils/Constants/icons';
  import CustomText from '../Text';
  import {appStyles} from '../../utils/GlobalStyles';
  import images from '../../utils/Constants/images';
import { useNavigation } from '@react-navigation/native';
  
  const CustomHeader = ({title}: any) => {
    const navigation=useNavigation()
    return (
      <>
        <View
        style={{
          ...appStyles.rowjustify,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: sizeHelper.calWp(100),
            height: sizeHelper.calWp(100),
            justifyContent: 'center',
          }}>
          <Image
            style={{
              width: sizeHelper.calWp(40),
              height: sizeHelper.calWp(40),
              resizeMode: 'contain',
              tintColor: theme.colors.secondry,
            }}
            source={icons.back_arrow}
          />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center'}}>
          <CustomText
            text={title}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={25}
          />
        </View>
        <View style={{width: 60}} />
      </View>
      </>
    );
  };
  export default CustomHeader;
  
  const styles = StyleSheet.create({
   
  });
  