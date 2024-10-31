import { createSlice } from "@reduxjs/toolkit";

const initialState = 'home';

const pageSlice = createSlice({
    name: 'auth',
    initialState: {data: initialState},
    reducers: {
        changePage: (state, action) =>{
            state.data = action.payload;
        }
    },
});

export const pageReducer = pageSlice.reducer;
export const {changePage} = pageSlice.actions;

export const pageSelector = (state: any) => state.pageReducer.data;