import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AUTH_DATA, StorageServices, TOKEN} from '../../../utils/StorageService';
import {setUserData} from '../../../redux/reducers/authReducer';
import images from '../../../utils/Constants/images';
import { theme } from '../../../utils/Themes';
import sizeHelper from '../../../utils/Helpers';
import CustomText from '../../../components/Text';
import { fonts } from '../../../utils/Themes/fonts';

const Splash = ({navigation}: any) => {
  const dispatch = useDispatch();
  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const userInfo = await StorageServices.getItem(AUTH_DATA);
    dispatch(setUserData(userInfo));

    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name:'BottomTab'}],
        }),
      );
    }, 2000);
  };
  return (
    <>
      {/* <ScreenLayout style={styles.main}>
        
       
      </ScreenLayout> */}
      <View style={{flex:1,backgroundColor:theme.colors.primary}}>
      <ImageBackground
        style={styles.layout_img}
        source={images.splash_background}
        resizeMode="cover"
      >
         <CustomText
              text={`London \n Prime Produce`}
              fontWeight="700"
              style={{textAlign:"center"}}
              fontFam={fonts.Poppins_Bold}
              color={theme.colors.white}
              size={53}
            />

{/* <Image
        style={{width:sizeHelper.calWp(420),height:sizeHelper.calWp(420)}}
        source={images.splash_logo}
        resizeMode="contain"
      /> */}
        </ImageBackground>

      </View>
     

      {/* <View style={styles.bottomContainer}>
          <CustomButton
            text="Sign In"
            onPress={()=>navigation.navigate("LoginScreen")}
            width={"67%"}
            bgColor={theme.colors.white}
            textColor={theme.colors.secondry}
          />
          <CustomButton
            text="Sign Up"
            onPress={()=>navigation.navigate("SignupScreen")}

            
            width={"67%"}
            bgColor={theme.colors.secondry}
            textColor={theme.colors.white}
          />
        </View> */}
    </>
  );
};
export default Splash;

const styles = StyleSheet.create({
  layout_img: {
    width: '100%',
    height: '100%',
    alignItems:"center",
    justifyContent:"center"
    // position: "absolute",
    // top: verticalScale(-100),
    // opacity: 0.8,
  },
 
});
