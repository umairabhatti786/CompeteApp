import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import { theme } from "../../../utils/Themes";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomButton from "../../../components/Button";
import CustomText from "../../../components/Text";
import { fonts } from "../../../utils/Themes/fonts";
import CustomInput from "../../../components/Input";
import { appStyles } from "../../../utils/GlobalStyles";
import icons from "../../../utils/Constants/icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { emailRegex, passwordRegex, phoneRegex } from "../../../utils/Regex";
import CustomHeader from "../../../components/Header/inde";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, setUserData } from "../../../redux/reducers/authReducer";
import CustomToast from "../../../components/CustomToast";
import ScreenLoader from "../../../components/ScreenLoader";
import { ApiServices } from "../../../api/ApiServices";
import { isIpad, sessionCheck } from "../../../utils/CommonHooks";
import {
  AUTH_DATA,
  StorageServices,
  TOKEN,
} from "../../../utils/StorageService";

const EditProfileScreen = ({ navigation }: any) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const auth = useSelector(getUserData);
  const [isDisable, setIsDisable] = useState(false);

  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.primary);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    username_error: "",
    shop_name_error: "",
    email_error: "",
    password_error: "",
    first_name_error: "",
    last_name_error: "",
    phone_error: "",
  });

  const [values, setValues] = useState({
    username: auth?.name ? auth?.name : "",
    name: auth?.name ? auth?.name : "",
    shop_name: auth?.shop_name ? auth?.shop_name : "",
    phone: auth?.phone ? "+44 " + auth?.phone.replace(/^(\+44)/, "") : "+44 ",
    country_code: "+44 ",
    email: auth?.email ? auth?.email : "",
    address: auth?.data?.address ? auth?.data?.address : "",
    city: auth?.data?.city ? auth?.data?.city : "",
    postal_code: auth?.data?.postalCode ? auth?.data?.postalCode : "",
    password: "",
  });

  console.log("values?.shop_name", values?.shop_name.length);

  const onSignup = () => {
    Keyboard.dismiss();

    if (!values?.name) {
      setMessage("Name is required");
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }
    if (!values?.shop_name) {
      setMessage("Shop Name is required");
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }
    if (!values?.phone) {
      setMessage("Phone Number is required");
      setIsMessage(true);
    }

    if (values?.phone) {
      if (!phoneRegex.test(values?.phone.trim())) {
        setMessage("Invalid Phone Number");
        setIsMessage(true);
        setMessageColor(theme.colors.red);

        return;
      }
    }

    if (!values?.address) {
      setMessage("Address is required");
      setIsMessage(true);
      return false;
    }
    if (!values?.city) {
      setMessage("City Name is required");
      setIsMessage(true);
      return false;
    }
    if (!values?.postal_code) {
      setMessage("Postal Code is required");
      setIsMessage(true);
      return false;
    }

    const formData = new FormData();
    let trimPhone = values.phone.replace(/\s+/g, "");
    setLoading(true);
    setIsDisable(false);

    formData.append("phone", trimPhone);
    formData.append("user_id", auth?.id);
    formData.append("email", auth?.email);
    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("city", values.city);
    formData.append("postal_code", values.postal_code);
    formData.append("shop_name", values?.shop_name);
    let data = {
      form: formData,
      token: auth?.token,
    };
    ApiServices.updateProfile(data, async ({ isSuccess, response }: any) => {
      console.log("respinse", response);
      if (isSuccess) {
        let result = JSON.parse(response);
        if (result?.success) {
          setLoading(false);
          setIsDisable(false);
          setMessage(result?.message);
          setMessageColor(theme.colors.primary);
          setIsMessage(true);
          dispatch(setUserData(result?.data));
          StorageServices.setItem(TOKEN, result?.data.token);
          StorageServices.setItem(AUTH_DATA, result?.data);
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        } else {
          setLoading(false);
          setIsDisable(false);
          setMessageColor(theme.colors.red);

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

          if (result?.message?.name) {
            setMessage(result?.message?.name);
          } else if (result?.message?.shop_name) {
            setMessage(result?.message?.shop_name);
          } else if (result?.message?.address) {
            setMessage(result?.message?.address);
          } else if (result?.message?.city) {
            setMessage(result?.message?.city);
          } else if (result?.message?.postal_code) {
            setMessage(result?.message?.postal_code);
          } else {
            setMessage(result?.message);
          }
        }
      } else {
        setLoading(false);
        setIsDisable(false);
        setMessage(response?.message);
        setIsMessage(true);
        setMessageColor(theme.colors.red);
      }
    });
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
          paddingTop: sizeHelper.calHp(10),
          // gap: sizeHelper.calWp(30),
        }}
      >
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
            // gap: sizeHelper.calWp(30),
          }}
        >
          <CustomHeader title={"Edit Profile"} />

          <View style={{ flex: 1 }}>
            <View style={{ gap: sizeHelper.calWp(20) }}>
              <CustomInput
                label={"Name"}
                focusedInput={focusedInput}
                complusory
                leftSource={icons.user}
                value={values.name}
                placeholder="Name"
                inputKey="name"
                setFocusedInput={setFocusedInput}
                onChangeText={(txt: string) =>
                  setValues({ ...values, name: txt })
                }
              />

              <CustomInput
                label={"Shop Name"}
                disable={true}
                color={theme.colors.gray}
                textColor={theme.colors.gray}
                focusedInput={focusedInput}
                value={values.shop_name}
                onChangeText={(txt: string) =>
                  setValues({ ...values, shop_name: txt })
                }
                leftSource={icons.shop}
                placeholder="Shop Name"
                inputKey="shop"
                setFocusedInput={setFocusedInput}
              />
              <CustomInput
                label={"Phone Number"}
                complusory
                focusedInput={focusedInput}
                keyboard={"numeric"}
                error={errors.phone_error}
                value={values.phone}
                onChangeText={(txt: string) => {
                  if (!txt.startsWith(values?.country_code)) {
                    setValues((prev) => {
                      const existingDigits = prev.phone.slice(
                        values.country_code.length
                      );
                      return {
                        ...prev,
                        phone: values.country_code + existingDigits,
                      };
                    });
                    return;
                  }
                  const localNumber = txt
                    .slice(values?.country_code.length)
                    .replace(/\D/g, "");

                  const fullNumber = `${values?.country_code}${localNumber}`;

                  setValues({ ...values, phone: fullNumber });

                  let trimPhone = fullNumber.replace(/\s+/g, "");
                  if (trimPhone.length > 13 || !phoneRegex.test(trimPhone)) {
                    setErrors({
                      ...errors,
                      phone_error: "Invalid Phone Number",
                    });
                  } else {
                    setErrors({ ...errors, phone_error: "" });
                  }
                }}
                leftSource={icons.phone}
                placeholder="Phone Number"
                inputKey="phone"
                setFocusedInput={setFocusedInput}
              />

              <CustomInput
                label={"Email"}
                color={theme.colors.gray}
                textColor={theme.colors.gray}
                focusedInput={focusedInput}
                leftSource={icons.user}
                disable={true}
                value={values.email}
                onChangeText={(txt: string) =>
                  setValues({ ...values, email: txt })
                }
                placeholder="Email"
                inputKey="email"
                setFocusedInput={setFocusedInput}
              />

              <CustomInput
                label={"Address"}
                focusedInput={focusedInput}
                complusory
                value={values.address}
                maxLength={50}
                onChangeText={(txt: string) => {
                  setValues({ ...values, address: txt });
                }}
                leftSource={icons.address}
                placeholder="Address"
                inputKey="address"
                setFocusedInput={setFocusedInput}
              />
              <CustomInput
                label={"City Name"}
                complusory
                value={values.city}
                maxLength={30}
                focusedInput={focusedInput}
                onChangeText={(txt: string) => {
                  setValues({ ...values, city: txt });
                }}
                leftSource={icons.city}
                placeholder="City"
                inputKey="city"
                setFocusedInput={setFocusedInput}
              />

              <CustomInput
                label={"Postal Code"}
                complusory
                focusedInput={focusedInput}
                value={values.postal_code}
                maxLength={20}
                onChangeText={(txt: string) => {
                  setValues({ ...values, postal_code: txt });
                }}
                leftSource={icons.postal_code}
                placeholder="Postal Code"
                inputKey="postalcode"
                setFocusedInput={setFocusedInput}
              />

              <View style={styles.botttom}>
                <CustomButton
                  onPress={onSignup}
                  disable={isDisable}
                  text="Confirm"
                  width={"100%"}
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        backgroundColor={messageColor}
        setIsVisable={setIsMessage}
        message={message}
      />
      {loading && <ScreenLoader />}
    </>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingTop: "10%",
  },
});
