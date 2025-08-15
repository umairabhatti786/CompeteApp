import { SafeAreaView, View } from "react-native";
import React, { useMemo, useCallback } from "react";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { theme } from "../../utils/Themes";

const CustomBottomSheet = (props: any) => {
  const {
    setIsSelectQuantityVisible,
    bottomSheetModalRef,
    snapTo,
    onDismiss,
    children,
    snap,
    handleSheetChanges,
    enableContentPanningGesture
    
  } = props;

  const snapPoints = useMemo(() => ["60%"], []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        bottomSheetModalRef.current?.close();
        props?.setIsSelectQuantityVisible?.(null)

      };
    }, [])
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enableHandlePanningGesture={true} // ✅ Still allows dragging from handle

      backdropComponent={(props) => (
        <Backdrop {...props}
        setIsSelectQuantityVisible={setIsSelectQuantityVisible}
         bottomSheetModalRef={bottomSheetModalRef} />
      )}
      snapPoints={snapPoints}
      index={1} // start at half-open
      backgroundStyle={{backgroundColor:theme.colors.background}}
      onDismiss={props?.onDismiss}
    >
      <BottomSheetScrollView 
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        
   >
        <SafeAreaView>
          <View style={{ paddingBottom: 30 }}>{children}</View>
        </SafeAreaView>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const Backdrop = ({ animatedIndex, bottomSheetModalRef, style,setIsSelectQuantityVisible }: any) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [1, 1],
      [1, 1],
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(0,0,0,0.6)",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View
      onTouchStart={() => 
        {
          setIsSelectQuantityVisible?.(null)
          bottomSheetModalRef.current?.close()
        }
        }
      style={containerStyle}
    />
  );
};
export default CustomBottomSheet;
