import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from "@/model/AuthenticationModel";
import { localDataNames } from "@/constants/appInfos";
import { SubProductResponse } from "@/model/SubProduct";
import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { CartRequest, CartResponse } from "@/model/CartModel";
import { PageResponse } from "@/model/AppModel";

const initialState: PageResponse<CartResponse> = {
  currentPage: 0,
  data: [],
  pageSize: 0,
  totalElements: 0,
  totalPages: 0
};

const cartSlice = createSlice({
  name: "cart",
  initialState: { data: initialState },
  reducers: {
    addProduct: (state, action) => {
      const pageData: PageResponse<CartResponse> = {...state.data};
      const itemReceived: CartRequest = action.payload;

      const index = pageData.data.findIndex((ele) => ele.subProductId === itemReceived.subProductId);
      const item: CartResponse= {
        productId: itemReceived.productId,
        count: itemReceived.count,
        createdAt: null,
        imageUrl: itemReceived.imageUrl,
        title: itemReceived.title,
        id: null,
        productResponse: null,
        subProductResponse: itemReceived.subProductResponse,
        updatedAt: null,
        subProductId: itemReceived.subProductId,
        createdBy: itemReceived.createdBy
      };
      if (index === -1) {
        
        pageData.totalElements += 1;
      } else {    
        item.count = pageData.data[index].count + itemReceived.count;
        pageData.data.splice(index, 1);
        
      }
      addCart(itemReceived);
      pageData.data.unshift(item);
      state.data = pageData;
    },
    removeProduct: (state, action) => {
      const pageData: PageResponse<CartResponse> = {...state.data};
      const item : CartResponse = action.payload;
      const index = pageData.data.findIndex((ele) => ele.id === item.id);

      if(index != -1){
        pageData.data.splice(index, 1);
        pageData.totalElements -= 1;
        state.data = pageData;
        removeCart(item.subProductId, item.createdBy);
      }
    },
    addAllProduct: (state, action)=>{
        state.data = action.payload;
    }
  },
});

export const cartReducer = cartSlice.reducer;
export const { addProduct, removeProduct, addAllProduct } = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.data;

const addCart = async (item: CartRequest) => {
  try {
    const res = await handleAPI(API.CARTS, item, "post");
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const updateCart = async (item: CartRequest) => {
  try {
    const res = await handleAPI(API.CARTS, item, "put");
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const removeCart = async (subProductId: string, createdBy: string) => {
    try {
        await handleAPI(`${API.CARTS}/${subProductId}/${createdBy}`, undefined, 'delete');
    } catch (error) {
        console.log(error);
    }
};