import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomText from "../../../components/Text";
import { fonts } from "../../../utils/Themes/fonts";
import { theme } from "../../../utils/Themes";
import images from "../../../utils/Constants/images";
import icons from "../../../utils/Constants/icons";
import { appStyles } from "../../../utils/GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, setUserData } from "../../../redux/reducers/authReducer";
import ImagePicker from "react-native-image-crop-picker";
import { usePermissions } from "../../../utils/Permissions";
import { openSettings } from "react-native-permissions";
import {
  compressImage,
  isIpad,
  sessionCheck,
} from "../../../utils/CommonHooks";
import { ApiServices } from "../../../api/ApiServices";
import { AUTH_DATA, StorageServices } from "../../../utils/StorageService";
import CustomToast from "../../../components/CustomToast";
import LogoutModal from "../../../components/LogoutModal";
import ScreenLoader from "../../../components/ScreenLoader";

const ProfileScreen = ({ navigation }: any) => {
  const { hasGalleryPermission, requestGalleryPermission } = usePermissions();
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const auth = useSelector(getUserData);
  console.log("auth", auth);
  const dispatch = useDispatch();
  const [isMessage, setIsMessage] = useState<any>(false);
  const [message, setMessage] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [actionLaoding, setActionLoading] = useState(false);

  const uplaodPicture = (data: any) => {
    let form = {
      data: data,
      token: auth?.token,
    };
    ApiServices.updateProfilePicture(form, async (res: any) => {
      console.log("ckdncd", res);

      let result = JSON.parse(res.response);

      if (result?.success) {
        setLoading(false);
        setImgLoading(false);
        setIsMessage(true);
        setMessage(result?.message);
        console.log("ckdnbckdbcd", result);
        dispatch(
          setUserData({
            ...auth,
            profile_picture: result?.data?.profile_picture,
          })
        );
        StorageServices.setItem(AUTH_DATA, {
          ...auth,
          profile_picture: result?.data?.profile_picture,
        });
      } else {
        setImgLoading(false);
        setLoading(false);
        if (result?.app_update_status == 1 || result?.session_expire) {
          sessionCheck(
            result?.app_update_status,
            result?.session_expire,
            "",
            dispatch,
         
            navigation
          );
          return;
        }
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

        

        setMessage(result?.error);
        setIsMessage(true);
      
      }
    });
  };

  const onDeleteAccount = () => {
    setActionLoading(true);
    let param = {
      token: auth?.token,

      id: auth?.id,
    };
    ApiServices.DleteAccount(param, async ({ isSuccess, response }: any) => {
      if (isSuccess) {
        console.log("AccountDelete", response);

        if (response?.success) {
          setActionLoading(false);
          setMessage("Account deleted successfully");
          setIsMessage(true);
          dispatch(setUserData(null));
          StorageServices.removeAll();
        } else {
          setActionLoading(false);

          if (response?.app_update_status == 1 || response?.session_expire) {
            sessionCheck(
              response?.app_update_status,
              response?.session_expire,
              dispatch,
              navigation
            );
            return;
          }
        }
      } else {
        setMessage(response?.error);
        setIsMessage(true);
        setActionLoading(false);
      }
    });
  };

  const onUpdate = async () => {
    let gallerypermission = await requestGalleryPermission();
    console.log("gallerypermission", gallerypermission);
    if (gallerypermission == "granted" || gallerypermission == "limited") {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        mediaType: "photo",
        forceJpg: true,
      }).then(async (result) => {
        if (result) {
          const fileName = result?.path?.split("/").pop();
          let data = {
            ...result,
            fileName: fileName,
            name: fileName,
            size: result?.size,
            height: result?.height,
            type: result?.mime,
            uri: result?.path,
            width: result?.width,
          };
          const compressable = await compressImage(data?.uri);
          data["uri"] = compressable;

          const formData = new FormData();
          setLoading(true);
          setImgLoading(true);
          formData.append("user_id", auth?.id);
          formData.append("profile_picture", data);
          // formData.append('file', data);
          // cons

          uplaodPicture(formData);
        }
      });
    } else {
      if (gallerypermission == "blocked") {
        Alert.alert(
          'Photo Access Needed',
          'To upload photos, please allow access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if(Platform.OS == "ios"){
                  openSettings()
                }
                else {
                  Linking.openSettings();

                }

              },
            },
          ],
        );
      
      }
    }
  };
  console.log(
    "ckdnckcdcdd",
    "https://ambapp.ambweblearning.com/assets/" + auth?.profile_picture
  );
  const ProfileDeail = ({
    title,
    onPress,
    icon,
    color,
    disableDivider,
  }: any) => {
    return (
      <TouchableOpacity onPress={onPress} style={{ gap: sizeHelper.calHp(35) }}>
        <TouchableOpacity
          onPress={onPress}
          style={{
            ...appStyles.rowjustify,
            paddingHorizontal: sizeHelper.calWp(25),
          }}
        >
          <View style={{ ...appStyles.row, gap: sizeHelper.calWp(25) }}>
            <Image
              style={{
                width: sizeHelper.calWp(40),
                height: sizeHelper.calWp(40),
                tintColor: color || theme.colors.primary,
              }}
              source={icon}
            />

            <CustomText
              text={title}
              fontFam={fonts.Poppins_Medium}
              fontWeight="600"
              color={color || theme.colors.secondry}
              size={23}
            />
          </View>

          <Image
            style={{
              width: sizeHelper.calWp(42),
              height: sizeHelper.calWp(42),
              tintColor: theme.colors.primary,
            }}
            source={icons.right_arrow}
          />
        </TouchableOpacity>
        {!disableDivider && (
          <View
            style={{
              width: "100%",
              height: sizeHelper.calHp(1.5),
              backgroundColor: theme.colors.gray,
              borderRadius: 999,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          gap: sizeHelper.calWp(35),
          paddingTop: sizeHelper.calHp(20),
          paddingHorizontal: sizeHelper.calWp(isIpad ? 30 : 40),
        }}
      >
        <CustomText
          text={"Profile"}
          fontWeight="600"
          style={{ textAlign: "center" }}
          fontFam={fonts.Poppins_SemiBold}
          color={theme.colors.secondry}
          size={25}
        />
        <View style={{ alignSelf: "center" }}>
          <Image
            style={{
              width: sizeHelper.calWp(220),
              height: sizeHelper.calWp(220),
              borderRadius: sizeHelper.calWp(220),
              // tintColor: theme.colors.text_black + '70',
            }}
            source={{uri:auth?.profile_picture}}
          />
          {imgLoading && (
            <View
              style={{
                position: "absolute",
                width: sizeHelper.calWp(60),
                height: sizeHelper.calWp(60),
                top: "40%",
                alignSelf: "center",
              }}
            >
              <ActivityIndicator size="small" color={theme.colors.black} />
            </View>
          )}

          <TouchableOpacity
            onPress={onUpdate}
            style={{
              position: "absolute",
              bottom: sizeHelper.calHp(3),
              right: 0,
              width: sizeHelper.calWp(70),
              height: sizeHelper.calWp(70),
              borderRadius: sizeHelper.calWp(70),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={onUpdate}
              style={{
                width: sizeHelper.calWp(55),
                height: sizeHelper.calWp(55),
                backgroundColor: theme.colors.primary,
                borderRadius: sizeHelper.calWp(55),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  width: "65%",
                  height: "65%",
                  tintColor: theme.colors.white,
                }}
                source={icons.edit}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <CustomText
          text={`${auth?.name}`}
          fontWeight="700"
          style={{ textAlign: "center" }}
          fontFam={fonts.Poppins_Bold}
          color={theme.colors.secondry}
          size={27}
        />
        <View
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: sizeHelper.calWp(20),
            paddingVertical: sizeHelper.calHp(40),
            gap: sizeHelper.calHp(30),
            marginTop: sizeHelper.calHp(40),
          }}
        >
          <ProfileDeail
            icon={icons.edit}
            onPress={() => navigation.navigate("EditProfileScreen")}
            title="Edit Profile"
          />
          <ProfileDeail
            icon={icons.terms_and_conditions}
            onPress={() => navigation.navigate("TermAndCondition")}
            title={"Term and Conditions"}
          />
          <ProfileDeail
            onPress={() => navigation.navigate("AboutUsScreen")}
            icon={icons.about_us}
            title={"About us"}
          />
          <ProfileDeail
            onPress={() => setIsLogoutVisible(true)}
            icon={icons.logout}
            title={"Logout"}
            color={theme.colors.red}
          />

          <ProfileDeail
            onPress={() =>
              Alert.alert(
                `Alert!`,
                `Are you sure you want to delete this account?`,

                [
                  {
                    text: `Ok`,
                    onPress: () => onDeleteAccount(),
                  },
                  {
                    text: `Cancel`,
                  },
                ]
              )
            }
            icon={icons.trash}
            title={"Delete Account"}
            color={theme.colors.red}
          />
        </View>
      </ScreenLayout>

      <CustomToast
        isVisable={isMessage}
        setIsVisable={setIsMessage}
        message={message}
      />

      <LogoutModal
        modalVisible={isLogoutVisible}
        setModalVisible={setIsLogoutVisible}
        onCancel={() => {
          setIsLogoutVisible(false);
        }}
        onLogoutUser={() => {
          setIsLogoutVisible(false);
          dispatch(setUserData(null));
          StorageServices.removeAll();
        }}
      />
      {actionLaoding && <ScreenLoader />}
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  botttom: {
    gap: sizeHelper.calHp(20),
    paddingBottom: "10%",
  },
});
