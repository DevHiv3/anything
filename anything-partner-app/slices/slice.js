import { createSlice } from '@reduxjs/toolkit'

const productionUrl = "https://anything-backend.onrender.com"
const vercelProductionUrl = ""
const localHostUrl = "http://192.168.65.65:8080"
const appLink = "anything://"

const initialState = {
    partnerCode: null,
    address: "",
    list: "",
    customerName: "",
    customerNumber: "",
    orderID: "",
    otpCode: "", 
    base_url: productionUrl,
    applink: appLink
}

const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setPartnerCode(state, action){
      state.partnerCode = action.payload.partnerCode
    },
    setOrderList(state, action){
      state.list = action.payload.list
    },
    setOrderAddress(state, action){
      state.address = action.payload.address
    },
    setCustomerName(state, action){
      state.customerName = action.payload.name
    },
    setCustomerNumber(state, action){
      state.customerNumber = action.payload.number
    },
    setOrderID(state, action){
      state.orderID = action.payload.orderID
    },
    setOTPCode(state, action){
      state.otpCode = action.payload.otpCode
    },
    resetOTP(state) {
      state.otpCode = null; // Reset OTP
    }
  },
})

export const { setPartnerCode, setOTPCode, resetOTP, setOrderID, setOrderList, setOrderAddress,setCustomerName, setCustomerNumber } = slice.actions
export const base_url = (state) => state.data.base_url
export const applink = (state) => state.data.applink
export const partnerCode = (state) => state.data.partnerCode
export const otpCode = (state) => state.data.otpCode
export const orderID = (state) => state.data.orderID
export const orderAddress = (state) => state.data.address
export const orderList = (state) => state.data.list
export const orderCustomerName = (state) => state.data.customerName
export const orderCustomerNumber = (state) => state.data.customerNumber

export default slice.reducer