import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from "@/model/AuthenticationModel";
import { localDataNames } from "@/constants/appInfos";
import { SubProductResponse } from "@/model/SubProduct";
import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { CartRequest, CartResponse } from "@/model/CartModel";
import { PageResponse } from "@/model/AppModel";
import { CustomAxiosResponse } from "@/model/AxiosModel";

const initialState: PageResponse<CartResponse> = {
  currentPage: 0,
  data: [],
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { data: initialState },
  reducers: {
    addProduct: (state, action) => {
      const itemResponse: CartResponse= action.payload;
      const pageData: PageResponse<CartResponse> = { ...state.data };
      const index = pageData.data.findIndex(
        (ele) => ele.subProductId === itemResponse.subProductId
      );
      if (index === -1) {
          pageData.totalElements += 1;
      } else {
        pageData.data.splice(index, 1);
      }
      pageData.data.unshift(itemResponse);
      state.data = pageData;
    },
    removeProduct: (state, action) => {
      const pageData: PageResponse<CartResponse> = { ...state.data };
      const item: CartResponse = action.payload;
      const index = pageData.data.findIndex((ele) => ele.id === item.id);
      pageData.totalElements -= 1;
      if (index != -1) {
        pageData.data.splice(index, 1);
        state.data = pageData;
      }
    },
    addAllProduct: (state, action) => {
      state.data = action.payload;
    },
    removeAllProduct: (state, _action)=>{
      state.data = initialState;
    }
  },
});

export const cartReducer = cartSlice.reducer;
export const { addProduct, removeProduct, addAllProduct, removeAllProduct } = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.data;

