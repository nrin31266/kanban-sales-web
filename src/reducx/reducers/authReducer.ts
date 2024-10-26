import { createSlice } from "@reduxjs/toolkit";
import { AuthModel } from '@/model/AuthenticationModel';

const initialState: AuthModel = {
    accessToken: '',
    userInfo: {
        id: '',
        name: '',
        email: '',
        roles: []
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {data: initialState},
    reducers: {
        addAuth: (state, action)=>{
            state.data = action.payload;
        },
        removeAuth: (state, _action) =>{
            state.data = initialState;
        }
    },
})

export const authReducer = authSlice.reducer;
export const {addAuth, removeAuth} = authSlice.actions;

export const authSelector = (state: any) => state.authReducer.data;
