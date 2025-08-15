import React, { useMemo } from "react";
import { Text, StyleProp, TextStyle } from "react-native";
import { TextType } from "../../utils/Types";
import { theme } from "../../utils/Themes";
import { fonts } from "../../utils/Themes/fonts";
import sizeHelper from "../../utils/Helpers";

const CustomText = ({
  color,
  size,
  fontFam,
  text,
  style,
  lineHeight,
  numberOfLines,
  fontWeight,
  textDecorationLine,
  label,
  textTransform,
}: TextType) => {
  const memoizedStyle = useMemo(() => {
    const baseStyle = {
      color: color || theme.colors.black,
      fontSize: sizeHelper.calHp(size || 30),
      fontWeight: fontWeight || "500",
      fontFamily: fontFam || fonts.Poppins_Regular,
      textTransform,
      textDecorationLine,
      ...(lineHeight ? { lineHeight } : {}),
    };

    return [baseStyle, style] as StyleProp<TextStyle>;
  }, [
    color,
    size,
    fontFam,
    fontWeight,
    textTransform,
    textDecorationLine,
    lineHeight,
    style,
  ]);

  return (
    <Text numberOfLines={numberOfLines} allowFontScaling={false} style={memoizedStyle}>
      {text}
      {label}
    </Text>
  );
};

export default React.memo(CustomText);
