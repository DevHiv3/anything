import { createSlice } from '@reduxjs/toolkit'

const productionUrl = "https://anything-backend.onrender.com"
const vercelProductionUrl = ""
const localHostUrl = "http://192.168.65.65:8080"
const appLink = "anything://"

const initialState = {
    language: null,
    orderId: null,
    orderUsername: null,
    orderNumber: null,
    orderList: null,
    otp: null,
    base_url: productionUrl,
    applink: appLink
    }

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setLanguage(state, action){
      state.language = action.payload.language
    },
    setOTPCode(state, action){
      state.otp = action.payload.otp
    },
    setOrderID(state, action){
      state.orderId = action.payload.orderId
    },
    setOrderUsername(state, action){
      state.orderUsername = action.payload.orderUsername
    },
    setOrderNumber(state, action){
      state.orderNumber = action.payload.orderNumber
    },
    setOrderList(state, action){
      state.orderList = action.payload.orderList
    },
    setOrderAddress(state, action){
      state.orderAddress = action.payload.orderAddress
    }
  },
})

export const { setOrderID, setOrderUsername, setOrderNumber, setOrderList, setOrderAddress, setLanguage, setOTPCode } = slice.actions
export const base_url = (state) => state.data.base_url
export const applink = (state) => state.data.applink
export const language = (state) => state.data.language
export const orderID = (state)=> state.data.orderId
export const orderList = (state) => state.data.orderList
export const orderAddress = (state) => state.data.orderAddress
export const orderUsername = (state) => state.data.orderUsername
export const orderNumber = (state) => state.data.orderNumber
export const otpCode = (state) => state.data.otp

export default slice.reducer