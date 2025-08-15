import React, { useMemo } from "react";
import { TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import CustomText from "../Text";
import { ButtonProps } from "../../utils/Types";
import { theme } from "../../utils/Themes";
import sizeHelper from "../../utils/Helpers";
import { fonts } from "../../utils/Themes/fonts";

const CustomButton = ({
  text,
  onPress,
  width,
  height,
  size,
  fontFam,
  borderRadius,
  style,
  bgColor,
  textColor,
  borderColor,
  disable = false,
  borderWidth,
  paddingHorizontal,
  fontWeight,
  children,
}: ButtonProps) => {
  const memoizedStyle = useMemo(() => {
    const baseStyle: ViewStyle = {
      width: width,
      height: sizeHelper.calHp(height || 75),
      backgroundColor: bgColor || theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: sizeHelper.calHp(borderRadius || 18),
      borderWidth: borderWidth || 0,
      borderColor: borderColor,
      paddingHorizontal: paddingHorizontal,
      flexDirection: "row",
      gap: sizeHelper.calWp(20),
    };

    return [baseStyle, style] as StyleProp<ViewStyle>;
  }, [
    width,
    height,
    bgColor,
    borderRadius,
    borderWidth,
    borderColor,
    paddingHorizontal,
    style,
  ]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      activeOpacity={0.5}
      style={memoizedStyle}
    >
      <CustomText
        text={text}
        color={textColor || theme.colors.white}
        size={size || 23}
        fontWeight={fontWeight || "600"}
        fontFam={fontFam || fonts.Poppins_Medium}
      />
      {children}
    </TouchableOpacity>
  );
};

export default React.memo(CustomButton);
