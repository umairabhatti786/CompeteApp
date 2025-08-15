import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Keyboard,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomText from "../../../components/Text";
import { fonts } from "../../../utils/Themes/fonts";
import { theme } from "../../../utils/Themes";
import { appStyles } from "../../../utils/GlobalStyles";
import icons from "../../../utils/Constants/icons";
import OrderHistoryCard from "../../../components/OrderHistory/OrderHistoryCard";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import { orderHistoryProductData } from "../../../utils/Data";
import ProductCard from "../../../components/ProductCard";
import CustomButton from "../../../components/Button";
import { ApiServices } from "../../../api/ApiServices";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../../redux/reducers/authReducer";
import { ViewAllProductLayout } from "../../../utils/Layouts/ViewAllProductLayout";
import { OrderHistoryLayout } from "../../../utils/Layouts/OrderHistoryLayout";
import { isIpad, sessionCheck } from "../../../utils/CommonHooks";

const OrderHistoryScreen = ({ navigation }: any) => {
  const [page, setPage] = useState(1);
  const [orderHistoryData, setOrderHistoryData] = useState<any>([]);
  const token = useSelector(getToken);
  const [loading, setLoading] = useState(false);
  const [isActionVisible, setIsActionVisible] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // Flag to indicate if more data is available
  const [isMoreDataLoading, setIsMoreDataLoading] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getProductData("0");
  }, []);

  const getProductData = (status: any) => {
    setLoading(true)
    let param = {
      token: token,
      page: 1,
      order_status: status
    };
    ApiServices.GetOrderHoistory(
      param,
      async ({ isSuccess, response }: any) => {
        if (isSuccess) {
          console.log("OrderResposen", response);
          if (response?.success) {
            setPage(2);
            setLoading(false);
            setIsRefreshing(false);
            setLoading(false);

            setOrderHistoryData(response?.data);
            if (response?.data.length >= 10) {
              setHasMoreData(true);
            } else {
              setHasMoreData(false);
            }
          } else {
            setLoading(false);
            setIsRefreshing(false);

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
            console.log("errocdcdr", response);
          }
        } else {
          setLoading(false);
        }
      }
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getProductData("");
  };
  const FilterCard = ({ onPress, title, color, hideLine }: any) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          ...styles.actionInner,
          paddingTop: sizeHelper.calHp(10),
          borderBottomWidth: hideLine || 1,
        }}
      >
        <CustomText
          text={title}
          // style={{textAlign:"center"}}
          color={color || theme.colors.inProgress}
          size={22}
        />
      </TouchableOpacity>
    );
  };
  const Header = ({ title }: any) => {
    return (
      <>
        <View>
          <View
            style={{
              ...appStyles.rowjustify,
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
            <CustomText
              text={"Order History"}
              fontWeight="600"
              style={{ marginLeft: sizeHelper.calWp(-20) }}
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.secondry}
              size={25}
            />
            <TouchableOpacity
              onPress={() => setIsActionVisible(!isActionVisible)}
              style={{ ...appStyles.row, gap: sizeHelper.calWp(10) }}
            >
              <CustomText
                text={"Sort"}
                color={theme.colors.secondry}
                size={22}
              />
              <Image
                style={{
                  width: sizeHelper.calWp(30),
                  height: sizeHelper.calWp(30),
                  resizeMode: "contain",
                  tintColor: theme.colors.secondry,
                }}
                source={icons.down}
              />
            </TouchableOpacity>
          </View>

          {isActionVisible && (
            <View style={styles.actionContainer}>
              <FilterCard
                color="#FFC400"
                onPress={() => {
                  setFilter("0");
                  setIsActionVisible(false);
                  getProductData("0");
                }}
                title="Pending"
              />
              <FilterCard
                color="#10451D"
                onPress={() => {
                  setFilter("1");
                  setIsActionVisible(false);
                  getProductData("1");

                }}
                title="Accepted"
              />
              <FilterCard
                color="#2DC653"
                onPress={() => {
                  setFilter("2");
                  setIsActionVisible(false);
                  getProductData("2");

                }}
                title="Processing"
              />
              <FilterCard
                color="#404040"
                onPress={() => {
                  setFilter("3");
                  setIsActionVisible(false);
                  getProductData("3");

                }}
                title="Shipped"
              />

              <FilterCard
                color="#2DC653"
                onPress={() => {
                  setFilter("4");
                  setIsActionVisible(false);
                  getProductData("4");

                }}
                title="Delivered"
              />
              <FilterCard
                color="#FF0000"
                onPress={() => {
                  setFilter("5");
                  setIsActionVisible(false);
                  getProductData("5");

                }}
                title="Cancelled"
              />
              <FilterCard
                color="#000000"
                hideLine={-1}
                onPress={() => {
                  setFilter("");
                  setIsActionVisible(false);
                  getProductData("");

                }}
                title="Reset"
              />
            </View>
          )}
        </View>
      </>
    );
  };

  const onEndReached = () => {
    setIsMoreDataLoading(true);
    let param = {
      token: token,
      page: page,
      order_status: filter,
    };

    ApiServices.GetOrderHoistory(
      param,
      async ({ isSuccess, response }: any) => {
        if (isSuccess) {
          console.log("OrderResposen", response);
          if (response?.success) {
            setLoading(false);

            setPage(page + 1);
            setIsMoreDataLoading(false);

            if (response?.data.length < 10) {
              setHasMoreData(false);
            }
            setOrderHistoryData((prevData) => {
              return [...prevData, ...response?.data];
            });
          } else {
            console.log("errocdcdr", response);
            setLoading(false);
            setIsRefreshing(false);
            setIsMoreDataLoading(false);
            setMessage(response?.message);
            setIsMessage(true);
          }
        } else {
          setLoading(false);
          setIsMoreDataLoading(false);
          setHasMoreData(false);
          setIsMessage(true);
          setMessage("Something went wrong");
        }
      }
    );

    // ApiServices.GetProducts(param, async ({ isSuccess, response }: any) => {
    //   if (isSuccess) {
    //     console.log("response", response?.data?.products.length);
    //     if (response?.success) {
    //       setPage(page + 1);
    //       setIsMoreDataLoading(false);

    //       if (response?.data?.products.length <= 10) {
    //         setHasMoreData(false);
    //       }
    //       setProducts((prevData) => {
    //         return [...prevData, ...response?.data?.products];
    //       });
    //     } else {
    //       setIsMoreDataLoading(false);
    //       setMessage(response?.message);
    //       setIsMessage(true);

    //       console.log("errocdcdr", response);
    //     }
    //   } else {
    //     setIsMoreDataLoading(false);
    //     setHasMoreData(false);
    //     setIsMessage(true);
    //     setMessage("Something went wrong");
    //   }
    // });
  };

  const renderFooter = () => {
    if (!isMoreDataLoading) return null;
    return (
      <View
        style={{ marginVertical: sizeHelper.calHp(10), alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };
  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          // gap: sizeHelper.calWp(25),
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
          paddingTop: sizeHelper.calHp(10),
        }}
      >
        <View
          // onPress={() => setIsActionVisible(false)}
          // activeOpacity={1}
          style={{
            flex: 1,
            // gap: sizeHelper.calWp(25),
          }}
        >
          <Header />
          {loading ? (
            <View
              style={{
                gap: sizeHelper.calWp(25),
                marginTop: sizeHelper.calHp(10),
                // paddingBottom:sizeHelper.calHp(10)
                // alignItems: 'center',
              }}
            >
              <OrderHistoryLayout />
            </View>
          ) : (
            <FlatList
              data={orderHistoryData}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.5}
              style={{ flex: 1 }}
              onEndReached={() => {
                if (
                  !isMoreDataLoading &&
                  orderHistoryData?.length > 0 &&
                  hasMoreData
                ) {
                  // Only load more data if not refreshing
                  onEndReached();
                }
              }}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
              contentContainerStyle={{
                gap: sizeHelper.calWp(40),
                paddingTop: sizeHelper.calHp(10),
                paddingBottom: sizeHelper.calHp(80),
              }}
              renderItem={({ item, index }: any) => {
                return (
                  <>
                    <OrderHistoryCard
                      onDetail={() => {
                        navigation.navigate("OrderHistoryDetail", {
                          detail: item,
                        });
                      }}
                      item={item}
                    />
                  </>
                );
              }}
              ListEmptyComponent={() => {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "90%",
                    }}
                  >
                    <CustomText
                      text={"No order history available"}
                      fontWeight="700"
                      style={{ textAlign: "center" }}
                      fontFam={fonts.Poppins_Bold}
                      color={theme.colors.secondry}
                      size={25}
                    />
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScreenLayout>
    </>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: "10%",
  },
  actionContainer: {
    position: "absolute",
    width: "31%",
    backgroundColor: theme.colors.background,
    right: 0,
    zIndex: 999,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: sizeHelper.calWp(15),
    top: sizeHelper.calHp(isIpad ? 90 : 58),
    gap: sizeHelper.calHp(15),
  },
  actionInner: {
    width: "100%",
    paddingBottom: sizeHelper.calHp(10),
    paddingHorizontal: sizeHelper.calWp(15),
    // padding: sizeHelper.calWp(10),
  },
});
