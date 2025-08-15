import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Platform,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import { theme } from "../../../utils/Themes";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomButton from "../../../components/Button";
import CustomText from "../../../components/Text";
import { fonts } from "../../../utils/Themes/fonts";
import CustomInput from "../../../components/Input";
import { appStyles } from "../../../utils/GlobalStyles";
import icons from "../../../utils/Constants/icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { emailRegex, passwordRegex } from "../../../utils/Regex";
import CustomHeader from "../../../components/Header/inde";
import NotificationCard from "./NotificationCard";
import { isIpad, sessionCheck } from "../../../utils/CommonHooks";
import { OrderHistoryLayout } from "../../../utils/Layouts/OrderHistoryLayout";
import CustomToast from "../../../components/CustomToast";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../../redux/reducers/authReducer";
import { ApiServices } from "../../../api/ApiServices";

const NotificationScreen = ({ navigation }: any) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const token = useSelector(getToken);

  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.primary);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [notificationData, setNotificationData] = useState([]);
  const dispatch=useDispatch()

  useEffect(() => {
    // setLoading(true);

    getProductData();
  }, []);
  const notificationCardData = [
    {
      title: "Speeding your way",
      description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
      // image: images.shippingFast
    },
    {
      title: "Order Delivered",
      description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
      // image: images.checkCircle
    },
    {
      title: "Order Cancelled",
      description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
      // image: images.crossCircle
    },
    {
      title: "Order Delivered",
      description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
      // image: images.checkCircle
    },
    {
      title: "Order Delivered",
      description: "Lorem ipsum dolor sit amet ab ipsam ut dolores mai",
      // image: images.checkCircle
    },
  ];

  const getProductData = () => {
    setLoading(true);
    let param = {
      token: token,
      page: 1,
    };
    setPage(2);

    ApiServices.GetNotification(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setLoading(false);
          console.log("Notificayipn", response);

          setNotificationData(response?.data);
          // if (response?.data?.products.length >= 10) {
          //   setHasMoreData(true);
          // } else {
          //   setHasMoreData(false);
          // }
        } else {
          console.warn("Product fetch unsuccessful:", response);
          setLoading(false);
          if (response?.app_update_status == 1 || response?.session_expire) {
            sessionCheck(
              response?.app_update_status,
              response?.session_expire,
              "",
              dispatch,
              navigation
            );
            return;
          }
          if (
            response?.error ==
            "User is not active against the provided Authorization Bearer Token."
          ) {
            sessionCheck(
              "",
              "",
              "Your account status is inactive",
              dispatch,
              navigation
            );
            return;
          }
        }
      } else {
        console.error("API call failed");
        setLoading(false);
      }
    });
  }

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingTop: sizeHelper.calHp(20),
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
        }}
      >
        <CustomHeader title={"Notification"} />

        {loading ? (
          <View
            style={{
              flex: 1,
              paddingTop: sizeHelper.calHp(20),
            }}
          >
            <OrderHistoryLayout />
          </View>
        ) : (
          <View style={{ flex: 1, paddingTop: sizeHelper.calHp(20) }}>
            <View>
              <FlatList
                data={notificationData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: sizeHelper.calWp(30),
                }}

                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '80%',
                      }}>
                      <CustomText
                        text={'No Notifications available'}
                        fontWeight="700"
                        style={{textAlign: 'center'}}
                        fontFam={fonts.Poppins_Bold}
                        color={theme.colors.secondry}
                        size={25}
                      />
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }: any) => {
                  return <NotificationCard data={item} />;
                }}
              />
            </View>
          </View>
        )}
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        setIsVisable={setIsMessage}
        backgroundColor={toastColor}
        message={message}
      />
    </>
    // <ScreenLayout
    //   style={{
    //     flex: 1,
    //     paddingHorizontal: sizeHelper.calWp(isIpad?30 :40),
    //     paddingTop: sizeHelper.calHp(10),
    //   }}>
    //   <CustomHeader title={'Notification'} />

    //   <View style={{gap: sizeHelper.calHp(8), flex: 1}}>
    //   <FlatList
    //         data={notificationCardData}
    //         showsHorizontalScrollIndicator={false}
    //         contentContainerStyle={{
    //           gap: 20,
    //         }}

    //         renderItem={({ item }) => {
    //           return <NotificationCard data={item} />;
    //         }}
    //       />
    //   </View>
    // </ScreenLayout>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingTop: "100%",
  },
});
