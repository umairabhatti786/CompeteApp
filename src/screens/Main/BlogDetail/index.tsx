import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import sizeHelper from "../../../utils/Helpers";
import ScreenLayout from "../../../components/ScreenLayout";
import CustomText from "../../../components/Text";
import { fonts } from "../../../utils/Themes/fonts";
import { theme } from "../../../utils/Themes";
import CustomHeader from "../../../components/Header/inde";
import { WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { htmlTagRegex } from "../../../utils/Regex";
const BlogDetail = ({ navigation, route }: any) => {
  const data = route?.params?.data;
  const blogDescription = data?.blog.replace(htmlTagRegex, "");
  console.log("Blogs",data)
  return (
    <>
      <ScreenLayout
        style={{
          flex: 1,
          paddingTop: sizeHelper.calHp(10),
          paddingHorizontal: sizeHelper.calWp(40),
        }}
      >
        <CustomHeader title={"Blog Details"} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingVertical: sizeHelper.calHp(20), gap: 5 }}>
            <CustomText
              text={data?.heading}
              size={27}
              style={{ width: WINDOW_WIDTH / 1.3 }}
              fontFam={fonts.Poppins_Bold}
              fontWeight="700"
              color={theme.colors.primary}
            />
            <CustomText
              text={data?.heading}
              size={20}
              color={theme.colors.text_black}
              style={{ width: WINDOW_WIDTH / 1.3 }}
            />
          </View>
          <View
            style={{
              width: "100%",
              height: sizeHelper.calHp(300),
            }}
          >
            <Image
              resizeMode="cover"
              source={{ uri: data?.header }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: sizeHelper.calWp(10),
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingTop: 10,
            }}
          ></View>

          <View
            style={{
              marginVertical: sizeHelper.calHp(20),
            }}
          >
            <CustomText
              style={{ textAlign: "justify" }}
              color={theme.colors.text_black}
              text={blogDescription}
              size={17}
              lineHeight={18}
            />
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
};

export default BlogDetail;
