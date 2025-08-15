import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../store';

export interface CartState {
  cartData: [];
  totalCartAmount: number;
  isViewCart: boolean;
  pickupType: string;
}

export const initialState: CartState = {
  cartData: [],
  totalCartAmount: 0,
  isViewCart: true,
  pickupType: '1',
};
const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    setCartData: (state, {payload}: PayloadAction<any>) => {
      console.log('payload', payload);
      state.cartData.push(payload);
    },
    setEmptyCard: (state, {payload}: PayloadAction<any>) => {
      state.cartData = initialState.cartData;
    },
    updateCart: (state, {payload}: PayloadAction<any>) => {
      state.cartData = payload;
    },
    setPickupType: (state, {payload}: PayloadAction<any>) => {
      state.pickupType = payload;
    },
    setIncrementCartItem: (state, {payload}: PayloadAction<any>) => {
      let myCartItem: any = state?.cartData;
      myCartItem[payload?.index] = {
        ...myCartItem?.[payload?.index],
        quantity: payload?.item?.quantity + 1,
      };

      myCartItem[payload?.index] = {
        ...myCartItem[payload?.index],
        priceByQty:
          payload?.item?.priceByQty + parseFloat(payload?.item?.price),
      };
      let currentTotal = myCartItem?.reduce(
        (accumulator: any, current: any) =>
          accumulator + parseFloat(current?.priceByQty),
        0.0,
      );
      state.totalCartAmount = currentTotal;
    },
    
    setUpdateMyCartDropDownItem: (state, {payload}: PayloadAction<any>) => {
      let myCartItem: any = state?.cartData;
      myCartItem[payload?.index] = {
        ...myCartItem?.[payload?.index],
        quantity: payload?.quantity,
      };

      myCartItem[payload?.index] = {
        ...myCartItem[payload?.index],
        priceByQty:
           parseFloat(payload?.item?.price)*payload?.quantity,
      };
      let currentTotal = myCartItem?.reduce(
        (accumulator: any, current: any) =>
          accumulator + parseFloat(current?.priceByQty),
        0.0,
      );
      state.totalCartAmount = currentTotal;
    },

    setRemoveCartItem: (state, {payload}: PayloadAction<any>) => {
      state.cartData = state.cartData.filter((item, index) => item != payload);
    },

    setTotalCartAmount: (state, {payload}: PayloadAction<any>) => {
      state.totalCartAmount = payload;
    },

    setDecrementCartItem: (state, {payload}: PayloadAction<any>) => {
      let myCartItem: any = state.cartData;
      if (payload?.item?.quantity == 1) {
        state.cartData = state?.cartData?.filter(
          (item, index) => index != payload?.index,
        );

        return;
      }
      myCartItem[payload?.index] = {
        ...myCartItem?.[payload?.index],
        quantity: payload?.item?.quantity - 1,
      };

      myCartItem[payload?.index] = {
        ...myCartItem[payload?.index],
        priceByQty:
          payload?.item?.priceByQty - parseFloat(payload?.item?.price),
      };
      let currentTotal = myCartItem?.reduce(
        (accumulator: any, current: any) =>
          accumulator + parseFloat(current?.priceByQty),
        0.0,
      );
      console.log('CgangrToelm', currentTotal);
      state.totalCartAmount = currentTotal;
    },

    setUpdateCartItem: (state, {payload}: PayloadAction<any>) => {
      let myCartItem: any = state.cartData;
      myCartItem[payload?.index] = {
        ...myCartItem?.[payload?.index],
        quantity:
          myCartItem[payload.index].quantity + Number(payload.product.quantity),
        priceByQty: Number(payload.product.price) * payload?.quantity,
        notes: payload?.product?.notes
          ? payload?.product?.notes
          : myCartItem[payload?.index]?.notes,
      };
    },

    setUpdateDropDownCartItem: (state, {payload}: PayloadAction<any>) => {
      let myCartItem: any = state.cartData;
      myCartItem[payload?.index] = {
        ...myCartItem?.[payload?.index],
        quantity:
          Number(payload?.quantity,),
        priceByQty: Number(payload.product.price) * payload?.quantity,
        notes: payload?.product?.notes
          ? payload?.product?.notes
          : myCartItem[payload?.index]?.notes,
      };
    },
    setViewCart: (state, {payload}: PayloadAction<any>) => {
      state.isViewCart = payload;
    },
  },
});

export const {
  setCartData,
  setIncrementCartItem,
  setDecrementCartItem,
  setTotalCartAmount,
  setViewCart,
  setEmptyCard,
  updateCart,
  setPickupType,
  setUpdateCartItem,
  setUpdateDropDownCartItem,
  setUpdateMyCartDropDownItem
} = cartSlice.actions;
export default cartSlice.reducer;
export const getCartData = (state: RootState) => state.cart.cartData;
export const getTotalCartAmount = (state: RootState) =>
  state.cart.totalCartAmount;
export const getPickupType = (state: RootState) => state.cart.pickupType;

export const getViewCart = (state: RootState) => state.cart.isViewCart;
