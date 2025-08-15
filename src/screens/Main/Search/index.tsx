import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomText from "../../../components/Text";
import { favouritesData } from "../../../utils/Data";
import { fonts } from "../../../utils/Themes/fonts";
import { theme } from "../../../utils/Themes";
import ProductCard from "../../../components/ProductCard";
import CustomButton from "../../../components/Button";
import CustomHeader from "../../../components/Header/inde";
import CustomSearch from "../../../components/Search";
import { ApiServices } from "../../../api/ApiServices";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { getToken } from "../../../redux/reducers/authReducer";
import CustomToast from "../../../components/CustomToast";
import { useIsFocused } from "@react-navigation/native";
import { OrderHistoryLayout } from "../../../utils/Layouts/OrderHistoryLayout";
import { isIpad } from "../../../utils/CommonHooks";
import images from "../../../utils/Constants/images";
import CategoryCard from "../../../components/CategoryCard";

const SearchScreen = ({ navigation }: any) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any>([]);
  const auth = useSelector(getToken);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const [loading, setLoading] = useState(false);
  const focused = useIsFocused();
  const inputRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // Flag to indicate if more data is available
  const [isMoreDataLoading, setIsMoreDataLoading] = useState(false);
  const [categories, setCategories] = useState<any>([]);
  const [isSelectQuantityVisible, setIsSelectQuantityVisible] =
  useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "All",
    image: images.all_category,
    isDefault: "All",
  });

  console.log("selectedCategory",selectedCategory)

  useEffect(() => {
    if (focused) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Try 300ms for reliability

      return () => clearTimeout(timeout);
    }
  }, [focused]);

  useEffect(() => {
    setLoading(true);
    getCategories();
    getProductData("");
  }, []);

  const getCategories = () => {
    ApiServices.GetCategories(async ({ isSuccess, response }: any) => {
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

  const getProductData = (txt: any) => {
    let param = {
      search: txt,
      id: selectedCategory?.id,
      page: 1,
      user_id: auth ? auth?.id : "",
    };
    setPage(2);
    console.log("SelectedtId",selectedCategory?.id)

    ApiServices.GetProducts(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setLoading(false);

          setProducts(response?.data?.products);
          if (response?.data?.products.length >= 10) {
            setHasMoreData(true);
          } else {
            setHasMoreData(false);
          }
        } else {
          console.warn("Product fetch unsuccessful:", response);
          setLoading(false);
        }
      } else {
        console.error("API call failed");
        setLoading(false);
      }
    });
  };

  const debouncedSearch = useCallback(
    debounce((txt: string) => {
      if (txt.trim().length === 0) {
        // setLoading(true);
        getProductData("");
        return;
      }
      // setLoading(true);
      getProductData(txt);

      // const params = {
      //   search: txt,
      //   id: '',
      //   page: 1,
      // };
    }, 200), // 1-second debounce
    []
  );

  const onSearch = (txt: string) => {
    console.log("Search input:", txt);
    setSearch(txt);
    debouncedSearch(txt);
  };

  const OnSelectedCategory = (item: any) => {
    let param = {
      search: search,
      id: item?.id,
      page: 1,
      user_id: auth ? auth?.id : "",
    };

    ApiServices.GetProducts(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setPage(2);

          setProducts(response?.data?.products);
          if (response?.data?.products.length >= 10) {
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
    let param = {
      search: search,
      id: selectedCategory?.id,
      page: page,
      user_id: auth ? auth?.id : "",
    };

    ApiServices.GetProducts(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        console.log("response", response?.data?.products.length);
        if (response?.success) {
          setPage(page + 1);
          setIsMoreDataLoading(false);

          if (response?.data?.products.length < 10) {
            setHasMoreData(false);
          }
          setProducts((prevData) => {
            return [...prevData, ...response?.data?.products];
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
          <CustomHeader title={"Search"} />
          <CustomSearch
            value={search}
            inputRef={inputRef}
            onChangeText={onSearch}
            placeholder="Search"
          />
        </View>

        {loading ? (
          <View
            style={{
              flex: 1,
              paddingTop: sizeHelper.calHp(20),
              paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
            }}
          >
            <OrderHistoryLayout />
          </View>
        ) : (
          <View style={{ flex: 1, paddingTop: sizeHelper.calHp(20) }}>
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
              onEndReachedThreshold={0.5}

              style={{ flex: 1 }}
              contentContainerStyle={{
                gap: sizeHelper.calWp(20),
                paddingVertical: sizeHelper.calHp(10),
                paddingBottom: sizeHelper.calHp(keyboardVisible?350:200),
                backgroundColor: theme.colors.background,
                paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
              }}
              onEndReached={() => {
                if (!isMoreDataLoading && products?.length > 0 && hasMoreData) {
                  // Only load more data if not refreshing
                  onEndReached();
                }
              }}
              ListFooterComponent={renderFooter}
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
                      text={"No Products available"}
                      fontWeight="700"
                      style={{ textAlign: "center" }}
                      fontFam={fonts.Poppins_Bold}
                      color={theme.colors.secondry}
                      size={25}
                    />
                  </View>
                );
              }}
              renderItem={({ item, index }: any) => {
                return (
                  <>
                    <ProductCard
                      setMessage={setMessage}
                      setIsSelectQuantityVisible={setIsSelectQuantityVisible}
                      isSelectQuantityVisible={isSelectQuantityVisible}
                      setIsMessage={setIsMessage}
                      setToastColor={setToastColor}
                      item={item}
                    />
                  </>
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
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: "10%",
  },
});
