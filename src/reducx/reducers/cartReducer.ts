import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from "@/model/AuthenticationModel";
import { localDataNames } from "@/constants/appInfos";
import { SubProductResponse } from "@/model/SubProduct";
import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { CartRequest } from "@/model/CartModel";
import { count } from "console";

const initialState: SubProductResponse[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState: { data: initialState },
  reducers: {
    addProduct: (state, action) => {
      const items: SubProductResponse[] = [...state.data];
      const item: SubProductResponse = action.payload;

      const index = items.findIndex((ele) => ele.id === item.id);
      if (index === -1) {
        items.push(item);
        addCart(item);
      } else { 
        updateCart({...item, count: items[index].count + item.count});
        items[index].count += item.count;
      }
      state.data = items;
    },
    removeProduct: (state, action) => {
      const items = state.data;
      const item = action.payload;
      const index = items.findIndex((ele) => ele.id === item.id);

      if(index != -1){
        items.splice(index, 1);
        state.data = items;
        removeCart(item.id, item.createdBy);
      }
    },
    addAllProduct: (state, action)=>{
        state.data = action.payload;
    }
  },
});

const syncLocal = (data: any | {}) => {
  if (data) {
    localStorage.setItem(localDataNames.authData, JSON.stringify(data));
  }
};

export const cartReducer = cartSlice.reducer;
export const { addProduct, removeProduct, addAllProduct } = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.data;

const addCart = async (item: SubProductResponse) => {
    const values: CartRequest ={
        count: item.count,
        createdBy: item.createdBy,
        options: item.options,
        quantity: item.quantity,
        subProductId: item.id,
        imageUrl: item.images && item.images.length> 0 ? item.images[0]  : ''
    }

  try {
    const res = await handleAPI(API.CARTS, values, "post");
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const updateCart = async (item: SubProductResponse) => {
    const values: CartRequest ={
        count: item.count,
        createdBy: item.createdBy,
        options: item.options,
        quantity: item.quantity,
        subProductId: item.id,
        imageUrl: item.images && item.images.length> 0 ? item.images[0]  : ''
    }

  try {
    const res = await handleAPI(API.CARTS, values, "put");
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