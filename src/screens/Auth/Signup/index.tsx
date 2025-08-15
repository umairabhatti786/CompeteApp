import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
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
import CustomToast from "../../../components/CustomToast";
import ScreenLoader from "../../../components/ScreenLoader";
import { ApiServices } from "../../../api/ApiServices";
import images from "../../../utils/Constants/images";
import { NotificationServices, isIpad } from "../../../utils/CommonHooks";

const SignupScreen = ({ navigation }: any) => {
  const [focusedInput, setFocusedInput] = useState(null);

  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.primary);
  const [loading, setloading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [errors, setErrors] = useState({
    username_error: "",
    phone_error: "",
    shop_name_error: "",
    email_error: "",
    password_error: "",
  });

  const [values, setValues] = useState({
    name: "",
    shop_name: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    password: "",
    phone: "+44 ",
    country_code: "+44 ",
  });
console.log("ckdbkdbc", String(values.city).trim())
  const onSignup = async () => {
    Keyboard.dismiss();

    if (!values?.name) {
      setMessage("Name is required");
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }

    if (values?.name.length < 2) {
      setMessage("The Name must be at least 2 characters.");
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
      setMessageColor(theme.colors.red);

      return;
    }

    if (values?.phone) {
      if (!phoneRegex.test(values?.phone.trim())) {
        setMessage("Invalid Phone Number");
        setIsMessage(true);
        setMessageColor(theme.colors.red);

        return;
      }
    }
    if (!values?.email) {
      setMessage("Email is required");
      setIsMessage(true);
      return false;
    }
    if (values?.email) {
      if (!emailRegex.test(values?.email)) {
        setMessage("Invalid Email Address");
        setIsMessage(true);
        setMessageColor(theme.colors.red);

        return;
      }
    }
    if (!values?.password) {
      setMessage("Password is required");
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
    }
    if (!passwordRegex.test(values?.password)) {
      setMessage(
        "Your password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character"
      );
      setIsMessage(true);
      setMessageColor(theme.colors.red);

      return;
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
    const deviceState = await NotificationServices.getDeviceStatus();
    console.log("deviceState", deviceState);
    setloading(true);
    setIsDisable(true);
    const formData = new FormData();
    let trimPhone = values.phone.replace(/\s+/g, "");
    formData.append("device_id", deviceState);
    formData.append("email", values.email?.trim());
    formData.append("password", values.password?.trim());
    formData.append("phone", trimPhone);
    formData.append("name", values.name);
    formData.append("shop_name", values.shop_name);
    formData.append("address", values.address);
    formData.append("city",  String(values.city).trim());
    formData.append("postal_code", values.postal_code);
    ApiServices.authenticate(formData, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);

        if (result?.success) {
          setMessageColor(theme.colors.primary)
          setMessage(result?.message);
          setIsMessage(true);
          setloading(false);
          setTimeout(() => {
            setIsMessage(false);
            navigation.navigate("TwoFAScreen", {
              data: result?.data,
              email: values.email,
            });
            setIsDisable(false);
          }, 500);
        } else {
          setIsMessage(true);
          setloading(false);
          setIsDisable(false);
          setMessageColor(theme.colors.red)

          if (result?.message == "Incorrect password. Please try again.") {
            setMessage("User already exist");
          } else if (result?.message?.name) {
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
        setMessageColor(theme.colors.red)

        setMessage(response?.message);
        setIsMessage(true);
        setloading(false);
        setIsDisable(false);
      }
    });
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
          paddingTop: sizeHelper.calHp(20),
          gap: sizeHelper.calWp(30),
        }}
      >
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "space-between",
            gap: sizeHelper.calWp(30),
            paddingBottom: sizeHelper.calHp(30),
          }}
        >
          <View>
            <CustomText
              text={"Please"}
              fontWeight="700"
              fontFam={fonts.Poppins_Bold}
              color={theme.colors.primary}
              size={50}
            />
            <CustomText
              text={"Sign Up Account"}
              fontWeight="700"
              fontFam={fonts.Poppins_Bold}
              // style={{lineHeight: 40}} // ✅ Add lineHeight close to font size
              color={theme.colors.primary}
              size={50}
            />
          </View>

          <CustomText
            text={"Pleae Sign up to your account and enjoy your experience"}
            color={theme.colors.secondry}
            size={25}
          />
          <View style={{ flex: 1 }}>
            <View style={{ gap: sizeHelper.calWp(20) }}>
              <CustomInput
                label={"Name"}
                focusedInput={focusedInput}
                complusory
                leftSource={icons.user}
                value={values.name}
                onChangeText={(txt: string) => {
                  setValues({ ...values, name: txt });
                }}
                placeholder="Name"
                inputKey="name"
                setFocusedInput={setFocusedInput}
              />
              <CustomInput
                label={"Shop Name"}
                complusory
                focusedInput={focusedInput}
                value={values.shop_name}
                onChangeText={(txt: string) => {
                  setValues({ ...values, shop_name: txt });
                }}
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

                  // Optional: restrict length to 10 digits (UK local number)
                  // if (localNumber.length > 10) return;

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
                focusedInput={focusedInput}
                complusory
                keyboard={"email-address"}
                leftSource={icons.email}
                autoCapitalize={"none"}
                value={values.email}
                onChangeText={(txt: string) =>
                  setValues({ ...values, email: txt.trim() })
                }
                placeholder="John@email.com"
                inputKey="email"
                setFocusedInput={setFocusedInput}
              />
              <CustomInput
                label={"Password"}
                focusedInput={focusedInput}
                complusory
                leftSource={icons.lock}
                rightSource={showPassword ? icons.hidden : icons.eye}
                placeholder="Password"
                error={errors?.password_error}
                secureTextEntry={showPassword}
                value={values.password}
                rightIconPress={() => setShowPassword(!showPassword)}
                onChangeText={(txt: string) => {
                  setValues({ ...values, password: txt });

                  if (!passwordRegex.test(txt)) {
                    setErrors({
                      ...errors,
                      password_error:
                        "Your password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character",
                    });
                  } else {
                    setErrors({ ...errors, password_error: "" });
                  }
                }}
                inputKey="password"
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
                maxLength={30}
                focusedInput={focusedInput}
                value={values.city}
                onChangeText={(txt: string) => {
                  setValues({ ...values, city: txt.trim() });
                }}
                leftSource={icons.city}
                placeholder="City"
                inputKey="city"
                setFocusedInput={setFocusedInput}
              />

              <CustomInput
                label={"Postal Code"}
                maxLength={20}
                complusory
                focusedInput={focusedInput}
                value={values.postal_code}
                onChangeText={(txt: string) => {
                  setValues({ ...values, postal_code: txt });
                }}
                leftSource={icons.postal_code}
                placeholder="Postal Code"
                inputKey="postalcode"
                setFocusedInput={setFocusedInput}
              />
            </View>

            <View style={styles.botttom}>
              <CustomButton
                onPress={onSignup}
                disable={isDisable}
                text="Signup"
                width={"100%"}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={{
                  ...appStyles.row,
                  gap: sizeHelper.calWp(7),
                  alignSelf: "center",
                }}
              >
                <CustomText
                  text={"Have account?"}
                  color={theme.colors.secondry}
                  size={20}
                />
                <CustomText
                  text={"Login"}
                  fontFam={fonts.Poppins_Medium}
                  fontWeight="600"
                  color={theme.colors.primary}
                  size={20}
                />
              </TouchableOpacity>
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

export default SignupScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingTop: "10%",
  },
});
