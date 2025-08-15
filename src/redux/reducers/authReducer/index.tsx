import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface SignupState {
  name: string;
  phoneNumber: string;
  countryFlag: string;
  isRemember: boolean;
  otpCode: string;
  onboadring: boolean;
  isAddressModal: boolean;
}
export interface AuthState {
  user: any;
  notificationAlert: boolean;


}
export const initialState: AuthState = {
  user: null,
  notificationAlert: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   
    setUserData: (state, { payload }: PayloadAction<any>) => {
      state.user = payload;
    },
 
  },
});

export const {
    setUserData
} = authSlice.actions;
export default authSlice.reducer;


export const getUserData = (state: RootState) => state?.auth.user;
export const getNotificationAlert = (state: RootState) =>
  state?.auth.notificationAlert;
export const getToken = (state: RootState) => state?.auth.user?.token;
