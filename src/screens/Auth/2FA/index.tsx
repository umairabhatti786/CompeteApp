import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import { theme } from "../../../utils/Themes";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomButton from "../../../components/Button";
import CustomText from "../../../components/Text";
import { fonts } from "../../../utils/Themes/fonts";
import CustomHeader from "../../../components/Header/inde";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { ApiServices } from "../../../api/ApiServices";
import CustomToast from "../../../components/CustomToast";
import ScreenLoader from "../../../components/ScreenLoader";
import { CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/reducers/authReducer";
import {
  AUTH_DATA,
  StorageServices,
  TOKEN,
} from "../../../utils/StorageService";
import { NotificationServices, isIpad } from "../../../utils/CommonHooks";

const TwoFAScreen = ({ navigation, route }: any) => {
  let data = route?.params?.data;
  let email = route?.params?.email;
  const [value, setValue] = useState("");
  const [isWrongOtp, setIsWrongOtp] = useState(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [messageColor, setMessageColor] = useState(theme.colors.primary);
  const [loading, setLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const dispatch = useDispatch();
  const [otpCode, setOtpCode] = useState(data?.otp_code);
  const ref = useBlurOnFulfill({ value, cellCount: 4 });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  console.log("kdnkdnc", email);

  const onHandleOTP = async () => {
    const deviceState = await NotificationServices.getDeviceStatus();
    console.log("deviceState", deviceState);
    setLoading(true);

    const formdata = new FormData();
    console.log("value", data?.id);
    formdata.append("otp_code", value);
    formdata.append("user_id", data.id);
    formdata.append("device_id", deviceState);
    ApiServices.authenticateOtp(
      formdata,
      async ({ isSuccess, response }: any) => {
        console.log("responseHabdleotp", response);

        if (isSuccess) {
          let result = JSON.parse(response);
          if (result?.success) {
            setMessageColor(theme.colors.primary);

            setLoading(false);
            setMessage(result?.message);
            setValue("");
            setIsMessage(true);

            console.log("token", TOKEN, result?.token);
            setTimeout(() => {
              dispatch(setUserData(result?.data));
              StorageServices.setItem(TOKEN, result?.data?.token);
              StorageServices.setItem(AUTH_DATA, result?.data);
              setIsWrongOtp(false);
              setValue("");
              if (result?.data?.status == '1') {
                dispatch(setUserData(result?.data));
                StorageServices.setItem(TOKEN, result?.token);
                StorageServices.setItem(AUTH_DATA, result?.data);

                // navigation.replace('Login');
                setIsWrongOtp(false);
                setValue('');
              }
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "BottomTab" }],
                })
              );
              
            }, 500);

            return
          }

          if (result?.message == "Your account status is inactive") {
            setLoading(false);
            setIsWrongOtp(false);
            setMessageColor(theme.colors.primary);

            Alert.alert("Alert", "Your account status is inactive", [
              { text: "OK", onPress: () => navigation.navigate("Login") },
            ]);

            return;
          } else {;
            if (
              result?.message ==
              "Your account has been successfully created. However, it is currently under review by the administrator. You will be notified once it is approved and activated"
            ) {
              setLoading(false);
              setIsWrongOtp(false);
              setMessageColor(theme.colors.primary);

              Alert.alert(
                "Alert",
                "Your account has been successfully created. However, it is currently under review by the administrator. You will be notified once it is approved and activated",
                [{ text: "OK", onPress: () => navigation.navigate("Login") }]
              );

              return;
            }


            setLoading(false);
            setMessage(result?.message);
            setIsWrongOtp(true);
            setMessageColor(theme.colors.red);
            setIsMessage(true);
            setIsDisable(false);
            setValue("");
          }
        } else {
          setLoading(false);
          setMessage(response?.message);
          setIsMessage(true);
          setMessageColor(theme.colors.red);
          setIsDisable(false);
          setValue("");
        }
      }
    );
  };

  const resendOtp = async () => {
    const formData = new FormData();
    setLoading(true);
    formData.append("user_id", data?.id);
    ApiServices.resendOtp(formData, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        let result = JSON.parse(response);
        if (result?.success) {
          setLoading(false);
          setMessage(result?.message);
          setMessageColor(theme.colors.primary)
          setOtpCode(result?.data?.otp_code);
          setValue("");
          setIsMessage(true);
        } else {
          setLoading(false);
          setMessageColor(theme.colors.red)
          setMessage(result?.message);
          setValue("");
          setIsMessage(true);
        }
      } else {
        setLoading(false);
        setMessage(response?.message);
        setIsMessage(true);
        setMessageColor(theme.colors.red);
        setIsDisable(false);
        setValue("");
      }
    });
  };

  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
          gap: sizeHelper.calWp(30),
          paddingTop: sizeHelper.calHp(10),
        }}
      >
        <CustomHeader />
        <TouchableWithoutFeedback
          style={{ flex: 1, gap: sizeHelper.calWp(30) }}
          onPress={() => Keyboard.dismiss()}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, gap: sizeHelper.calHp(30) }}
            keyboardVerticalOffset={
              Platform.OS === "ios" ? sizeHelper.calHp(40) : 10
            }
          >
            <View>
              <CustomText
                text={"Two-Factor"}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.primary}
                size={50}
              />
              <CustomText
                text={"Authentication"}
                fontWeight="700"
                fontFam={fonts.Poppins_Bold}
                color={theme.colors.primary}
                size={50}
              />
            </View>

            <View style={{ gap: sizeHelper.calHp(4) }}>
              <CustomText size={22} text={"Please Check Your Email."} />

              <CustomText
                size={20}
                text={"We've sent a code to "}
                color={theme.colors.text_black}
                label={
                  <CustomText
                    size={20}
                    fontWeight="600"
                    fontFam={fonts.Poppins_Bold}
                    text={email}
                  />
                }
              />
            </View>
            <View style={{ flex: 1, marginTop: sizeHelper.calHp(30) }}>
              <CodeField
                ref={ref}
                {...props}
                caretHidden={true}
                value={value}
                onChangeText={(value) => {
                  setValue(value);
                  setIsWrongOtp(false);
                }}
                cellCount={4}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    onLayout={getCellOnLayoutHandler(index)}
                    key={index}
                    style={{
                      ...styles.codeFieldCell,
                      borderColor: isWrongOtp
                        ? theme.colors.red
                        : isFocused
                        ? "#10451D"
                        : "#B6B6B7",
                      backgroundColor: isWrongOtp
                        ? theme.colors.red + "30"
                        : isFocused
                        ? "#B7EFC543"
                        : "#F0F0F1",
                    }}
                  >
                    <CustomText
                      size={32}
                      fontFam={fonts.Poppins_Bold}
                      fontWeight={"700"}
                      color={
                        isWrongOtp ? theme.colors.red : theme.colors.secondry
                      }
                      text={symbol || (isFocused ? <Cursor /> : "0")}
                    />
                  </View>
                )}
              />

              <TouchableOpacity
                disabled={isDisable}
                style={{
                  alignSelf: "center",
                  marginTop: sizeHelper.calHp(40),
                  paddingVertical: sizeHelper.calHp(5),
                }}
                onPress={() => resendOtp()}
              >
                <CustomText
                  text={"Resend Code"}
                  size={23}
                  fontFam={fonts.Poppins_Medium}
                  fontWeight={"600"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.botttom}>
              <CustomButton
                text="Continue"
                disable={isDisable || value.length < 4}
                bgColor={
                  value.length < 4 ? theme.colors.gray : theme.colors.primary
                }
                onPress={() => {
                  // setIsWrongOtp(true)
                  onHandleOTP();
                }}
                width={"100%"}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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

export default TwoFAScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: "10%",
  },

  codeFieldRoot: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: sizeHelper.calHp(60),
    gap: sizeHelper.calWp(50),
  },
  codeFieldCell: {
    justifyContent: "center",
    alignItems: "center",
    width: "18%",
    height: sizeHelper.calHp(isIpad ? 100 : 80),
    borderWidth: 1.5,
    borderRadius: sizeHelper.calWp(15),
    borderColor: theme.colors.button_gray,
  },
});
