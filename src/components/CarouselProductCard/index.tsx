import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import sizeHelper, { screenWidth, screentHeight } from "../../utils/Helpers";
import { fonts } from "../../utils/Themes/fonts";
import { theme } from "../../utils/Themes";
import icons from "../../utils/Constants/icons";
import CustomText from "../Text";
import { appStyles } from "../../utils/GlobalStyles";
import { useEffect, useState } from "react";
import {
  getCartData,
  setCartData,
  setDecrementCartItem,
  setUpdateCartItem,
  setUpdateDropDownCartItem,
} from "../../redux/reducers/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  dollarSymbol,
  generateUniqueIdGenerator,
  isIpad,
} from "../../utils/CommonHooks";
import { getToken } from "../../redux/reducers/authReducer";
import { useNavigation } from "@react-navigation/native";

const CarouselProductCard = ({
  item,
  setIsSelectQuantityVisible,
  isSelectQuantityVisible,
}: any) => {
  const cardData = useSelector(getCartData);
  const token = useSelector(getToken);
  const navigation: any = useNavigation();

  const dispatch = useDispatch();
  const foundCardIndex = cardData.findIndex((it: any) => it?.id === item?.id);
  let cardProduct: any = cardData[foundCardIndex];
  const [quantity, setQuantity] = useState(
    cardProduct?.quantity ? cardProduct?.quantity : 0
  );

  let isDisable =
    item?.data?.product_sold_out !== "available" ||
    (item?.data &&
      item?.data?.stock_control === 1 &&
      item?.data?.stock_quantity === 0);

  useEffect(() => {
    setQuantity(cardProduct?.quantity ? cardProduct?.quantity : 0);
  }, [cardData]);

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
    console.log("CartObject", obj);

    const foundAddonsProduct: any = cardData[foundCardIndex];
    console.log("foundAddonsProduct", foundAddonsProduct);

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
    console.log("CartObject", obj);

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

  return (
    <>
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsSelectQuantityVisible(null)}
          style={[
            {
              ...styles.Container,
              height: isIpad
                ? screentHeight / 3
                : token
                ? screentHeight / 3.7
                : screentHeight / 4,
            },
          ]}
        >
          <Image
            source={{ uri: item?.image }}
            resizeMode="cover"
            style={{
              width: "100%",
              height: sizeHelper.calHp(isIpad ? 270 : 200),
              opacity: isDisable ? 0.5 : 1,
            }}
          />
          <View
            style={{
              padding: sizeHelper.calWp(10),
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <View style={{ height: sizeHelper.calHp(token ? 80 : 60) }}>
              <View style={{ ...appStyles.row, gap: sizeHelper.calWp(5) }}>
                <CustomText
                  text={item?.name}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={18}
                  style={{ opacity: isDisable ? 0.5 : 1 }}
                  numberOfLines={1}
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
                  width: sizeHelper.calWp(260),
                }}
                numberOfLines={1}
                color={theme.colors.gray}
                size={16}
              />
              {isDisable ? (
                <CustomText
                  color={"red"}
                  text={"OUT OF STOCK"}
                  size={19}
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

            <View
              style={{
                ...appStyles.rowjustify,
                // gap: sizeHelper.calWp(10),
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
                  size={20}
                />
              ) : (
                <CustomText
                  color={"red"}
                  text={"Login for Price"}
                  size={12}
                  style={{ marginTop: sizeHelper.calHp(10) }}
                />
              )}

              <View style={{ ...appStyles.row, gap: sizeHelper.calWp(5) }}>
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
                    style={{
                      ...styles.quantityInner,
                      backgroundColor: isDisable
                        ? theme.colors?.gray
                        : theme.colors.primary,
                    }}
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
                  >
                    <Image
                      source={icons.minus}
                      resizeMode="contain"
                      style={styles.quantity_icon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

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
                    gap: sizeHelper.calWp(20),
                    width: sizeHelper.calWp(70),
                    height: sizeHelper.calHp(40),
                    justifyContent: "center",
                  }}
                >
                  <CustomText
                    text={quantity}
                    fontWeight="600"
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.secondry}
                    size={isIpad ? 25 : 19}
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
                {/* <View
                style={{
                  alignItems: "center",
                  paddingHorizontal: sizeHelper.calWp(6),
                }}
              >
                <CustomText
                  text={quantity}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={isIpad ? 25 : 20}
                />
              </View> */}

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
          <Animated.View style={styles.quantityContainer}>
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
          </Animated.View>
        )}
      </View>
    </>
  );
};
export default CarouselProductCard;

const styles = StyleSheet.create({
  img: { width: 23, height: 23 },

  Container: {
    width: screenWidth / 2.4,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    overflow: "hidden",
    backgroundColor: theme.colors.white,
    borderRadius: sizeHelper.calWp(15),
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
    height: sizeHelper.calWp(50),
    width: sizeHelper.calWp(50),
  },
  quantityInner: {
    height: sizeHelper.calWp(isIpad ? 40 : 43),
    width: sizeHelper.calWp(isIpad ? 40 : 43),
    backgroundColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(isIpad ? 10 : 11),
    justifyContent: "center",
    alignItems: "center",
  },
  quantity_icon: {
    width: sizeHelper.calWp(23),
    height: sizeHelper.calWp(23),
  },

  quantityContainer: {
    position: "absolute",
    width: "40%",
    backgroundColor: theme.colors.background,
    right: sizeHelper.calWp(40),
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(10),
    bottom: sizeHelper.calHp(55),
    gap: sizeHelper.calHp(15),
    maxHeight: sizeHelper.calHp(150),
  },
  InnerQuantity: {
    width: "100%",
    paddingBottom: sizeHelper.calHp(5),
    paddingHorizontal: sizeHelper.calWp(15),
    // padding: sizeHelper.calWp(10),
  },
});
