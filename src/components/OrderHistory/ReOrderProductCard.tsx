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
} from "../../utils/CommonHooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartData,
  setCartData,
  setDecrementCartItem,
  setUpdateCartItem,
} from "../../redux/reducers/cartReducer";
import { ApiServices } from "../../api/ApiServices";
import { getToken } from "../../redux/reducers/authReducer";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

const ReOrderProductCard = ({
  item,
  setMessage,
  setIsMessage,
  setSelectedOrderProducts,
  selectedOrderProducts,
  bottomSheetModalRef,
  setIsSelectQuantityVisible,
  isSelectQuantityVisible,
  index,
}: any) => {
  const cardData = useSelector(getCartData);
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const [isFavourit, setIsFavourit] = useState(false);

  const foundCardIndex = cardData.findIndex((it: any) => it?.id === item?.id);
  let cardProduct: any = cardData[foundCardIndex];
  const [quantity, setQuantity] = useState(item?.quantity);
  // useEffect(() => {
  //   setQuantity(cardProduct?.quantity ? cardProduct?.quantity : 0);
  // }, [cardData]);

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

  const onIncrement = () => {
    setSelectedOrderProducts((prevProducts) =>
      prevProducts.map((it) =>
        it.id === item?.id ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  };

  const onDecrement = () => {
    if (item?.quantity == 1) {
      let filterPro = selectedOrderProducts.filter((it) => it?.id != item?.id);
      setSelectedOrderProducts(filterPro);
      if (filterPro.length == 0) {
        bottomSheetModalRef.current.dismiss();
      }
      return;
    }
    setSelectedOrderProducts((prevProducts) =>
      prevProducts.map((it) =>
        it.id === item?.id ? { ...it, quantity: it.quantity - 1 } : it
      )
    );
  };

  return (
    <>
      <View>
        <TouchableOpacity
        activeOpacity={1}
        onPress={()=>setIsSelectQuantityVisible(null)}
          style={[
            {
              ...styles.Container,
            },
          ]}
        >
          <Image
            source={{ uri: item?.image }}
            resizeMode="cover"
            style={{
              width: sizeHelper.calWp(150),
              height: "100%",
              opacity: isDisable ? 0.5 : 1,
            }}
          />
          <View
            style={{
              paddingHorizontal: sizeHelper.calWp(20),
              gap: sizeHelper.calHp(5),
              flex: 1,
              paddingTop: sizeHelper.calHp(10),
            }}
          >
            <View style={{ ...appStyles.rowjustify }}>
              <View>
                <View
                  style={{
                    ...appStyles.row,
                    gap: sizeHelper.calWp(5),
                    width: "80%",
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
                    width: sizeHelper.calWp(380),
                  }}
                  numberOfLines={1}
                  color={theme.colors.gray}
                  size={16}
                />
                {isDisable ? (
                  <CustomText
                    color={"red"}
                    text={"OUT OF STOCK"}
                    size={25}
                    style={{ marginTop: sizeHelper.calHp(10) }}
                  />
                ) : (
                  <>
                    {item?.discounted_price > 0 && (
                      <CustomText
                        text={
                          dollarSymbol +
                          `${Number(
                            item.discounted_price * item?.quantity
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                        }
                        style={{ opacity: isDisable ? 0.5 : 1 }}
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
              }}
            >
              <CustomText
                text={
                  dollarSymbol +
                  `${Number(item.price * item?.quantity).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}`
                }
                style={{ opacity: isDisable ? 0.5 : 1 }}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.secondry}
                size={25}
              />
              <View style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}>
                <TouchableOpacity
                  disabled={isDisable}
                  style={styles.quantityMain}
                  onPress={() => {
                    onDecrement();
                  }}
                >
                  <TouchableOpacity
                    disabled={isDisable}
                    onPress={() => {
                      onDecrement();
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
                    height: sizeHelper.calHp(40),
                    justifyContent: "center",
                  }}
                >
                  <CustomText
                    text={item?.quantity}
                    fontWeight="600"
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.secondry}
                    size={isIpad ? 25 : 20}
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

                <TouchableOpacity
                  disabled={isDisable}
                  style={styles.quantityMain}
                  onPress={() => {
                    const card = mergeDuplicateProducts(cardData);
                    console.log("quantityData", card?.quantity);

                    let stockQuantity =
                      foundCardIndex === -1
                        ? item?.quantity
                        : item?.quantity + card?.quantity;
                    const isQuantity = checkStock(
                      foundCardIndex == -1 ? item : card,
                      stockQuantity
                    );
                    console.log("stockQuantity", stockQuantity);
                    if (isQuantity) {
                      //   setQuantity(pre => pre + 1);
                      onIncrement();

                      //   onAddToCart();
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
                      const card = mergeDuplicateProducts(cardData);
                      let stockQuantity =
                        foundCardIndex === -1
                          ? item?.quantity
                          : item?.quantity + card?.quantity;
                      const isQuantity = checkStock(
                        foundCardIndex == -1 ? item : card,
                        stockQuantity
                      );
                      console.log("stockQuantity", stockQuantity);
                      if (isQuantity) {
                        // setQuantity(pre => pre + 1);
                        onIncrement();

                        // onAddToCart();
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
              index == selectedOrderProducts.length - 1
                ? styles.TopQuantityContainer
                : styles.quantityContainer
            }
          >
            <BottomSheetScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {Array.from({ length: 100 }, (_, i) => i + 1).map((it, ind) => {
                return (
                  <TouchableOpacity
                    key={ind.toString()}
                    onPress={() => {
                      const card = mergeDuplicateProducts(cardData);
                      let stockQuantity =
                        foundCardIndex === -1
                          ? item?.quantity
                          : item?.quantity + card?.quantity;
                      const isQuantity = checkStock(
                        foundCardIndex == -1 ? item : card,
                        stockQuantity
                      );
                      console.log("stockQuantity", stockQuantity);
                      if (isQuantity) {
                        // setQuantity(pre => pre + 1);
                        onIncrement();

                        setSelectedOrderProducts((prevProducts) =>
                          prevProducts.map((itm) =>
                            itm.id === item?.id ? { ...itm, quantity: it } : itm
                          )
                        );
                        setIsSelectQuantityVisible(null);

                        // onAddToCart();
                      }
                    }}
                    // onPress={() => {

                    //   setIsSelectQuantityVisible(null);
                    //   // const card = mergeDuplicateProducts(cardData);
                    //   // console.log("quantityData", card?.quantity);

                    //   // let stockQuantity =
                    //   //   foundCardIndex === -1
                    //   //     ? quantity
                    //   //     : quantity + card?.quantity;
                    //   // const isQuantity = checkStock(
                    //   //   foundCardIndex == -1 ? item : card,
                    //   //   stockQuantity
                    //   // );
                    //   // console.log("stockQuantity", stockQuantity);
                    //   // if (isQuantity) {
                    //   //   setQuantity(Number(it));
                    //   //   onDropDownAddToCart(Number(it));
                    //   // }
                    // }}

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
            </BottomSheetScrollView>
          </View>
        )}
      </View>
    </>
  );
};
export default ReOrderProductCard;
const styles = StyleSheet.create({
  img: { width: 23, height: 23 },
  Container: {
    height: sizeHelper.calHp(isIpad ? 200 : Platform.OS == "ios" ? 170 : 180),
    width: "100%",
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
    height: sizeHelper.calWp(isIpad ? 45 : 50),
    width: sizeHelper.calWp(isIpad ? 45 : 50),
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
  InnerQuantity: {
    width: "100%",
    paddingBottom: sizeHelper.calHp(5),
    paddingHorizontal: sizeHelper.calWp(15),
    //
  },
});
