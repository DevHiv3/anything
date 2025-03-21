import { createSlice } from '@reduxjs/toolkit'

const productionUrl = "https://anything-backend.onrender.com"
const vercelProductionUrl = ""
const localHostUrl = "http://192.168.65.65:8080"
const appLink = "anything://"

const initialState = {
    base_url: productionUrl,
    applink: appLink
    }

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
   
  },
})

//export const {  } = slice.actions
export const base_url = (state) => state.data.base_url
export const applink = (state) => state.data.applink

export default slice.reducer