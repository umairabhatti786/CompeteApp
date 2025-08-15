import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import sizeHelper, { screenWidth, screentHeight } from "../../utils/Helpers";
import { fonts } from "../../utils/Themes/fonts";
import { theme } from "../../utils/Themes";
import icons from "../../utils/Constants/icons";
import CustomText from "../Text";
import { appStyles } from "../../utils/GlobalStyles";
import {
  dollarSymbol,
  generateUniqueIdGenerator,
  isIpad,
  sessionCheck,
} from "../../utils/CommonHooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartData,
  setCartData,
  setDecrementCartItem,
  setUpdateCartItem,
  setUpdateDropDownCartItem,
} from "../../redux/reducers/cartReducer";
import { ApiServices } from "../../api/ApiServices";
import { getToken } from "../../redux/reducers/authReducer";
import { useNavigation } from "@react-navigation/native";
import images from "../../utils/Constants/images";
const ProductCard = ({
  item,
  setMessage,
  setIsMessage,
  isFavorite,
  onRemoveitem,
  setToastColor,
  setIsSelectQuantityVisible,
  isSelectQuantityVisible,
  data,
  index,
}: any) => {
  const cardData = useSelector(getCartData);
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [isFavourit, setIsFavourit] = useState<any>();
  const navigation: any = useNavigation();

  const foundCardIndex = cardData.findIndex((it: any) => it?.id === item?.id);
  let cardProduct: any = cardData[foundCardIndex];
  const [quantity, setQuantity] = useState(
    cardProduct?.quantity ? cardProduct?.quantity : 0
  );
  useEffect(() => {
    setQuantity(cardProduct?.quantity ? cardProduct?.quantity : 0);
  }, [cardData]);

  useEffect(() => {
    setIsFavourit(item?.is_favorite == 1);
  }, [item]);

  let isDisable =
    item?.data?.product_sold_out !== "available" ||
    (item?.data &&
      item?.data?.stock_control === 1 &&
      item?.data?.stock_quantity === 0);

  const mergeDuplicateProducts = (cartData: any) => {
    const productMap: any = {};
    const filterProduct = cartData.filter((it: any) => it?.id == item?.id);

    filterProduct.forEach((ite: any) => {
      const productId = ite.id;

      if (productMap[productId]) {
        productMap[productId].quantity += ite.quantity;
        // Optionally merge other properties if needed, like `addons`, etc.
      } else {
        productMap[productId] = { ...ite };
      }
    });

    return productMap[item.id];
  };

  const checkStock = (productData: any, stockQuantity: any) => {
    if (productData?.data?.stock_control == 1) {
      if (stockQuantity >= Number(productData?.data?.stock_quantity)) {
        Alert.alert(
          `Stock Limit Exceeded`,
          `You can only add up to" ${productData?.data?.stock_quantity} items to your cart.`,

          [
            {
              text: `Ok`,
            },
          ]
        );

        return false;
      }
    }

    return true;
  };

  const onAddToCart = () => {
    console.log("AddcctoCsrd", item);
    let productItem = {
      ...item,
      addons: null,
      cartId: generateUniqueIdGenerator(),
      data: {
        ...item.data,
        payment_service: "disabled",
        payment_service_price: 0,
        payment_service_details: {},
      },
    };

    let obj = {
      ...productItem,
      priceByQty: Number(item?.price) * 1,
      price: Number(item?.price),
      quantity: 1,
    };

    const foundAddonsProduct: any = cardData[foundCardIndex];

    if (foundCardIndex != -1) {
      if (foundAddonsProduct) {
        const data = {
          product: obj,
          index: foundCardIndex,
          quantity: obj?.quantity + foundAddonsProduct?.quantity,
        };
        dispatch(setUpdateCartItem(data));
      } else {
        dispatch(setCartData(obj));
      }
    } else {
      dispatch(setCartData(obj));
    }
  };

  const onDropDownAddToCart = (quantity: any) => {
    console.log("AddcctoCsrd", item);
    let productItem = {
      ...item,
      addons: null,
      cartId: generateUniqueIdGenerator(),
      data: {
        ...item.data,
        payment_service: "disabled",
        payment_service_price: 0,
        payment_service_details: {},
      },
    };

    let obj = {
      ...productItem,
      priceByQty: Number(item?.price) * quantity,
      price: Number(item?.price),
      quantity: quantity,
    };

    const foundAddonsProduct: any = cardData[foundCardIndex];

    if (foundCardIndex != -1) {
      if (foundAddonsProduct) {
        const data = {
          product: obj,
          index: foundCardIndex,
          quantity: obj?.quantity,
        };
        dispatch(setUpdateDropDownCartItem(data));
      } else {
        dispatch(setCartData(obj));
      }
    } else {
      dispatch(setCartData(obj));
    }
  };

  const onAddFavourits = () => {
    if (isDisable) {
      setIsMessage(true);
      setMessage("Only available products can be added to favourites.");

      return;
    }
    if (!token) {
      setToastColor(theme.colors.red);
      setIsMessage(true);
      setMessage("Please log in to add items to your favourites.");

      return;
    }

    if (isFavorite) {
      setToastColor(theme.colors.primary);
      setMessage("Product remove from avourites");
      setIsMessage(true);
    } else {
      setToastColor(theme.colors.primary);
      setIsMessage(true);
      setMessage(
        !isFavourit
          ? "Product Added To Favourite List"
          : "Product Remove From Favourite List"
      );
      setIsFavourit(isFavourit ? false : true);
    }

    const formData = new FormData();
    formData.append("product_id", item?.id);
    if (isFavorite) {
      formData.append("type", "remove");
    } else {
      formData.append("type", !isFavourit ? "add" : "remove");
    }
    let data = {
      form: formData,
      token: token,
    };

    ApiServices.AddRemoveFavourit(
      data,
      async ({ isSuccess, response }: any) => {
        if (isSuccess) {
          let result = JSON.parse(response);
          console.log("ResultAddFac");
          if (result?.success) {
            onRemoveitem?.();
            // if (isFavorite) {
            //   setToastColor(theme.colors.primary);

            //   setMessage('Product remove in favourits');
            //   setIsMessage(true);
            // } else {
            //   setToastColor(theme.colors.primary);
            //   setIsMessage(true);
            //   setMessage(result?.message);
            //   setIsFavourit(isFavourit ? false : true);
            // }
          } else {
            setIsFavourit(false);
            setIsMessage(false);
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
            if (
              result?.error ==
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

            setIsMessage(true);
            setToastColor(theme.colors.red);

            setMessage(result?.message);
            setIsFavourit(false);
          }
        } else {
          setMessage(response?.message);
          setToastColor(theme.colors.red);
          setIsMessage(true);
          setIsFavourit(false);

          // setIsDisable(false);
        }
      }
    );
  };

  return (
    <>
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsSelectQuantityVisible(null)}
          style={[
            {
              ...styles.Container,
            },
          ]}
        >
          <Image
            source={{ uri: item?.image }}
            // resizeMode="contain"
            style={{
              width: sizeHelper.calWp(145),
              height: "100%",
              opacity: isDisable ? 0.5 : 1,
            }}
          />
          <View
            style={{
              padding: sizeHelper.calWp(20),
              gap: sizeHelper.calHp(5),
              flex: 1,
            }}
          >
            <View style={{ ...appStyles.rowjustify }}>
              <View>
                <View
                  style={{
                    ...appStyles.row,
                    gap: sizeHelper.calWp(5),
                    width: "70%",
                  }}
                >
                  <CustomText
                    text={item?.name}
                    fontWeight="600"
                    style={{ opacity: isDisable ? 0.5 : 1 }}
                    numberOfLines={1}
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.secondry}
                    size={22}
                  />
                  {item?.unit_of_measurement != "" && (
                    <CustomText
                      text={`(${item?.unit_of_measurement})`}
                      fontWeight="600"
                      style={{ opacity: isDisable ? 0.5 : 1 }}
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
                    width: sizeHelper.calWp(360),
                  }}
                  numberOfLines={1}
                  color={theme.colors.gray}
                  size={isIpad ? 18 : 16}
                />
                {isDisable ? (
                  <CustomText
                    color={"red"}
                    text={"OUT OF STOCK"}
                    size={18}
                    style={{ marginTop: sizeHelper.calHp(10) }}
                  />
                ) : (
                  <>
                    {item?.discounted_price > 0 && (
                      <>
                        {token && (
                          <CustomText
                            text={
                              dollarSymbol +
                              `${Number(item.discounted_price).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}`
                            }
                            style={{ opacity: isDisable ? 0.5 : 1 }}
                            textDecorationLine="line-through"
                            color={theme.colors.gray}
                            size={20}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </View>
              <TouchableOpacity
                onPress={onAddFavourits}
                disabled={isDisable}
                style={{
                  width: sizeHelper.calWp(80),
                  height: sizeHelper.calWp(isIpad ? 80 : 95),
                  alignItems: "flex-end",
                  marginTop: isIpad ? sizeHelper.calHp(10) : 0,
                }}
              >
                <TouchableOpacity
                  onPress={onAddFavourits}
                  disabled={isDisable}
                  style={{
                    width: sizeHelper.calWp(isIpad ? 50 : 56),
                    height: sizeHelper.calWp(isIpad ? 50 : 56),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isFavourit
                      ? theme.colors.red + "20"
                      : "#F2F2F2",
                    borderRadius: sizeHelper.calWp(15),
                    // alignSelf: 'flex-start',
                  }}
                >
                  <Image
                    source={icons.unfilled_favurits}
                    style={{
                      width: "60%",
                      height: "60%",
                      tintColor: isFavourit
                        ? theme.colors.red
                        : theme.colors.gray,
                    }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

            <View
              style={{
                ...appStyles.rowjustify,
              }}
            >
              {token ? (
                <CustomText
                  text={
                    dollarSymbol +
                    `${Number(item.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                  style={{ opacity: isDisable ? 0.5 : 1 }}
                  fontWeight="700"
                  fontFam={fonts.Poppins_Bold}
                  color={theme.colors.secondry}
                  size={25}
                />
              ) : (
                <CustomText
                  color={"red"}
                  text={"Login for Prices"}
                  size={15}
                  style={{ marginTop: sizeHelper.calHp(10) }}
                />
              )}

              <View
                style={{
                  ...appStyles.row,
                  gap: sizeHelper.calWp(10),
                }}
              >
                <TouchableOpacity
                  disabled={isDisable}
                  style={styles.quantityMain}
                  onPress={() => {
                    if (!token) {
                      navigation.navigate("LoginAndSignup");
                      return;
                    }
                    if (quantity != 0) {
                      const foundAddonsProduct: any = cardData[foundCardIndex];

                      const data = {
                        index: foundCardIndex,
                        item: foundAddonsProduct,
                      };
                      dispatch(setDecrementCartItem(data));

                      setQuantity((pre) => pre - 1);
                    }
                  }}
                >
                  <TouchableOpacity
                    disabled={isDisable}
                    onPress={() => {
                      if (!token) {
                        navigation.navigate("LoginAndSignup");
                        return;
                      }
                      if (quantity != 0) {
                        const foundAddonsProduct: any =
                          cardData[foundCardIndex];

                        const data = {
                          index: foundCardIndex,
                          item: foundAddonsProduct,
                        };
                        dispatch(setDecrementCartItem(data));

                        setQuantity((pre) => pre - 1);
                      }
                    }}
                    style={{
                      ...styles.quantityInner,
                      backgroundColor: isDisable
                        ? theme.colors?.gray
                        : theme.colors.primary,
                    }}
                  >
                    <Image
                      source={icons.minus}
                      resizeMode="contain"
                      style={styles.quantity_icon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      if (isSelectQuantityVisible == item?.id) {
                        setIsSelectQuantityVisible(null);

                        return;
                      }

                      setIsSelectQuantityVisible(item?.id);
                    }}
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: sizeHelper.calWp(25),
                      width: sizeHelper.calWp(90),
                      // backgroundColor:"green",
                      height: sizeHelper.calHp(40),
                      justifyContent: "center",
                    }}
                  >
                    <CustomText
                      text={quantity}
                      fontWeight="600"
                      fontFam={fonts.Poppins_SemiBold}
                      color={theme.colors.secondry}
                      size={isIpad ? 25 : 22}
                    />
                    <Image
                      style={{
                        width: sizeHelper.calWp(25),
                        height: sizeHelper.calWp(25),
                      }}
                      resizeMode="contain"
                      source={icons.down}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  disabled={isDisable}
                  style={styles.quantityMain}
                  onPress={() => {
                    if (!token) {
                      navigation.navigate("LoginAndSignup");
                      return;
                    }
                    const card = mergeDuplicateProducts(cardData);
                    console.log("quantityData", card?.quantity);

                    let stockQuantity =
                      foundCardIndex === -1
                        ? quantity
                        : quantity + card?.quantity;
                    const isQuantity = checkStock(
                      foundCardIndex == -1 ? item : card,
                      stockQuantity
                    );
                    console.log("stockQuantity", stockQuantity);
                    if (isQuantity) {
                      setQuantity((pre) => pre + 1);
                      onAddToCart();
                    }
                  }}
                >
                  <TouchableOpacity
                    style={{
                      ...styles.quantityInner,
                      backgroundColor: isDisable
                        ? theme.colors?.gray
                        : theme.colors.primary,
                    }}
                    disabled={isDisable}
                    onPress={() => {
                      if (!token) {
                        navigation.navigate("LoginAndSignup");
                        return;
                      }
                      const card = mergeDuplicateProducts(cardData);

                      let stockQuantity =
                        foundCardIndex === -1
                          ? quantity
                          : quantity + card?.quantity;
                      const isQuantity = checkStock(
                        foundCardIndex == -1 ? item : card,
                        stockQuantity
                      );
                      console.log("stockQuantity", stockQuantity);
                      if (isQuantity) {
                        setQuantity((pre) => pre + 1);
                        onAddToCart();
                      }
                    }}
                  >
                    <Image
                      source={icons.plus}
                      resizeMode="contain"
                      style={styles.quantity_icon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {isSelectQuantityVisible == item?.id && (
          <View
            style={
              index == data.length - 1
                ? styles.TopQuantityContainer
                : styles.quantityContainer
            }
          >
            <ScrollView
              scrollEnabled={true}
              scrollToOverflowEnabled={true}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {Array.from({ length: 100 }, (_, i) => i + 1).map((it, ind) => {
                return (
                  <TouchableOpacity
                    key={ind.toString()}
                    onPress={() => {
                      if (!token) {
                        navigation.navigate("LoginAndSignup");
                        return;
                      }
                      setIsSelectQuantityVisible(null);
                      const card = mergeDuplicateProducts(cardData);
                      console.log("quantityData", card?.quantity);

                      let stockQuantity =
                        foundCardIndex === -1
                          ? quantity
                          : quantity + card?.quantity;
                      const isQuantity = checkStock(
                        foundCardIndex == -1 ? item : card,
                        stockQuantity
                      );
                      console.log("stockQuantity", stockQuantity);
                      if (isQuantity) {
                        setQuantity(Number(it));
                        onDropDownAddToCart(Number(it));
                      }
                    }}
                    // onPress={() =>
                    //   {

                    //   }
                    //   setIsSelectQuantityVisible(false)}
                    style={{
                      ...styles.InnerQuantity,
                      paddingTop: sizeHelper.calHp(5),
                      borderBottomWidth: 1,
                      alignItems: "center",
                      borderColor: theme.colors.text_gray,
                    }}
                  >
                    <CustomText
                      text={it}
                      fontWeight="600"
                      fontFam={fonts.Poppins_SemiBold}
                      color={theme.colors.text_black}
                      size={20}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
};
export default ProductCard;
const styles = StyleSheet.create({
  img: { width: 23, height: 23 },
  Container: {
    height: sizeHelper.calHp(isIpad ? 200 : Platform.OS == "ios" ? 150 : 165),
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: sizeHelper.calWp(15),
    alignItems: "center",
    gap: sizeHelper.calWp(10),
    borderWidth: 1,
    borderColor: "#F2F2F2",
    overflow: "hidden",
  },
  inputContainer: {
    flex: 1,
    fontSize: sizeHelper.calHp(22),
    fontFamily: fonts.Poppins_Regular,
    padding: 0,
  },
  quantityMain: {
    alignItems: "center",
    justifyContent: "center",
    height: sizeHelper.calWp(55),
    width: sizeHelper.calWp(55),
  },
  quantityInner: {
    height: sizeHelper.calWp(isIpad ? 40 : 50),
    width: sizeHelper.calWp(isIpad ? 40 : 50),
    borderRadius: sizeHelper.calWp(isIpad ? 10 : 13),
    justifyContent: "center",
    alignItems: "center",
  },
  quantity_icon: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },
  quantityContainer: {
    position: "absolute",
    width: "22%",
    backgroundColor: theme.colors.background,
    right: sizeHelper.calWp(50),
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(10),
    bottom: sizeHelper.calHp(-140),
    gap: sizeHelper.calHp(15),
    maxHeight: sizeHelper.calHp(150),
  },
  InnerQuantity: {
    width: "100%",
    paddingBottom: sizeHelper.calHp(5),
    paddingHorizontal: sizeHelper.calWp(15),
    // padding: sizeHelper.calWp(10),
  },

  TopQuantityContainer: {
    position: "absolute",
    width: "22%",
    backgroundColor: theme.colors.background,
    right: sizeHelper.calWp(50),
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(10),
    top: sizeHelper.calHp(-50),
    gap: sizeHelper.calHp(15),
    maxHeight: sizeHelper.calHp(150),
  },
});
