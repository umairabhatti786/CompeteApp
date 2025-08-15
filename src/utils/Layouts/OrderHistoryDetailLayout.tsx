import {ScrollView, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import sizeHelper, {screenWidth, screentHeight} from '../Helpers';
import {appStyles} from '../GlobalStyles';

export const OrderHistoryDetailLayout = ({}) => {
  const DEVICE_WIDTH = screenWidth - 40;

  return (
    <>
      <SkeletonPlaceholder>
        <View style={{gap: sizeHelper.calHp(40)}}>

        <View style={appStyles.rowjustify}>
            <View
              style={{
                width: sizeHelper.calWp(100),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
             <View
              style={{
                width: sizeHelper.calWp(250),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
             <View
              style={{
                width: sizeHelper.calWp(70),
                height: sizeHelper.calWp(70),
                borderRadius: sizeHelper.calHp(70),
              }}
            />
            
          </View>
          <View style={appStyles.rowjustify}>
            <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
             <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
            
          </View>

          {[1, 2,3,4].map((item, index) => {
            return (
              <View
                style={{
                  height: sizeHelper.calHp(130),
                  // width: '100%',
                  borderRadius: sizeHelper.calWp(15),
                  // marginRight: sizeHelper.calWp(10),
                }}
              />
            );
          })}
            <View style={appStyles.rowjustify}>
            <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
             <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
            
          </View>

          <View style={appStyles.rowjustify}>
            <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
             <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
            
          </View>

          <View style={appStyles.rowjustify}>
            <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
             <View
              style={{
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(20),
                borderRadius: sizeHelper.calHp(5),
              }}
            />
            
          </View>

          <View
              style={{
                width: "100%",
                height: sizeHelper.calHp(70),
                borderRadius: sizeHelper.calHp(15),
              }}
            />
        </View>
      </SkeletonPlaceholder>
    </>
  );
};
