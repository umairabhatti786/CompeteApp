import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Platform,
  Linking,
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
  setCartData,
  setDecrementCartItem,
  setIncrementCartItem,
  setTotalCartAmount,
  setUpdateCartItem,
} from "../../../redux/reducers/cartReducer";
import CartItem from "../../../components/Cart/CartItem";
import { useIsFocused } from "@react-navigation/native";
import {
  convertToUTC,
  dollarSymbol,
  formatToUTC,
  getOrderStatus,
  isIpad,
  sessionCheck,
} from "../../../utils/CommonHooks";
import DateModal from "../../../components/Cart/DateModal";
import moment, { months } from "moment";
import EmptyCart from "../../../components/Cart/EmptyCart";
import OrderHistoryProductCard from "../../../components/OrderHistory/OrderHistoryProductCard";
import { orderHistoryProductData } from "../../../utils/Data";
import ProductCard from "../../../components/ProductCard";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import { getToken } from "../../../redux/reducers/authReducer";
import { ApiServices } from "../../../api/ApiServices";
import ReOrderProductCard from "../../../components/OrderHistory/ReOrderProductCard";
import { OrderHistoryDetailLayout } from "../../../utils/Layouts/OrderHistoryDetailLayout";
import CustomToast from "../../../components/CustomToast";
import RNFS from "react-native-fs";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import { generateFilePath } from "react-native-compressor";
import { generatePdfContent } from "../../../utils/PdfFormat";
import FileViewer from "react-native-file-viewer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const OrderHistoryDetail = ({ navigation, route }: any) => {
  const detail: any = route?.params?.detail;
  const [selectedCategory, setSelectedCategory] = useState(2);
  const totalCartAmount = useSelector(getTotalCartAmount);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [isSelectQuantityVisible, setIsSelectQuantityVisible] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const focused = useIsFocused();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedOrderProducts, setSelectedOrderProducts] = useState<any>([]);
  // const snapToPoints = ["80%", "85%", "95%"];
  const snapToPoints = useMemo(() => ["50%", "90%"], []);

  const bottomSheetModalRef = useRef<any>(null);
  const token = useSelector(getToken);
  const [loading, setLoading] = useState(true);
  const [orderDetailData, setOrderDetail] = useState<any>();
  const cardData = useSelector(getCartData);

  const { status, status_color } = getOrderStatus(orderDetailData?.status);
  console.log("selectedOrderProducts", orderDetailData);
  const cartData = useSelector(getCartData);

  let disableProduct = selectedOrderProducts.filter(
    (data: any, index: string) =>
      data?.data?.product_sold_out !== "available" ||
      (data?.data &&
        data?.data?.stock_control === 1 &&
        data?.data?.stock_quantity === 0)
  );

  useEffect(() => {
    getCartDetail();
    getOrderDetailData();
  }, [focused]);

  const getOrderDetailData = () => {
    let param = {
      token: token,

      id: detail?.id,
    };
    ApiServices.GetOrderDetail(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        console.log("response", response);
        if (response?.success) {
          setOrderDetail(response?.data?.orderDetails);
          setLoading(false);
        } else {
          console.log("errocdcdr", response);
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
      }
    });
  };
  const getCartDetail = () => {
    if (cartData.length > 0) {
      let currentTotal = cartData?.reduce(
        (accumulator, current: any) =>
          accumulator + parseFloat(current?.priceByQty),
        0.0
      );
      dispatch(setTotalCartAmount(currentTotal));
    }
  };

  const captureViewAndCreatePDF = async () => {
    try {
      // Generate HTML content (you would replace this with your actual content)
      const htmlContent = generatePdfContent(orderDetailData);

      // Create the PDF
      const pdfPath = await createPDF(htmlContent);
      console.log("Generated PDF Path:", pdfPath);
      const randomNum = Math.floor(Math.random() * 10000); // Generates a number between 0 and 999999

      if (Platform.OS == "android") {
        // Move the PDF to the Downloads directory
        const newPdfPath = `${RNFS.DownloadDirectoryPath}/Droian${randomNum}-${orderDetailData?.id}.pdf`;
        await RNFS.moveFile(pdfPath, newPdfPath);
        setMessage("PDF has been downloaded");
        // openPDF(newPdfPath)
        setIsMessage(true);
        console.log("newPdfPath", newPdfPath);
        setTimeout(async () => {
          // Linking.openURL(`file://${pdfPath}`);

          openPDF(newPdfPath);
        }, 1000);
      } else {
        const fileName = `Dorian${randomNum}#${orderDetailData?.id}.pdf`;

        const newPdfPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
        await RNFS.moveFile(pdfPath, newPdfPath);

        // Check if the file exists before sharing
        const fileExists = await RNFS.exists(newPdfPath);
        if (!fileExists) {
          throw new Error("File does not exist at path: " + newPdfPath);
        }
        setTimeout(async () => {
          openPDF(newPdfPath);
        }, 1000);
        // Open the share dialog
        // Prepare for sharing/saving the PDF
        const shareOptions = {
          title: "Save PDF",
          url: newPdfPath, // Use file:// prefix for local files
          type: "application/pdf",
          // Optionally use saveToFiles: true for saving to the Files app
          // saveToFiles: true,
          // failOnCancel: true,
        };

        // Open the share dialog
        Share.open(shareOptions)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.error("Error capturing view and creating PDF:", error);
      // Alert.alert("Error", "There was an issue creating the PDF");
    }
  };

  const createPDF = async (htmlContent: any) => {
    const options = {
      html: htmlContent,
      fileName: "DorianOrderPdf", // Name of the PDF file
      directory: "Documents", // Save it in the app's document directory
      padding: 0,
      bgColor: "#FFFFFF",
    };

    const file = await RNHTMLtoPDF.convert(options);
    return file.filePath;
  };
  const openPDF = (pdfPath: any) => {
    FileViewer.open(pdfPath, {
      showOpenWithDialog: true,
      displayName: "My PDF",
    })
      .then(() => {
        console.log("PDF opened successfully");
      })
      .catch((error) => {
        console.error("Error opening PDF:", error);
        Alert.alert("Error", "Unable to open the PDF.");
      });
  };

  const showPdf = () => {
    if (
      moment().diff(moment(orderDetailData?.created_at), "hours") >= 24 &&
      (orderDetailData?.status == "4" || orderDetailData?.status == "5")
    ) {
      return true;
    } else {
      return false;
    }
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

  const Header = ({ title }: any) => {
    return (
      <>
        <View
          style={{
            ...appStyles.rowjustify,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: sizeHelper.calWp(60),
              height: sizeHelper.calWp(60),
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
          <CustomText
            text={`ORDER NO #${orderDetailData?.id}`}
            fontWeight="600"
            style={{ marginLeft: sizeHelper.calWp(30) }}
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={25}
          />
          <CustomText text={status} color={status_color} size={22} />
        </View>
      </>
    );
  };

  const mergeDuplicateProducts = () => {
    const productMap: any = {};
    const combineProduct = [...selectedOrderProducts, ...cartData];

    combineProduct?.forEach((item: any) => {
      const productId = item.id;

      if (productMap[productId]) {
        productMap[productId].quantity += item.quantity;
        // Optionally merge other properties if needed, like `addons`, etc.
      } else {
        productMap[productId] = { ...item };
      }
    });

    // Convert the map back to an array
    const uniqueCartData = Object.values(productMap);
    return uniqueCartData;
  };

  const onAddCartProduct = () => {
    let hasStockIssue = false;

    const dataCard = mergeDuplicateProducts();
    console.log("cknck", dataCard);
    dataCard.forEach((it: any, index) => {
      if (it?.data?.stock_control == 1) {
        if (it?.quantity > Number(it?.data.stock_quantity)) {
          hasStockIssue = true;

          Alert.alert(
            `${it?.name} Stock Limit Exceeded`,
            `You can only add up to ${it?.data.stock_quantity} items to your cart.`,

            [
              {
                text: `Ok`,
              },
            ]
          );
        }
      }
    });
    if (!hasStockIssue) {
      let cart: any[] = selectedOrderProducts.filter(
        (data: any, index: string) =>
          data?.data?.product_sold_out == "available" &&
          ((data?.data && data?.data?.stock_control == 0) ||
            (data?.data?.stock_control == 1 &&
              data?.data?.quantity < Number(data?.data?.stock_quantity)))
      );
      cart = cart.map((data: any, index: number) => {
        return {
          ...data,
          data: {
            ...data.data,
            payment_service: "disabled",
            payment_service_price: 0,
            payment_service_details: {},
          },
          priceByQty: parseFloat(data?.price) * data?.quantity,
          quantity: data?.quantity,
          price: parseFloat(data?.price),
        };
      });

      cart.forEach((item) => {
        const foundCardIndex = cardData.findIndex(
          (it: any) => it?.id === item?.id
        );

        const foundAddonsProduct: any = cardData[foundCardIndex];
        if (foundCardIndex != -1) {
          if (foundAddonsProduct) {
            const data = {
              product: item,
              index: foundCardIndex,
              quantity: item?.quantity + foundAddonsProduct?.quantity,
            };
            dispatch(setUpdateCartItem(data));
          } else {
            dispatch(setCartData(item));
          }
        } else {
          dispatch(setCartData(item));
        }
      });
      // console.log("cart",cart)

      // const foundAddonsProduct: any = cardData[foundCardIndex];

      // if (foundCardIndex != -1) {
      //   if (foundAddonsProduct) {
      //     const data = {
      //       product: obj,
      //       index: foundCardIndex,
      //       quantity: obj?.quantity + foundAddonsProduct?.quantity,
      //     };
      //     dispatch(setUpdateCartItem(data));
      //   } else {
      //     dispatch(setCartData(obj));
      //   }
      // } else {
      //   dispatch(setCartData(obj));
      // }

      // checkDisable();
      // cart.forEach(item => {
      //   console.log('ckdbcd', item);
      //   dispatch(setCartData(item));
      // });

      bottomSheetModalRef?.current?.dismiss();
      setTimeout(() => {
        setMessage("Products added to cart");
        setIsMessage(true);
      }, 500);
      // setTimeout(() => {
      //   navigation.goBack();
      // }, 1500);
    }
  };

  const onAddToCart = () => {
    if (disableProduct.length > 0) {
      if (disableProduct.length == 1 && selectedOrderProducts.length == 1) {
        Alert.alert(
          "",
          `Your ${disableProduct[0]?.name} product is not available now.`,
          [
            {
              text: `Ok`,
              onPress: () => bottomSheetModalRef.current.dismiss(),
              style: "cancel",
            },
          ]
        );
      } else {
        const disabledProductNames = disableProduct
          ?.map((product: any) => product?.name)
          .join(", ");

        Alert.alert(
          "",
          `Your ${disabledProductNames} product is not available. The remaining products will be added to your cart. Do you wish to proceed? `,
          [
            {
              text: `Yes`,
              onPress: () => onAddCartProduct(),
              // style: "cancel",
            },
            {
              text: `No`,
              onPress: () => bottomSheetModalRef.current.dismiss(),
              style: "destructive",
            },
          ]
        );
      }

      return;
    }
    onAddCartProduct();
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          gap: sizeHelper.calWp(25),
          paddingTop: sizeHelper.calHp(
            isIpad ? 20 : Platform.OS == "ios" ? 0 : 20
          ),
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
        }}
      >
        {loading ? (
          <View style={{ flex: 1 }}>
            <OrderHistoryDetailLayout />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Header />

            <View style={{ flex: 1, marginBottom: sizeHelper.calHp(20) }}>
              <FlatList
                data={detail?.products}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => {
                  return (
                    <View
                      style={{
                        gap: sizeHelper.calWp(15),
                      }}
                    >
                      <View style={appStyles.rowjustify}>
                        <CustomText
                          text={`Created Date: `}
                          color={theme.colors.secondry}
                          size={22}
                        />
                        <CustomText
                          text={`${moment(orderDetailData?.created_at).format(
                            "DD-MM-YYYY"
                          )}`}
                          color={theme.colors.secondry}
                          size={22}
                        />
                      </View>

                      <View style={appStyles.rowjustify}>
                        <CustomText
                          text={`Order Date: `}
                          color={theme.colors.secondry}
                          size={22}
                        />
                        <CustomText
                          text={`${moment(
                            orderDetailData?.is_preorder_data?.date
                          ).format("DD-MM-YYYY")}`}
                          color={theme.colors.secondry}
                          size={22}
                        />
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          gap: sizeHelper.calWp(20),
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{
                            width: sizeHelper.calWp(20),
                            height: sizeHelper.calWp(20),
                          }}
                          source={icons.address}
                        />
                        <CustomText
                          text={
                            orderDetailData?.customer?.data?.address
                              ? `${orderDetailData?.customer?.data?.address}`
                              : "N/A"
                          }
                          fontWeight="600"
                          fontFam={fonts.Poppins_Medium}
                          size={22}
                        />
                      </View>

                      <CustomText
                        text={"Products"}
                        fontWeight="600"
                        fontFam={fonts.Poppins_SemiBold}
                        color={theme.colors.secondry}
                        size={22}
                      />
                    </View>
                  );
                }}
                contentContainerStyle={{
                  gap: sizeHelper.calWp(20),
                  paddingVertical: sizeHelper.calHp(10),
                }}
                renderItem={({ item, index }: any) => {
                  const isSelected = selectedOrderProducts.some(
                    (p: any) => p.id === item.id
                  );

                  return (
                    <>
                      <OrderHistoryProductCard
                        orderStatus={
                          orderDetailData?.status == "0" ||
                          orderDetailData?.status == "0"
                        }
                        isSelected={isSelected}
                        onPress={() => {
                          const productIndex = selectedOrderProducts.findIndex(
                            (it: any) => it?.id === item?.id
                          );

                          if (productIndex === -1) {
                            // Add the product
                            setSelectedOrderProducts([
                              ...selectedOrderProducts,
                              item,
                            ]);
                          } else {
                            // Remove the product
                            const filtered = selectedOrderProducts.filter(
                              (it: any) => it?.id !== item?.id
                            );
                            setSelectedOrderProducts(filtered);
                          }
                        }}
                        item={item}
                      />
                    </>
                  );
                }}
              />
            </View>
            {showPdf() && (
              <>
                <View style={styles.separator} />
                <TouchableOpacity
                  onPress={captureViewAndCreatePDF}
                  style={{
                    ...appStyles.rowjustify,
                    paddingVertical: sizeHelper.calHp(10),
                  }}
                >
                  <CustomText
                    text={"Download PDF"}
                    fontWeight="600"
                    style={{ marginTop: sizeHelper.calHp(20) }}
                    fontFam={fonts.Poppins_SemiBold}
                    color={theme.colors.secondry}
                    size={22}
                  />

                  <TouchableOpacity
                    onPress={captureViewAndCreatePDF}
                    style={styles.box}
                  >
                    <Image
                      style={{
                        width: "45%",
                        height: "45%",
                        resizeMode: "contain",
                      }}
                      source={icons.pdf_download}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              </>
            )}
            {orderDetailData?.notes && (
              <View>
                <CustomText
                  text={"Delivery Note"}
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.secondry}
                  size={22}
                />
                <CustomText
                  style={{ marginBottom: sizeHelper.calHp(20) }}
                  text={orderDetailData?.notes}
                  color={theme.colors.text_black}
                  size={20}
                />
              </View>
            )}

            <View
              style={{
                gap: sizeHelper.calHp(20),
                marginBottom: sizeHelper.calHp(30),
                borderTopWidth: 1,
                borderTopColor: theme.colors.gray,
              }}
            >
              <CustomText
                text={"Bill Details"}
                fontWeight="600"
                style={{ marginTop: sizeHelper.calHp(20) }}
                fontFam={fonts.Poppins_SemiBold}
                color={theme.colors.secondry}
                size={22}
              />
              <CartDetail
                title={"Subtotal"}
                label={
                  dollarSymbol +
                  (typeof orderDetailData?.values?.subtotal === "number"
                    ? orderDetailData.values.subtotal.toFixed(2)
                    : orderDetailData?.values?.subtotal)
                }
              />
              <CartDetail
                title={"VAT"}
                label={`${
                  dollarSymbol +
                  parseFloat(orderDetailData?.values?.tax || 0).toFixed(2)
                }`}
              />
              {orderDetailData?.values?.delivery_charges > 0 && (
                <CartDetail
                  title={"Delivery Charges"}
                  label={`${
                    dollarSymbol +
                    parseFloat(
                      orderDetailData?.values?.delivery_charges || 0
                    ).toFixed(2)
                  }`}
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
                  text={
                    dollarSymbol +
                    `${orderDetailData?.total?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                  fontWeight="600"
                  fontFam={fonts.Poppins_SemiBold}
                  color={theme.colors.primary}
                  size={30}
                />
              </View>
              {orderDetailData?.status == "4" && (
                <CustomButton
                  disable={selectedOrderProducts.length == 0}
                  style={{ marginTop: sizeHelper.calHp(30) }}
                  bgColor={
                    selectedOrderProducts?.length == 0
                      ? theme.colors.text_gray
                      : theme.colors.primary
                  }
                  onPress={() => bottomSheetModalRef.current.present()}
                  text="Select Item To Reorder"
                />
              )}
              {orderDetailData?.status == "0" && (
                <CustomButton
                  disable={selectedOrderProducts.length == 0}
                  style={{ marginTop: sizeHelper.calHp(30) }}
                  bgColor={
                    selectedOrderProducts?.length == 0
                      ? theme.colors.text_gray
                      : theme.colors.primary
                  }
                  onPress={() => bottomSheetModalRef.current.present()}
                  text="Select Item To Reorder"
                />
              )}
            </View>
          </View>
        )}
      </ScreenLayout>

      <DateModal
        onConfirmDate={(date: any, scheduleDate: any) => {
          setDeliveryDate(convertToUTC(date));
        }}
        currentDate={new Date().getDate() + 1}
        modalVisible={isDateModalVisible}
        setModalVisible={setIsDateModalVisible}
      />

      <CustomBottomSheet
        snap={snapToPoints}
        setIsSelectQuantityVisible={setIsSelectQuantityVisible}
        bottomSheetModalRef={bottomSheetModalRef}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: sizeHelper.calWp(40), flex: 1 }}>
            <FlatList
              data={selectedOrderProducts}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEnabled={true}
             
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
             
                paddingVertical: sizeHelper.calHp(
                  selectedOrderProducts.length == 1 ? 50 : 10
                ),
              }}
              renderItem={({ item, index }: any) => {
                return (
                  <>
                    <ReOrderProductCard
                      index={index}
                      setIsSelectQuantityVisible={setIsSelectQuantityVisible}
                      isSelectQuantityVisible={isSelectQuantityVisible}
                      bottomSheetModalRef={bottomSheetModalRef}
                      setSelectedOrderProducts={setSelectedOrderProducts}
                      selectedOrderProducts={selectedOrderProducts}
                      item={item}
                    />
                  </>
                );
              }}
            />

            <CustomButton
              style={{ marginTop: sizeHelper.calHp(50) }}
              disable={selectedOrderProducts.length == 0}
              bgColor={
                selectedOrderProducts?.length == 0
                  ? theme.colors.text_gray
                  : theme.colors.primary
              }
              onPress={() => {
                onAddToCart();
                setIsSelectQuantityVisible(null);
              }}
              text="Add to cart"
            />

            <CustomButton
              style={{ marginTop: sizeHelper.calHp(30) }}
              onPress={() => {
                setIsSelectQuantityVisible(null);
                bottomSheetModalRef.current.dismiss();
              }}
              text="Cancel"
              bgColor={"transparent"}
              borderWidth={1}
              textColor={theme.colors.primary}
              borderColor={theme.colors.text_gray}
            />
          </View>
        </GestureHandlerRootView>
      </CustomBottomSheet>

      <CustomToast
        isVisable={isMessage}
        setIsVisable={setIsMessage}
        message={message}
      />
    </>
  );
};

export default OrderHistoryDetail;

const styles = StyleSheet.create({
  botttom: {
    width: "100%",
    position: "absolute",
    bottom: sizeHelper.calHp(50),
    alignItems: "center",
  },
  box: {
    height: sizeHelper.calHp(75),
    width: sizeHelper.calHp(75),
    borderRadius: sizeHelper.calWp(75),
    backgroundColor: "#B7EFC543",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  separator: {
    height: 1.2,
    backgroundColor: theme.colors.gray,
    width: "100%",
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
