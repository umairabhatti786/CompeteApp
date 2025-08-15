import {ScrollView, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import sizeHelper, {screenWidth, screentHeight} from '../Helpers';
import {appStyles} from '../GlobalStyles';

export const ViewAllProductLayout = ({}) => {
  const DEVICE_WIDTH = screenWidth - 40;

  return (
    <>
      <SkeletonPlaceholder>
        <View style={{gap: sizeHelper.calHp(20)}}>
          <View style={{...appStyles.row, gap: sizeHelper.calWp(20),marginBottom:sizeHelper.calHp(10)}}>
            {[1, 2, 3].map((item, index) => {
              return (
                <View
                  style={{
                    height: sizeHelper.calHp(60),
                    width: '30.5%',
                    borderRadius: sizeHelper.calWp(15),
                  }}
                />
              );
            })}
          </View>

          {[1, 2, 3, 4, 5, 6,7].map((item, index) => {
            return (
              <View
                style={{
                  height: sizeHelper.calHp(150),
                  // width: '100%',
                  borderRadius: sizeHelper.calWp(15),
                  marginRight: sizeHelper.calWp(20),
                }}
              />
            );
          })}
        </View>
      </SkeletonPlaceholder>
    </>
  );
};
