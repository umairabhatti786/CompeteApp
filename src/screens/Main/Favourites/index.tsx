import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import ScreenLayout from "../../../components/ScreenLayout";
import { appStyles } from "../../../utils/GlobalStyles";
import { theme } from "../../../utils/Themes";
import CustomText from "../../../components/Text";
import images from "../../../utils/Constants/images";
import { fonts } from "../../../utils/Themes/fonts";
import icons from "../../../utils/Constants/icons";
import ProductCard from "../../../components/ProductCard";
import { favouritesData } from "../../../utils/Data";
import CustomButton from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { getToken, getUserData } from "../../../redux/reducers/authReducer";
import { ApiServices } from "../../../api/ApiServices";
import CategoryCard from "../../../components/CategoryCard";
import { ViewAllProductLayout } from "../../../utils/Layouts/ViewAllProductLayout";
import { OrderHistoryLayout } from "../../../utils/Layouts/OrderHistoryLayout";
import { useIsFocused } from "@react-navigation/native";
import CustomToast from "../../../components/CustomToast";
import { isIpad, sessionCheck } from "../../../utils/CommonHooks";

const FavouritesScreen = ({ navigation }: any) => {
  const auth = useSelector(getUserData);
  const [loading, setLoading] = useState(false);
  const token = useSelector(getToken);
  const focused = useIsFocused();
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const [isSelectQuantityVisible, setIsSelectQuantityVisible] =
    useState<boolean>(false);
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true); // Flag to indicate if more data is available
  const [isMoreDataLoading, setIsMoreDataLoading] = useState(false);
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "All",
    image: images.all_category,
    isDefault: "All",
  });

  useEffect(() => {
    if (focused) {
      setLoading(true);
      getCategories();
      getProductData();
    }
  }, [focused]);

  const getCategories = () => {
    ApiServices.GetCategories(async ({ isSuccess, response }: any) => {
      console.log("GetFav", response);

      if (isSuccess) {
        if (response?.success) {
          setCategories(response?.data?.product_categories);
        } else {
          console.log("errocdcdr", response);
        }
      } else {
        // Alert.alert("Alert!", "Something went wrong");
      }
    });
  };

  const getProductData = () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("page", 1);
    formData.append("type", "view");
    formData.append("product_category_id", selectedCategory?.id);

    let param = {
      token: token,
      data: formData,
    };
    ApiServices.GetFavourits(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setPage(2);
          setProducts(response?.data?.favorite_product);
          setLoading(false);
          if (response?.data?.favorite_product.length >= 10) {
            setHasMoreData(true);
          } else {
            setHasMoreData(false);
          }
        } else {
          setLoading(false);
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
        setIsMoreDataLoading(false);
        setHasMoreData(false);
        setIsMessage(true);
        setMessage("Something went wrong");
      }
    });
  };

  const OnSelectedCategory = (item: any) => {
    console.log("selectedCategory", selectedCategory);

    const formData = new FormData();
    formData.append("page", 1);
    formData.append("type", "view");
    formData.append("product_category_id", item?.id);

    let param = {
      token: token,
      data: formData,
    };

    ApiServices.GetFavourits(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setPage(2);

          setProducts(response?.data?.favorite_product);
          if (response?.data?.favorite_product.length >= 10) {
            setHasMoreData(true);
          } else {
            setHasMoreData(false);
          }
        } else {
          console.log("errocdcdr", response);
        }
      } else {
      }
    });
  };

  const onEndReached = () => {
    setIsMoreDataLoading(true);
    const formData = new FormData();
    formData.append("page", page);
    formData.append("type", "view");
    formData.append("product_category_id", selectedCategory?.id);

    let param = {
      token: token,
      data: formData,
    };

    ApiServices.GetFavourits(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setPage(page + 1);
          setIsMoreDataLoading(false);

          if (response?.data?.favorite_product.length < 10) {
            setHasMoreData(false);
          }
          setProducts((prevData) => {
            return [...prevData, ...response?.data?.favorite_product];
          });
        } else {
          setIsMoreDataLoading(false);
          setMessage(response?.message);
          setIsMessage(true);

          console.log("errocdcdr", response);
        }
      } else {
        setIsMoreDataLoading(false);
        setHasMoreData(false);
        setIsMessage(true);
        setMessage("Something went wrong");
      }
    });
  };

  const renderFooter = () => {
    if (!isMoreDataLoading) return null;
    return (
      <View
        style={{ marginVertical: sizeHelper.calHp(20), alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };

  const Header = () => {
    return (
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
        <View style={{ flex: 1, alignItems: "center" }}>
          <CustomText
            text={"Favourites"}
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
        <View
          style={{
            paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
          }}
        >
          <Header />
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              gap: sizeHelper.calWp(25),
              marginTop: sizeHelper.calHp(10),
              paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
            }}
          >
            <OrderHistoryLayout />
          </View>
        ) : (
          <View style={{ flex: 1, gap: sizeHelper.calWp(25) }}>
            <View>
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingLeft: sizeHelper.calWp(50),
                  // backgroundColor:"red",
                  paddingVertical: 10,
                }}
                contentContainerStyle={{
                  gap: sizeHelper.calWp(10),
                  paddingRight: sizeHelper.calWp(
                    Platform.OS == "ios" ? 40 : 100
                  ),
                }}
                ListHeaderComponent={({ item, index }: any) => {
                  return (
                    <>
                      <CategoryCard
                        onPress={() => {
                          setSelectedCategory({
                            id: "",
                            name: "All",
                            image: images.all_category,
                            isDefault: "All",
                          });
                          OnSelectedCategory({
                            id: "",
                            name: "All",
                            image: images.all_category,
                            isDefault: "All",
                          });
                        }}
                        setSelectedCategory={setSelectedCategory}
                        item={{
                          id: "",
                          name: "All",
                          image: images.all_category,
                          isDefault: "All",
                        }}
                        selectedCategory={selectedCategory}
                      />
                    </>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }: any) => {
                  return (
                    <CategoryCard
                      setSelectedCategory={setSelectedCategory}
                      onPress={() => {
                        console.log("ckdnckd", item);
                        setSelectedCategory(item);
                        OnSelectedCategory(item);
                      }}
                      item={item}
                      selectedCategory={selectedCategory}
                    />
                  );
                }}
              />
            </View>

            <FlatList
              data={products}
              showsVerticalScrollIndicator={false}
              onEndReached={() => {
                if (!isMoreDataLoading && products?.length > 0 && hasMoreData) {
                  // Only load more data if not refreshing
                  onEndReached();
                }
              }}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.5}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
                paddingVertical: sizeHelper.calHp(10),
                paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
              }}
              renderItem={({ item, index }: any) => {
                return (
                  <>
                    <ProductCard
                      index={index}
                      data={products}
                      isFavorite={true}
                      setMessage={setMessage}
                      setIsSelectQuantityVisible={setIsSelectQuantityVisible}
                      isSelectQuantityVisible={isSelectQuantityVisible}
                      setIsMessage={setIsMessage}
                      setToastColor={setToastColor}
                      onRemoveitem={() => {
                        let removeItem = products?.filter(
                          (it: any) => it?.id != item?.id
                        );
                        setProducts(removeItem);
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
                      paddingTop: "80%",
                    }}
                  >
                    <CustomText
                      text={"No favourites available"}
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
          </View>
        )}
      </ScreenLayout>
      <CustomToast
        isVisable={isMessage}
        setIsVisable={setIsMessage}
        backgroundColor={toastColor}
        message={message}
      />

      {/* <View style={styles.botttom}>
        <CustomButton width={'83%'} text="Add To Cart" />
      </View> */}
    </>
  );
};

export default FavouritesScreen;

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
});
