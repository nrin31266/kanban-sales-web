import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from '@/model/AuthenticationModel';
import { localDataNames } from "@/constants/appInfos";

const initialState: AuthModel = {
    accessToken: '',
    userInfo: {
        id: '',
        name: '',
        email: '',
        roles: []
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {data: initialState},
    reducers: {
        addCart: (state, action)=>{
            state.data = action.payload;
            syncLocal(state.data);
        },
        removeCart: (state, _action) =>{
            state.data = initialState;
            syncLocal({});
        }
    },
})

const syncLocal = (data: any | {}) => {
    if (data) {
        localStorage.setItem(localDataNames.authData, JSON.stringify(data));
    }
};

export const authReducer = cartSlice.reducer;
export const {addCart, removeCart} = cartSlice.actions;

export const cartSelector = (state: any) => state.cartReducer.data;
