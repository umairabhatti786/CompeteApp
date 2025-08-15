import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import { useInternetConnectivity } from "../../../utils/CommonHooks/UseInternetConnectivity";
import { fonts } from "../../../utils/Themes/fonts";
import { theme } from "../../../utils/Themes";
import CustomText from "../../../components/Text";
import CustomButton from "../../../components/Button";
import sizeHelper from "../../../utils/Helpers";

const InternetConnection = ({ navigation }: any) => {
  const { isVisible, counter } = useInternetConnectivity();

  return (
    <Modal visible={isVisible}>
      <View style={{ flex: 1, alignItems: "center", paddingTop: "45%" }}>
        <LottieView
          style={{
            width: sizeHelper.calWp(400),
            height: sizeHelper.calWp(400),
          }}
          source={require("../../../assets/json/plug.json")}
          renderMode="HARDWARE"
          autoPlay
          loop
        />

        <View
          style={{
            paddingHorizontal: sizeHelper.calWp(50),
            paddingTop: sizeHelper.calHp(50),
            gap: sizeHelper.calHp(50),
            alignItems: "center",
            width: "100%",
          }}
        >
          <CustomText
            text={"Ooops! An unexpected error occured"}
            size={30}
            style={{
              textAlign: "center",
              marginHorizontal: sizeHelper.calWp(50),
            }}
            fontWeight="700"
            lineHeight={30}
            fontFam={fonts.Poppins_Bold}
            color={theme.colors.primary}
          />

          <CustomText
            text={
              "Make sure wifi or cellular data is turned on and then try again"
            }
            size={23}
            style={{
              textAlign: "center",
              paddingHorizontal: sizeHelper.calWp(50),
            }}
            fontWeight="500"
            lineHeight={22}
            color={theme.colors.black}
          />

          <CustomButton
            text={"Retry"}
            width={"100%"}
            fontWeight="600"
            // borderRadius={10}
            // onPress={onPress}
          />
        </View>
      </View>
    </Modal>
  );
};

export default InternetConnection;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    lineHeight: 48,
    marginTop: 24,
  },
  bottomText: {
    lineHeight: 24,
    marginTop: 16,
    textAlign: "center",
  },
});
