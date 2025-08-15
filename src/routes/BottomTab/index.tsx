import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../../components/Text';
import {theme} from '../../utils/Themes';
import sizeHelper from '../../utils/Helpers';
import HomeScreen from '../../screens/Main/Home';
import images from '../../utils/Constants/images';
import icons from '../../utils/Constants/icons';
import FavouritesScreen from '../../screens/Main/Favourites';
import SearchScreen from '../../screens/Main/Search';
import MyCartScreen from '../../screens/Main/MyCart';
import ProfileScreen from '../../screens/Main/Profile';
import {fonts} from '../../utils/Themes/fonts';
import {useSelector} from 'react-redux';
import {getToken} from '../../redux/reducers/authReducer';
import LoginAndSignupScreen from '../../screens/Auth/LoginAndSignup';
import {getCartData} from '../../redux/reducers/cartReducer';

const BottomTab = ({navigation}: any) => {
  const Bottom = createBottomTabNavigator();
  const token = useSelector(getToken);
  const cartLength = useSelector(getCartData).length;


  const TabItem = ({focused, title, img}: any) => {
    return (
      <View style={[style.itemStyle]}>
        <View
          style={{
            width: sizeHelper.calWp(7),
            height: sizeHelper.calWp(7),
            borderRadius: sizeHelper.calWp(7),
            backgroundColor: focused ? theme.colors.primary : 'transparent',
          }}
        />

        <Image
          resizeMode="contain"
          source={img}
          style={{
            ...style.img,
            tintColor: focused ? theme.colors.primary : theme.colors.secondry,
          }}
        />
        <CustomText
          text={title}
          fontFam={fonts.Poppins_SemiBold}
          fontWeight="600"
          size={18}
          color={focused ? theme.colors.primary : theme.colors.secondry}
        />
      </View>
    );
  };

  return (
    <Bottom.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: Platform.OS=="ios"?false:true,
        tabBarShowLabel: false,
        animationEnabled: false,
        gestureEnabled: true,
        // keyboardHidesTabBar: true,

        cardStyleInterpolator: ({current, next, layouts}: any) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
          shadowOffset: {width: 0, height: 5},
          shadowOpacity: 1,
          shadowColor: theme.colors.black,
          shadowRadius: 4,
          elevation: 10,
          height: sizeHelper.calHp(130),
          borderTopWidth: -1,
          paddingTop: sizeHelper.calHp(Platform.OS == 'ios' ? 20 : 30),
        },

        headerShown: false,
      })}>
      {/* Home Tab */}
      <Bottom.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <TabItem
                title={'Home'}
                colors={theme.colors}
                img={focused ? icons.filled_home : icons.filled_home}
                focused={focused}
              />
            );
          },
        }}
      />
      {/* Calendar Tab */}
      <Bottom.Screen
        name="Favourites"
        component={token ? FavouritesScreen : LoginAndSignupScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <TabItem
                colors={theme.colors}
                title={'Favourites'}
                img={
                  focused ? icons.unfilled_favurits : icons.unfilled_favurits
                }
                focused={focused}
              />
            );
          },
        }}
      />
      {/* AddEvent Tab */}

      <Bottom.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchScreen')}
                style={{
                  position: 'absolute',
                  top: sizeHelper.calHp(Platform.OS == 'ios' ? -50 : -60),
                  height: sizeHelper.calHp(110),
                  width: sizeHelper.calHp(110),
                  borderRadius: sizeHelper.calWp(110),
                  backgroundColor: theme.colors.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SearchScreen')}
                  style={{
                    height: sizeHelper.calHp(80),
                    width: sizeHelper.calHp(80),
                    borderRadius: sizeHelper.calWp(80),
                    backgroundColor: theme.colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    source={icons.search}
                    style={{
                      height: sizeHelper.calHp(34),
                      width: sizeHelper.calHp(34),
                      tintColor: theme.colors.white,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          },
        }}
      />
      {/* Contacts Tab */}
      <Bottom.Screen
        name="MyCart"
        component={MyCartScreen}
        options={{
          ...(cartLength === 0
            ? {
                tabBarBadge: '', // shows a small red dot
                tabBarBadgeStyle: {
                  backgroundColor: 'transparent',
                },
              }
            : {
                tabBarBadge: cartLength,
                tabBarBadgeStyle: {
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.white,
                  top: sizeHelper.calHp(-20),
                },
              }),
          tabBarIcon: ({focused}) => {
            return (
              <TabItem
                colors={theme.colors}
                title={'My Cart'}
                img={icons.unfilled_cart}
                focused={focused}
              />
            );
          },
        }}
      />
      {/* profile Tab */}
      <Bottom.Screen
        name="Profile"
        component={token ? ProfileScreen : LoginAndSignupScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => {
            return (
              <TabItem
                colors={theme.colors}
                title={'Profile'}
                img={icons.unfilled_user}
                focused={focused}
              />
            );
          },
        }}
      />
    </Bottom.Navigator>
  );
};
export default BottomTab;

const style = StyleSheet.create({
  itemStyle: {
    width: sizeHelper.calWp(130),
    backgroundColor: 'transparent', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    gap: sizeHelper.calHp(7),
  },
  img: {
    height: sizeHelper.calHp(33),
    width: sizeHelper.calHp(33),
  },
  tabBarStyle: {},
});
