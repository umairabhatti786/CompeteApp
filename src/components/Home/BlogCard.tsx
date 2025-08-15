import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import sizeHelper from '../../utils/Helpers';
import {theme} from '../../utils/Themes';
import CustomText from '../Text';
import {fonts} from '../../utils/Themes/fonts';

export interface cardData1 {
  heading?: string;
  title?: string;
  description?: string;
  onPress?: any;
  image?: any;
  header?: string;
}
type Props = {
  data?: cardData1;
  onPress?: () => void;
  blogDescription?: any;
};

const BlogCard = ({data, onPress, blogDescription}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      onPress={onPress}
      style={styles.container}>
      <Image
        source={{uri: data?.header}}
        resizeMode="cover"
        style={{
          width: '100%',
          height: sizeHelper.calHp(160),
          // borderRadius: sizeHelper.calWp(15),
          // borderRadius:scale(5)
        }}
      />
      <View
        style={{
          width: '99%',
          padding: 15,
        }}>
        <CustomText
          text={data?.heading}
          //   size={isiPad ? 20 : 14}
          numberOfLines={1}
          fontFam={fonts.Poppins_Medium}
          fontWeight="600"
          color={theme.colors.primary}
        />
        <View
          style={{
            marginTop: sizeHelper.calHp(5),
          }}>
          <CustomText
            text={blogDescription}
            numberOfLines={2}
            size={20}
            color={theme.colors.secondry}
            // lineHeight={18}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default BlogCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,

    width: '99%',
    // height: sizeHelper.calHp(250),
    borderRadius: sizeHelper.calWp(15),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
});
