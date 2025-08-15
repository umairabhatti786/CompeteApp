import { useEffect, useState } from "react";
import { Platform, PermissionsAndroid, Linking } from "react-native";
import { PERMISSIONS, request, check } from "react-native-permissions";


const usePermissions = () => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const requestGalleryPermission = async () => {
    console.log("permissionStatus")
    try {
      let permissionStatus;
      if (Platform.OS === "ios") {
        permissionStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      } else {
        let READ_MEDIA_IMAGES = await request(
          PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        );
        if (READ_MEDIA_IMAGES === "unavailable") {
          permissionStatus = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          );
        } else {
          permissionStatus = READ_MEDIA_IMAGES;
        }
      }

      console.log("permissionStatus",permissionStatus)

      return permissionStatus
    } catch (error) {
      console.error("Error checking gallery permission:", error);
    }
  };


  return {
    hasGalleryPermission,
    requestGalleryPermission,
  
  };
};

export { usePermissions };
