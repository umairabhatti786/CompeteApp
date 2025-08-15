import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Platform,
  Animated,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import ScreenLayout from "../../../components/ScreenLayout";
import { appStyles } from "../../../utils/GlobalStyles";
import { theme } from "../../../utils/Themes";
import CustomText from "../../../components/Text";
import images from "../../../utils/Constants/images";
import { fonts } from "../../../utils/Themes/fonts";
import icons from "../../../utils/Constants/icons";
import CustomButton from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartData,
  getTotalCartAmount,
  setDecrementCartItem,
  setEmptyCard,
  setIncrementCartItem,
  setTotalCartAmount,
  setUpdateMyCartDropDownItem,
} from "../../../redux/reducers/cartReducer";
import CartItem from "../../../components/Cart/CartItem";
import { useIsFocused } from "@react-navigation/native";
import {
  NotificationServices,
  convertToUTC,
  dollarSymbol,
  formatToUTC,
  isIpad,
  sessionCheck,
} from "../../../utils/CommonHooks";
import DateModal from "../../../components/Cart/DateModal";
import moment, { months } from "moment";
import EmptyCart from "../../../components/Cart/EmptyCart";
import { getToken, getUserData } from "../../../redux/reducers/authReducer";
import { ApiServices } from "../../../api/ApiServices";
import CustomToast from "../../../components/CustomToast";
import ScreenLoader from "../../../components/ScreenLoader";
import CustomInput from "../../../components/Input";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";

const MyCartScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState(2);
  const totalCartAmount = useSelector(getTotalCartAmount);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [isMessage, setIsMessage] = useState(false);
  const token = useSelector(getToken);
  const auth = useSelector(getUserData);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const blinkingAnimation = useRef<any>(null);
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const [isSelectQuantityVisible, setIsSelectQuantityVisible] =
    useState<boolean>(false);
  console.log("token", auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [isPreOrder, setIsPreOrder] = useState("1");
  const [blinkingIndex, setBlinkingIndex] = useState(false);
  const [storeSetting, setStoreSetting] = useState<any>();
  const [focusedInput, setFocusedInput] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const cartDetailBottomSheetRef = useRef<any>(null);
  const cartDetailSheetSnapPoints = useMemo(() => ["60%"], []);

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", theme.colors.primary],
  });

  const cartData = useSelector(getCartData);
  console.log("cartData", deliveryDate);

  useEffect(() => {
    getCartDetail();
    if (cartData.length == 0) {
      setDeliveryDate("");
    }
    if (cartData.length > 0) {
      getStoreData();
      console.log("StoreLes");
    }
  }, [cartData, focused]);
  // useEffect(() => {
  //   getCartDetail();

  // }, [cartData]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const getCartDetail = () => {
    console.log("CartLength", cartData.length);
    if (cartData.length > 0) {
      let currentTotal = cartData?.reduce(
        (accumulator, current: any) =>
          accumulator + parseFloat(current?.priceByQty),
        0.0
      );
      dispatch(setTotalCartAmount(currentTotal));
    }
  };

  const getStoreData = () => {
    // setLoading(true);

    let param = {
      token: token,
    };
    ApiServices.GetStoreSetting(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        console.log("responseStore", response);
        if (response?.success) {
          setStoreSetting(response?.data);
          // setLoading(false);
        } else {
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
          // setLoading(false);
        }
      } else {
      }
    });
  };

  const mergeSingleProduct = (cartData: any, productData: any) => {
    const productMap: any = {};
    const filterProduct = cartData.filter(
      (it: any) => it?.id == productData?.id
    );

    filterProduct.forEach((item: any) => {
      const productId = item.id;

      if (productMap[productId]) {
        productMap[productId].quantity += item.quantity;
        // Optionally merge other properties if needed, like `addons`, etc.
      } else {
        productMap[productId] = { ...item };
      }
    });

    return productMap[productData.id];
  };

  const taxCalculation = () => {
    const taxRate = Number(storeSetting?.tax); // 20%
    const taxAmount = (totalCartAmount * taxRate) / 100;
    // Ensure it's not negative or NaN
    if (!taxAmount || taxAmount < 0) {
      return 0;
    }

    return taxAmount;
  };

  const CalculateDeliveryCharges = () => {
    if (storeSetting?.is_delivery_charges_enabled == "1") {
      const charges = Number(storeSetting?.flat_delivery_charges); // 20%
      const chargesAmount = (totalCartAmount * charges) / 100;
      // Ensure it's not negative or NaN
      if (!chargesAmount || chargesAmount < 0) {
        return 0;
      }

      return charges;
    }
    return 0;
  };

  const grandTotalCalculation = () => {
    let grandTotal = 0;
    grandTotal =
      totalCartAmount + taxCalculation() + CalculateDeliveryCharges();

    grandTotal;
    if (grandTotal < 0 || !grandTotal) {
      grandTotal = 0;
    }
    return grandTotal.toFixed(2);
  };

  const startBlinkingAnimation = () => {
    animatedValue.setValue(0);
    blinkingAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    );
    blinkingAnimation.current.start();
  };

  const stopBlinkingAnimation = () => {
    if (blinkingAnimation.current) {
      blinkingAnimation.current.stop();
    }
  };

  const onOrderConfirmation = async () => {
    setIsLoading(true);
    setIsDisable(true);
    // let deviceState: any = await OneSignal.getDeviceState();
    // const installedVersion = getVersion();
    const deviceState = await NotificationServices.getDeviceStatus();

    let dataObj: any = {
      products: cartData,
      type: "1",
      source: "mobileapp",
      total: grandTotalCalculation(),
            is_preorder: "1",

      // is_preorder: isPreOrder,
      user_address: auth?.data?.address ? auth?.data?.address : "",
      delivery: {
        distance: null,
        charges: CalculateDeliveryCharges(),
      },
      notes: notes ? notes : "",
      device_type: Platform.OS === "android" ? "android" : "ios",
      installed_app: "2",
      device_id: deviceState,
    };
    dataObj.is_preorder_data = {
      date: deliveryDate,
    };
    let params = {
      data: dataObj,
      token: token,
    };
    console.log("dataObj", dataObj);
    ApiServices.placeOrder(params, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);
        if (result.success) {
          setIsLoading(false);
          setIsDisable(false);
          setMessage(result?.message);
          setToastColor(theme.colors.primary);
          const data = result.data;
          setIsMessage(true);
          setTimeout(() => {
            setDeliveryDate("");
            setFocusedInput(null);

            navigation.navigate("SuccessScreen", {
              id: data?.orderDetails?.id,
            });
          }, 500);
          setTimeout(() => {
            dispatch(setEmptyCard([]));
            setDeliveryDate("");
          }, 1000);
        } else {
          setIsLoading(false);
          setIsDisable(false);
          setToastColor(theme.colors.red);

          if (result?.app_update_status == 1 || result?.session_expire) {
            sessionCheck(
              result?.app_update_status,
              result?.session_expire,
              "",
              dispatch,
              navigation
            );
            return;
          }

          setMessage(result?.message);
          setIsMessage(true);
          setTimeout(() => {
            setIsMessage(false);
            setMessage("");
          }, 2000);
        }
      } else {
        setIsLoading(false);
        setIsDisable(false);

        Alert.alert(`Alert!`, `Something went wrong`);
      }

      // resolve(result);
    });
  };

  const onPlaceOrder = async () => {
    if (!deliveryDate) {
      setMessage("Please Select Order Date");
      setToastColor(theme.colors.red);

      setIsMessage(true);
      setBlinkingIndex(true);
      startBlinkingAnimation();
      // Stop the blinking animation after 5 seconds
      setTimeout(() => {
        stopBlinkingAnimation();
        setBlinkingIndex(false);
      }, 2000);

      return;
    } else if (!token) {
      navigation.navigate("LoginAndSignup");

      return;
    }
    // Alert.alert("Order Confirmation","Have you reviewed the order and are you ready to confirm your order?")

    Alert.alert(
      "Order Confirmation",
      "Have you reviewed the order and are you ready to confirm your order?",
      [
        {
          text: "Confirm",
          onPress: () => {
            onOrderConfirmation();
          },
        },

        {
          text: "Cancel",
          onPress: () => {},
        },
      ]
    );
  };

  const CartDetail = ({ title, label }: any) => {
    return (
      <View style={appStyles.rowjustify}>
        <CustomText
          text={title}
          fontWeight="600"
          fontFam={fonts.Poppins_Medium}
          color={theme.colors.secondry}
          size={25}
        />

        <CustomText
          text={label}
          fontWeight="600"
          fontFam={fonts.Poppins_Medium}
          color={theme.colors.secondry}
          size={25}
        />
      </View>
    );
  };

  const Header = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: sizeHelper.calWp(100),
            height: sizeHelper.calWp(100),
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              width: sizeHelper.calWp(40),
              height: sizeHelper.calWp(40),
              resizeMode: "contain",
              tintColor: theme.colors.secondry,
            }}
            source={icons.back_arrow}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <CustomText
            text={"My Cart"}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={25}
          />
        </View>
        <View style={{ width: 60 }} />
      </View>
    );
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingTop: sizeHelper.calHp(20),
        }}
      >
        <Header />
        {cartData.length == 0 ? (
          <View style={{ flex: 1 }}>
            <EmptyCart onPress={() => navigation.navigate("Home")} />
          </View>
        ) : (
          <View style={{ gap: sizeHelper.calHp(25) }}>
            <View>
              <FlatList
                data={cartData}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                style={{
                  paddingLeft: sizeHelper.calWp(isIpad ? 30 : 40),
                }}
                contentContainerStyle={{
                  gap: sizeHelper.calWp(20),
                  paddingRight: sizeHelper.calWp(isIpad ? 30 : 40),
                  paddingVertical: sizeHelper.calHp(10),
                  paddingBottom: sizeHelper.calWp(800),
                }}
                renderItem={({ item, index }: any) => {
                  return (
                    <>
                      <CartItem
                        token={token}
                        data={cartData}
                        index={index}
                        setMessage={setMessage}
                        setIsMessage={setIsMessage}
                        isSelectQuantityVisible={isSelectQuantityVisible}
                        setIsSelectQuantityVisible={setIsSelectQuantityVisible}
                        setToastColor={setToastColor}
                        item={item}
                        onDropDownIcrementCart={(it: any) => {
                          const mergreProduct = mergeSingleProduct(
                            cartData,
                            item
                          );
                          if (item?.data?.stock_control == 1) {
                            if (
                              mergreProduct?.quantity >=
                              Number(item?.data.stock_quantity)
                            ) {
                              Alert.alert(
                                `Stock Limit Exceeded`,
                                `You can only add up to ${item?.data.stock_quantity} items to your cart.`,

                                [
                                  {
                                    text: `Ok`,
                                  },
                                ]
                              );

                              return;
                            }
                          }

                          const data = {
                            index: index,
                            item: item,
                            quantity: it,
                          };
                          dispatch(setUpdateMyCartDropDownItem(data));
                        }}
                        onIncrementCart={() => {
                          const mergreProduct = mergeSingleProduct(
                            cartData,
                            item
                          );
                          console.log("Mefjcbdjcbnd", item?.addons);
                          if (item?.data?.stock_control == 1) {
                            if (
                              mergreProduct?.quantity >=
                              Number(item?.data.stock_quantity)
                            ) {
                              Alert.alert(
                                `Stock Limit Exceeded`,
                                `You can only add up to ${item?.data.stock_quantity} items to your cart.`,

                                [
                                  {
                                    text: `Ok`,
                                  },
                                ]
                              );

                              return;
                            }
                          }

                          const data = {
                            index: index,
                            item: item,
                          };
                          dispatch(setIncrementCartItem(data));
                          setIsSelectQuantityVisible(null);
                        }}
                        onDecrementCart={() => {
                          const data = {
                            index: index,
                            item: item,
                          };
                          console.log("cdkncd", item?.quantity);

                          dispatch(setDecrementCartItem(data));
                        }}
                      />
                    </>
                  );
                }}
              />
            </View>
          </View>
        )}
      </ScreenLayout>
      {cartData.length > 0 && (
        <View
          // behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{
            paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
            gap: sizeHelper.calHp(20),
            paddingBottom: sizeHelper.calHp(40),
            position: "absolute",
            bottom:
              Platform.OS == "ios"
                ? keyboardVisible
                  ? sizeHelper.calHp(250)
                  : 0
                : 0,
            backgroundColor: theme.colors.background,
            height: WINDOW_HEIGHT / 2.5,
            width: "100%",
          }}
        >
          <View style={styles.divider} />

          <ScrollView
            style={{
              gap: sizeHelper.calHp(20),
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              gap: sizeHelper.calHp(20),
              paddingBottom: sizeHelper.calHp(40),
              // backgroundColor:"red"
            }}
          >
            <CustomInput
              label={"Delivery Note"}
              value={notes}
              height={150}
              multiline={true}
              paddingTop={sizeHelper.calHp(10)}
              focusedInput={focusedInput}
              onChangeText={(txt: string) => setNotes(txt)}
              // keyboard={"email-address"}
              autoCapitalize={"none"}
              setFocusedInput={setFocusedInput}
              placeholder="Add Delivery Notes"
              inputKey="notes"
            />
            <CustomText
              text={"Select Order Date"}
              fontWeight="700"
              fontFam={fonts.Poppins_Bold}
              color={
                focusedInput == "date"
                  ? theme.colors.primary
                  : theme.colors.secondry
              }
              size={25}
            />
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setFocusedInput("date");

                setIsDateModalVisible(true);
              }}
            >
              {/* B7EFC543 */}
              <Animated.View
                style={{
                  padding: sizeHelper.calWp(isIpad ? 15 : 20),
                  borderColor: blinkingIndex
                    ? borderColor
                    : focusedInput == "date"
                    ? "#10451D"
                    : "#B6B6B7",
                  borderWidth: blinkingIndex ? 2 : 1.5,
                  backgroundColor:
                    focusedInput == "date" ? "#B7EFC543" : "#F0F0F1",
                  alignItems: "center",

                  flexDirection: "row",
                  gap: sizeHelper.calWp(20),
                  borderRadius: sizeHelper.calWp(12),
                }}
              >
                <Image
                  style={{
                    width: sizeHelper.calWp(isIpad ? 30 : 38),
                    height: sizeHelper.calWp(isIpad ? 30 : 38),
                    resizeMode: "contain",
                    tintColor:
                      focusedInput == "date"
                        ? theme.colors.primary
                        : theme.colors.gray,
                  }}
                  source={icons.calendar}
                />
                <CustomText
                  text={
                    deliveryDate
                      ? moment(formatToUTC(deliveryDate)).format("MMMM D, YYYY")
                      : "Select Date"
                  }
                  color={
                    deliveryDate ? theme.colors.secondry : theme.colors.gray
                  }
                  size={22}
                />
              </Animated.View>
            </TouchableOpacity>

            <CustomText
              text={"Excludes weekends & public holidays"}
              color={theme.colors.text_black}
              size={19}
            />

            <View style={{ gap: sizeHelper.calHp(20) }}>
              <CartDetail
                title={"Subtotal"}
                label={
                  dollarSymbol +
                  `${totalCartAmount?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              <CartDetail
                title={"VAT"}
                label={
                  dollarSymbol +
                  `${taxCalculation()?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                }
              />
              {storeSetting?.is_delivery_charges_enabled == "1" &&
                CalculateDeliveryCharges() > 0 && (
                  <CartDetail
                    title={"Delivery Charges"}
                    label={
                      dollarSymbol +
                      `${CalculateDeliveryCharges()?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                )}

              <View style={appStyles.rowjustify}>
                <CustomText
                  text={"Total Price"}
                  fontWeight="600"
                  fontFam={fonts.Poppins_Medium}
                  color={theme.colors.black}
                  size={30}
                />

                <CustomText
                  text={dollarSymbol + `${grandTotalCalculation()}`}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.primary}
                  size={30}
                />
              </View>
              <CustomButton
                disable={isDisable}
                style={{
                  marginTop: sizeHelper.calHp(Platform.OS == "ios" ? 10 : 30),
                }}
                onPress={onPlaceOrder}
                text="Order Now"
              />
            </View>
          </ScrollView>
        </View>
      )}

      <DateModal
        onConfirmDate={(date: any, scheduleDate: any) => {
          Keyboard.dismiss();

          // console.log("date", date);

          // const selectedDate = new Date(date);
          // const today = new Date();

          // // Zero out time for accurate date-only comparison
          // selectedDate.setHours(0, 0, 0, 0);
          // today.setHours(0, 0, 0, 0);

          // if (selectedDate.getTime() === today.getTime()) {
          //   setIsPreOrder("0");
          // } else {
          //   setIsPreOrder("1");
          // }

          setDeliveryDate(convertToUTC(date));
        }}
        modalVisible={isDateModalVisible}
        setModalVisible={setIsDateModalVisible}
      />

      <CustomToast
        isVisable={isMessage}
        setIsVisable={setIsMessage}
        backgroundColor={toastColor}
        message={message}
      />
      {isLoading && <ScreenLoader />}
    </>
  );
};

export default MyCartScreen;

const styles = StyleSheet.create({
  botttom: {
    width: "100%",
    position: "absolute",
    bottom: sizeHelper.calHp(50),
    alignItems: "center",
  },

  categoryContainer: {
    borderRadius: sizeHelper.calHp(10),
    paddingHorizontal: sizeHelper.calWp(30),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizeHelper.calHp(12),
    flexDirection: "row",
    gap: sizeHelper.calWp(13),
    backgroundColor: "red",
  },
  divider: {
    width: sizeHelper.calWp(140),
    height: sizeHelper.calHp(6),
    backgroundColor: "#B6B6B7",
    borderRadius: 999,
    alignSelf: "center",
  },
});
