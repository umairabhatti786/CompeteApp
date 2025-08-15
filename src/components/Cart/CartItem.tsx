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
import { ApiServices } from "../../api/ApiServices";
const CartItem = ({
  item,
  onIncrementCart,
  onDecrementCart,
  setIsMessage,
  setMessage,
  setToastColor,
  token,
  isFavorite,
  setIsSelectQuantityVisible,
  isSelectQuantityVisible,
  onDropDownIcrementCart,
  data,
  index
}: any) => {
  const [isFavourit, setIsFavourit] = useState(item?.is_favorite);

  useEffect(() => {
    setIsFavourit(item?.is_favorite);
  }, [item]);

  let isDisable =
    item?.data?.product_sold_out !== "available" ||
    (item?.data &&
      item?.data?.stock_control === 1 &&
      item?.data?.stock_quantity === 0);

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
          if (result?.success) {
            if (isFavorite) {
              setToastColor(theme.colors.primary);

              setMessage("Product remove from favourits");
              setIsMessage(true);
            } else {
              setToastColor(theme.colors.primary);
              setIsMessage(true);
              setMessage(result?.message);
              setIsFavourit(isFavourit ? false : true);
            }
          } else {
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
                    width: sizeHelper.calWp(380),
                  }}
                  numberOfLines={1}
                  color={theme.colors.gray}
                  size={isIpad ? 18 : 16}
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
                  `${
                    item?.priceByQty
                      ? Number(item?.priceByQty)?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0"
                  }`
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
                  onPress={onDecrementCart}
                >
                  <TouchableOpacity
                    disabled={isDisable}
                    onPress={onDecrementCart}
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
                      text={item?.quantity}
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
                {/* <View
                style={{
                  alignItems: 'center',
                  paddingHorizontal: sizeHelper.calWp(6),
                }}>
                <CustomText
                  text={item?.quantity}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={isIpad?25: 20}
                />
              </View> */}

                <TouchableOpacity
                  disabled={isDisable}
                  style={styles.quantityMain}
                  onPress={onIncrementCart}
                >
                  <TouchableOpacity
                    style={{
                      ...styles.quantityInner,
                      backgroundColor: isDisable
                        ? theme.colors?.gray
                        : theme.colors.primary,
                    }}
                    disabled={isDisable}
                    onPress={onIncrementCart}
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
          <View style={  index == data.length - 1?styles.topQuantityContainer: styles.quantityContainer}>
            <ScrollView showsVerticalScrollIndicator={false}
               scrollEnabled={true}
               scrollToOverflowEnabled={true}
               nestedScrollEnabled={true}
            >
              {Array.from({ length: 100 }, (_, i) => i + 1).map((it, ind) => {
                return (
                  <TouchableOpacity
                  key={ind.toString()}
                    style={{
                      ...styles.InnerQuantity,
                      paddingTop: sizeHelper.calHp(5),
                      borderBottomWidth: 1,
                      alignItems: "center",
                      borderColor: theme.colors.text_gray,
                    }}
                    onPress={() => {
                      onDropDownIcrementCart(it);
                      setIsSelectQuantityVisible(null)
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
export default CartItem;
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
    width: "20%",
    backgroundColor: theme.colors.background,
    right: sizeHelper.calWp(60),
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(10),
    bottom: sizeHelper.calHp(-130),
    gap: sizeHelper.calHp(15),
    maxHeight: sizeHelper.calHp(150),
  },

  topQuantityContainer: {
    position: "absolute",
    width: "20%",
    backgroundColor: theme.colors.background,
    right: sizeHelper.calWp(60),
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
    // padding: sizeHelper.calWp(10),
  },
});
