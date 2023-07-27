import React from 'react'
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../api'

const initialState = {
  num:0
}


const Reducer = createSlice({
  name: "reducer",
  initialState,
  reducers: {
    setNum(state, action) {
      state.num = action.payload;
    }  
    
  }
})

export const newactions = Reducer.actions;
export default Reducer.reducer;
