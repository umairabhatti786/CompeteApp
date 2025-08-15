import {ScrollView, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import sizeHelper, {screenWidth, screentHeight} from '../Helpers';
import {appStyles} from '../GlobalStyles';

export const HomeLayout = ({}) => {
  const DEVICE_WIDTH = screenWidth - 40;

  return (
    <>
      <SkeletonPlaceholder>
        <View style={{gap: sizeHelper.calHp(20)}}>
          <View
            style={{
              borderRadius: sizeHelper.calWp(8),
              width: sizeHelper.calWp(200),
              height: sizeHelper.calHp(25),
              marginBottom: sizeHelper.calHp(15),
            }}
          />
          <View style={{...appStyles.row, gap: sizeHelper.calWp(15)}}>
            {[1, 2, 3, 4].map((item, index) => {
              return (
                <View
                  style={{
                    height: screentHeight / 4,
                    width: screenWidth / 2.4,
                    borderRadius: sizeHelper.calWp(15),
                  }}
                />
              );
            })}
          </View>
          <View
            style={{
              ...appStyles.rowjustify,
              marginRight: sizeHelper.calWp(40),
              marginVertical: sizeHelper.calHp(15),
            }}>
            <View
              style={{
                borderRadius: sizeHelper.calWp(8),
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(25),
              }}
            />
            <View
              style={{
                borderRadius: sizeHelper.calWp(8),
                width: sizeHelper.calWp(200),
                height: sizeHelper.calHp(25),
                marginBottom: sizeHelper.calHp(15),
              }}
            />
          </View>

          <View style={{...appStyles.row, gap: sizeHelper.calWp(20)}}>
            {[1, 2, 3, 4].map((item, index) => {
              return (
                <View
                  style={{
                    height: sizeHelper.calHp(60),
                    width: sizeHelper.calWp(200),
                    borderRadius: sizeHelper.calWp(15),
                  }}
                />
              );
            })}
          </View>

          {[1, 2].map((item, index) => {
            return (
              <View
                style={{
                  height: sizeHelper.calHp(150),
                  width: '95%',
                  borderRadius: sizeHelper.calWp(15),
                  marginTop: sizeHelper.calHp(10),
                }}
              />
            );
          })}
        </View>
      </SkeletonPlaceholder>
    </>
  );
};
