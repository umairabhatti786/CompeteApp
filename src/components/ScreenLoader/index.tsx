import React from "react";
import { ActivityIndicator, View } from "react-native";
import { theme } from "../../utils/Themes";

const ScreenLoader = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        zIndex: 1,
        position: "absolute",
        backgroundColor: 'rgba(0,0,0,.1)',
        justifyContent: "center",
        alignItems: "center",
      
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export default ScreenLoader;
