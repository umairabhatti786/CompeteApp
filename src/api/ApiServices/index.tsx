import { URLS } from "../Urls";
import { getApiUrl, getAuthHeader, getBasicAuthHeaders } from "../config";

export const ApiServices = {
  authenticate: async (data: any, callback: any) => {
    const headers = getBasicAuthHeaders();

    let config = {
      method: "post",
      headers,
      body: data,
    };
    console.log("configAuth", config);

    try {
      fetch(getApiUrl(URLS.AUTH), config)
        .then((response) => response.text())
        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  authenticateOtp: async (data: any, callback: any) => {
    const headers = getBasicAuthHeaders();
    let config = {
      method: "POST",
      headers,
      body: data,
    };
    console.log("Otpid",getApiUrl(URLS.AUTHENTICATE_OTP),data)
    try {
      fetch(getApiUrl(URLS.AUTHENTICATE_OTP), config)
        .then((response) => response.text())
        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  resendOtp: async (data: any, callback: any) => {
    const headers = getBasicAuthHeaders();

    let config = {
      method: "post",
      headers,
      body: data,
    };
    try {
      fetch(getApiUrl(URLS.RESEND_OTP), config)
        .then((response) => response.text())
        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  forgotPassword: async (data: any, callback: any) => {
    const headers = getBasicAuthHeaders();

    let config = {
      method: "post",
      headers,
      body: data,
    };
    try {
      fetch(getApiUrl(URLS.FORGOT_PASSWORD), config)
        .then((response) => response.text())
        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  // GetCategories: async (data: any, callback: any) => {
  //   const headers = getBasicAuthHeaders();

  //   let config = {
  //     method: 'GET',
  //     headers,
  //   };
  //   try {
  //     fetch(getApiUrl(URLS.PRODUCT_CATEGORIES), config)
  //       .then(response => response.text())
  //       .then(result => callback({isSuccess: true, response: result}))
  //       .catch(error => callback({isSuccess: false, response: error}));
  //   } catch (error) {
  //     return {isSuccess: false, error: error};
  //   }
  // },

  GetCategories: async (callback: any) => {
    const headers = getBasicAuthHeaders();

    let config = {
      method: "GET",
      headers,
    };
    try {
      const response = await fetch(getApiUrl(URLS.PRODUCT_CATEGORIES), config);

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetProducts: async (params: any, callback: any) => {
    const headers = getBasicAuthHeaders();

    let config = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(
        getApiUrl(
          URLS.GET_PRODUCT +
            `?search_query=${params?.search}&product_category_id=${params?.id}&user_id=${params?.user_id}&page=${params?.page}`
        ),
        config
      );

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetNotification: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);
    console.log("params", params);

    let config = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(
        getApiUrl(
          URLS.GET_NOTIFICATION
        ),
        config
      );

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetStoreSetting: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);

    let config = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(getApiUrl(URLS.STORE_SETTING), config);

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetFavourits: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);
    let config = {
      method: "POST",
      headers,
      body: params?.data,
    };
    try {
      const response = await fetch(getApiUrl(URLS.FAVOURITS), config);
      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetOrderDetail: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);
    console.log("params", params);

    let config = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(
        getApiUrl(URLS.ORDER_DETAIL + `/${params?.id}`),
        config
      );

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  DleteAccount: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);
    console.log("params", params);

    let config = {
      method: "DELETE",
      headers,
    };

    try {
      const response = await fetch(
        getApiUrl(URLS.DELETE_USER + `/${params?.id}`),
        config
      );

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetOrderHoistory: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);
    console.log("params", params);

    let config = {
      method: "GET",
      headers,
    };

    try {
      const response = await fetch(getApiUrl(URLS.ORDER_HISTORY+`?order_status=${params?.order_status}&page=${params?.page}`), config);

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  GetHomePageContent: async (params: any, callback: any) => {
    const headers = getBasicAuthHeaders();
    let config = {
      method: "GET",
      headers,
    };
    try {
      const response = await fetch(
        getApiUrl(URLS.GET_HOME_PAGE_CONTENT),
        config
      );

      const result = await response.json();
      callback({ isSuccess: true, response: result });
    } catch (error) {
      callback({ isSuccess: false, response: error });
    }
  },

  updateProfilePicture: async (params: any, callback: any) => {
    console.log("params", params);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const headers = getAuthHeader(params?.token);

    // const headers = getAuthHeader(params?.token);

    let config = {
      method: "POST",
      headers,
      body: params?.data,
    };
    try {
      fetch(getApiUrl(URLS.UPDATE_PROFILE_PICTURE), config)
        .then((response) => response.text())

        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  updateProfile: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);

    let config = {
      method: "post",
      headers,
      body: params?.form,
    };
    try {
      fetch(getApiUrl(URLS.UPDATE_PROFILE), config)
        .then((response) => response.text())

        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  AddRemoveFavourit: async (params: any, callback: any) => {
    const headers = getAuthHeader(params?.token);
    let config = {
      method: "post",
      headers,
      body: params?.form,
    };
    try {
      fetch(getApiUrl(URLS.FAVOURITS), config)
        .then((response) => response.text())

        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },

  placeOrder: async (params: any, callback: any) => {
    var raw = JSON.stringify(params?.data);
    const headers = getAuthHeader(params?.token);
    let config = {
      method: "post",
      headers,
      body: raw,
    };
    try {
      fetch(getApiUrl(URLS.PLACE_ORDER), config)
        .then((response) => response.text())
        .then((result) => callback({ isSuccess: true, response: result }))
        .catch((error) => callback({ isSuccess: false, response: error }));
    } catch (error) {
      return { isSuccess: false, error: error };
    }
  },
};
