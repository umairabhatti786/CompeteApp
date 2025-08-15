import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  ScrollView,
  RefreshControl,
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
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../redux/reducers/authReducer";
import { ApiServices } from "../../../api/ApiServices";
import CategoryCard from "../../../components/CategoryCard";
import CarouselCard from "../../../components/CarouselCard";
import { HomeLayout } from "../../../utils/Layouts";
import { htmlTagRegex } from "../../../utils/Regex";
import BlogCard from "../../../components/Home/BlogCard";
import CustomToast from "../../../components/CustomToast";
import { useIsFocused } from "@react-navigation/native";
import { isIpad, sessionCheck } from "../../../utils/CommonHooks";
import CustomButton from "../../../components/Button";

const HomeScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState({
    id: "",
    name: "All",
    image: images.all_category,
    isDefault: "All",
  });
  const [loading, setLoading] = useState(true);
  const auth = useSelector(getUserData);
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [carousels, setCarousels] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [toastColor, setToastColor] = useState(theme.colors.primary);
  const focused = useIsFocused();
  const dispatch = useDispatch();
  const [isSelectQuantityVisible, setIsSelectQuantityVisible] =
    useState<boolean>(false);

  const categoriesData = [
    { title: "All", icon: images.all_category, id: 1 },
    { title: "Frutes", icon: images.fruite, id: 2 },
    { title: "Vegetables", icon: images.vegatable, id: 3 },
    { title: "Dairy", icon: images.dairy, id: 4 },
  ];
  console.warn("categories", auth);
  useEffect(() => {
    getProductData();
    fetchAllHomeData();
  }, [focused]);
  // useEffect(() => {

  // }, []);

  const fetchAllHomeData = () => {
    const param = {
      search: "",
      id: selectedCategory?.id,
      page: 1,
      user_id: auth ? auth?.id : "",
    };

    const getProductsPromise = () =>
      new Promise((resolve) => {
        ApiServices.GetProducts(param, (res: any) => {
          console.log("resPoror", res?.response?.app_update_status);

          resolve({ type: "products", ...res });
        });
      });

    const getHomePagePromise = () =>
      new Promise((resolve) => {
        ApiServices.GetHomePageContent(param, (res: any) => {
          resolve({ type: "homepage", ...res });
        });
      });

    const getCategoriesPromise = () =>
      new Promise((resolve) => {
        ApiServices.GetCategories((res: any) => {
          resolve({ type: "categories", ...res });
        });
      });

    Promise.all([
      getProductsPromise(),
      getHomePagePromise(),
      getCategoriesPromise(),
    ])
      .then((results: any[]) => {
        results.forEach((res) => {
          if (res.isSuccess && res.response?.success) {
            switch (res.type) {
              case "products":
                setProducts(res.response.data?.products);
                break;
              case "homepage":
                console.log("carouselsSlideer", res.response.data);
                const carousels = res.response.data?.carousels;
                const blogs = res.response.data?.blogs;
                console.log("blogsData", blogs);
                setCarousels(carousels);
                setBlogs(blogs);
                break;
              case "categories":
                setCategories(res.response.data?.product_categories);
                break;
            }
          } else {
            console.log(
              `Error in ${res.type}:`,
              res.response?.app_update_status == 1
            );
            if (res.type == "products") {
              if (
                res.response?.app_update_status == 1 ||
                res.response?.session_expire
              ) {
                sessionCheck(
                  res.response?.app_update_status,
                  res.response?.session_expire,
                  "",
                  dispatch,
                  navigation
                );
              }
            }
          }
        });
      })
      .catch((error) => {
        console.log("Unexpected error:", error);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchAllHomeData();
  };

  const getProductData = () => {
    const param = {
      search: "",
      id: selectedCategory?.id,
      page: 1,
      user_id: auth ? auth?.id : "",
    };
    ApiServices.GetProducts(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        console.log("response", response);
        if (response?.success) {
          setProducts(response?.data?.products);
        } else {
          console.log("errocdcdr", response);
        }
      } else {
      }
    });
  };

  // const getHomePageData = () => {
  //   let param = {
  //     search: '',
  //     id: '',
  //     page: 1,
  //   };
  //   ApiServices.GetHomePageContent(
  //     param,
  //     async ({isSuccess, response}: any) => {
  //       if (isSuccess) {
  //         console.log('response', response);
  //         if (response?.success) {
  //           setCarousels(response?.data?.carousels);
  //         } else {
  //           console.log('errocdcdr', response);
  //         }
  //       } else {
  //       }
  //     },
  //   );
  // };

  // const getCategories = () => {
  //   ApiServices.GetCategories(async ({isSuccess, response}: any) => {
  //     if (isSuccess) {
  //       if (response?.success) {
  //         setCategories(response?.data?.product_categories);
  //       } else {
  //         console.log('errocdcdr', response);
  //       }
  //     } else {
  //       // Alert.alert("Alert!", "Network Error.");
  //     }
  //   });
  // };

  const Header = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={{ ...appStyles.row, gap: sizeHelper.calWp(20), width: "60%" }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.profileContainer}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              source={
                auth?.profile_picture
                  ? { uri: auth?.profile_picture }
                  : images.image_placeholder
              }
            />
          </TouchableOpacity>
          <View style={{ gap: sizeHelper.calHp(5), width: "85%" }}>
            <CustomText
              text={auth?.name ? `${auth?.name}` : "Hello"}
              fontWeight="600"
              // style={{width: '90%'}}
              numberOfLines={1}
              fontFam={fonts.Poppins_SemiBold}
              color={theme.colors.secondry}
              size={23}
            />
            <CustomText
              // style={{width: '90%'}}
              text={auth?.data?.address ? auth?.data?.address : ""}
              numberOfLines={1}
              color={theme.colors.gray}
              size={17}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            ...appStyles.row,
            gap: sizeHelper.calWp(15),
            // backgroundColor: 'red',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
            style={styles.box}
          >
            <Image
              style={{ width: "45%", height: "45%", resizeMode: "contain" }}
              source={icons.bell_notification}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (auth?.token) {
                navigation.navigate("OrderHistoryScreen");
              } else {
                navigation.navigate("LoginAndSignup");
              }
            }}
            style={styles.box}
          >
            <Image
              style={{ width: "45%", height: "45%", resizeMode: "contain" }}
              source={icons.order}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SearchBar = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => navigation.navigate("SearchScreen")}
        style={{
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 50),
          width: "100%",
        }}
      >
        <View
          style={{
            ...styles.searchContainer,
          }}
        >
          <View style={{ ...appStyles.row, gap: sizeHelper.calWp(20) }}>
            <Image
              source={icons.search}
              resizeMode="contain"
              style={{
                ...(isIpad ? styles.iPadSearchIcon : styles.searchIcon),
              }}
              // style={{

              //   // width: sizeHelper.calWp(40),
              //   // height: sizeHelper.calWp(40),
              //   // tintColor: theme.colors.gray,
              // }}
            />
            <CustomText text={"Search"} color={theme.colors.gray} size={25} />
          </View>

          <TouchableOpacity
            style={{
              width: sizeHelper.calWp(90),
              height: "100%",
              backgroundColor: theme.colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={icons.filter}
              resizeMode="contain"
              style={{
                ...(isIpad ? styles.iPadSearchIcon : styles.filterIcon),
              }}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const OnSelectedCategory = (item: any) => {
    console.log("cdncdi", item);

    let param = {
      search: "",
      id: item?.id,
      page: 1,
      user_id: auth ? auth?.id : "",
    };
    ApiServices.GetProducts(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        if (response?.success) {
          setProducts(response?.data?.products);
        } else {
          console.log("errocdcdr", response);
        }
      } else {
      }
    });
  };

  const ViewAllContainer = () => {
    return (
      <View
        style={{
          ...appStyles.rowjustify,
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 50),
          paddingTop: sizeHelper.calHp(25),
          paddingBottom: sizeHelper.calHp(isIpad ? 5 : 0),
        }}
      >
        <CustomText
          text={"Products"}
          fontWeight="600"
          fontFam={fonts.Poppins_SemiBold}
          color={theme.colors.secondry}
          size={25}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("AllProducts")}
          style={{
            ...appStyles.row,
            gap: sizeHelper.calWp(15),
            paddingRight: sizeHelper.calWp(15),
          }}
        >
          <CustomText
            text={"View all"}
            fontWeight="600"
            fontFam={fonts.Poppins_SemiBold}
            color={theme.colors.secondry}
            size={22}
          />

          <Image
            style={{
              width: sizeHelper.calWp(25),
              height: sizeHelper.calWp(25),
              resizeMode: "contain",
              tintColor: theme.colors.secondry,
            }}
            source={icons.next_arrow}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          gap: sizeHelper.calWp(25),
          paddingTop: sizeHelper.calHp(isIpad ? 40 : 20),
        }}
      >
        <Header />
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            paddingBottom: sizeHelper.calHp(40),
          }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <SearchBar />
          <View style={{ flex: 1 }}>
            {loading ? (
              <View style={{ marginLeft: 20, marginTop: sizeHelper.calHp(30) }}>
                {/* home page layout */}
                <HomeLayout />
              </View>
            ) : (
              <View>
                {/* Home carousel */}

                {carousels?.length > 0 && (
                  <View
                    style={{
                      gap: sizeHelper.calHp(15),
                      paddingTop: sizeHelper.calHp(25),
                    }}
                  >
                    <FlatList
                      data={carousels}
                      nestedScrollEnabled={true}
                      scrollEnabled={true}
                      keyboardShouldPersistTaps="handled"
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        gap: sizeHelper.calHp(15),
                      }}
                      renderItem={({ item, index }: any) => {
                        return item?.data.length > 0 ? (
                          <>
                            <View style={{ gap: sizeHelper.calHp(15) }}>
                              <CustomText
                                text={item?.title}
                                fontWeight="600"
                                style={{ marginLeft: sizeHelper.calWp(40) }}
                                fontFam={fonts.Poppins_SemiBold}
                                color={theme.colors.secondry}
                                size={25}
                              />

                              <CarouselCard
                                // onPress={(it: any) => onCardPress(it)}
                                data={item?.data}
                                key={index}
                              />
                            </View>
                          </>
                        ) : (
                          <></>
                        );
                      }}
                    />
                  </View>
                )}
                {<ViewAllContainer />}

                {categories.length > 0 && (
                  <View>
                    <FlatList
                      data={categories}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={{
                        paddingLeft: sizeHelper.calWp(isIpad ? 30 : 40),
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
                            index={index}
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
                )}

                <FlatList
                  data={products}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  scrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  style={{
                    paddingLeft: sizeHelper.calWp(40),
                  }}
                  contentContainerStyle={{
                    gap: sizeHelper.calWp(25),
                    paddingRight: sizeHelper.calWp(40),
                    paddingVertical: sizeHelper.calHp(10),
                  }}
                  ListEmptyComponent={() => {
                    return (
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                          paddingTop: "40%",
                        }}
                      >
                        <CustomText
                          text={"No Content available"}
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
                          index={index}
                          data={products}
                          setMessage={setMessage}
                          setIsMessage={setIsMessage}
                          isSelectQuantityVisible={isSelectQuantityVisible}
                          setIsSelectQuantityVisible={
                            setIsSelectQuantityVisible
                          }
                          setToastColor={setToastColor}
                          item={item}
                        />
                      </>
                    );
                  }}
                />
                {products?.length > 0 && (
                  <CustomButton
                  onPress={() => navigation.navigate("AllProducts")}

                    width={"70%"}
                    bgColor={"transparent"}
                    textColor={theme.colors.primary}
                    style={{
                      marginTop: sizeHelper.calHp(5),
                      alignSelf: "center",
                    }}
                    // onPress={onPlaceOrder}
                    text="Load More Products"
                  >
                    <Image
                      style={{
                        width: sizeHelper.calWp(25),
                        height: sizeHelper.calWp(25),
                        resizeMode: "contain",
                        tintColor: theme.colors.primary,
                      }}
                      source={icons.next_arrow}
                    />
                  </CustomButton>
                )}

                {blogs?.length > 0 && (
                  <View
                    style={{
                      marginHorizontal: sizeHelper.calWp(40),
                    }}
                  >
                    <CustomText
                      text={"Blogs"}
                      fontWeight="600"
                      // style={{marginLeft: sizeHelper.calWp(50)}}
                      fontFam={fonts.Poppins_SemiBold}
                      color={theme.colors.secondry}
                      size={25}
                    />
                    <FlatList
                      data={blogs}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        gap: sizeHelper.calWp(20),
                        paddingVertical: sizeHelper.calHp(10),
                      }}
                      renderItem={({ item, index }: any) => {
                        const plainText = item?.blog.replace(htmlTagRegex, "");

                        return (
                          <BlogCard
                            blogDescription={plainText}
                            onPress={() =>
                              navigation.navigate("BlogDetail", {
                                data: item,
                              })
                            }
                            data={item}
                            key={index}
                          />
                        );
                      }}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenLayout>

      <CustomToast
        duration={2000}
        isVisable={isMessage}
        backgroundColor={toastColor}
        setIsVisable={setIsMessage}
        message={message}
      />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: "10%",
  },
  iPadSearchIcon: {
    width: sizeHelper.calWp(30),
    height: sizeHelper.calWp(30),
  },
  searchIcon: {
    width: sizeHelper.calWp(30),
    height: sizeHelper.calWp(30),
  },
  filterIcon: {
    width: sizeHelper.calWp(30),
    height: sizeHelper.calWp(30),
  },
  profileContainer: {
    height: sizeHelper.calHp(80),
    width: sizeHelper.calHp(80),
    borderRadius: sizeHelper.calWp(80),
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  categoryContainer: {
    borderRadius: sizeHelper.calHp(10),
    paddingHorizontal: sizeHelper.calWp(30),
    alignItems: "center",
    justifyContent: "center",
    padding: sizeHelper.calWp(15),
    flexDirection: "row",
    gap: sizeHelper.calWp(13),
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: sizeHelper.calWp(25),
    borderRadius: sizeHelper.calWp(isIpad ? 10 : 20),
    width: "100%",
    backgroundColor: theme.colors.background,
    height: sizeHelper.calHp(75),
    gap: sizeHelper.calWp(20),
    borderWidth: 1,
    borderColor: theme.colors.gray,
    overflow: "hidden",
  },
  inputContainer: {
    flex: 1,
    fontSize: sizeHelper.calHp(22),
    fontFamily: fonts.Poppins_Regular,
  },
});
