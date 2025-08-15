import {ScrollView, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import sizeHelper, {screenWidth, screentHeight} from '../Helpers';
import {appStyles} from '../GlobalStyles';

export const OrderHistoryLayout = ({}) => {
  const DEVICE_WIDTH = screenWidth - 40;

  return (
    <>
      <SkeletonPlaceholder>
        <View style={{gap: sizeHelper.calHp(40),}}>
         

          {[1, 2, 3, 4, 5, 6,7].map((item, index) => {
            return (
              <View
                style={{
                  height: sizeHelper.calHp(150),
                  // width: '100%',
                  borderRadius: sizeHelper.calWp(15),
                  // marginRight: sizeHelper.calWp(10),
                }}
              />
            );
          })}
        </View>
      </SkeletonPlaceholder>
    </>
  );
};
