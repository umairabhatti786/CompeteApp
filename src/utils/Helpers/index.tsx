import {Dimensions, PixelRatio} from 'react-native';

const screenSize = Dimensions.get('window');

export const screentHeight = screenSize.height;
export const screenWidth = screenSize.width;
const Height = 1334;
const Width = 750;
//console.log('height, width ', screenSize)
const calHp = (HP:any) => {
  let heightPixel = HP; //- HP * 0.28
  let calculatedHeight =
    ((screentHeight > 1330 ? heightPixel : heightPixel) / Height) * 100;
  const elemHeight =
    typeof calculatedHeight === 'number'
      ? calculatedHeight
      : parseFloat(calculatedHeight);
  let heightDP = PixelRatio.roundToNearestPixel(
    (screentHeight * elemHeight) / 100,
  );
  return heightDP;
};

const calWp = (WP:any) => {
  let widthPixel = WP; //- WP * 0.28
  let calculatedWidth =
    ((screenWidth > 500 ? widthPixel : widthPixel) / Width) * 100;

  const elemWidth =
    typeof calculatedWidth === 'number'
      ? calculatedWidth
      : parseFloat(calculatedWidth);
  let widthDP = PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
  return widthDP;
};

const sizeHelper = {
  calHp,
  calWp,
  screentHeight,
  screenWidth,
};

export default sizeHelper;
