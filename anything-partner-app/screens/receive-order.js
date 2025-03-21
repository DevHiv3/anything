import { View, Text, Alert, Share, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import * as SecureStore from "expo-secure-store"
import { base_url as url, setOTPCode, setOrderID, setCustomerName, setCustomerNumber, setOrderList, setOrderAddress } from '../slices/slice';
import { useSelector, useDispatch } from "react-redux";
const { width, height } = Dimensions.get("window")

export default function ReceiveOrderScreen(){

     const route = useRoute()
     const base_url = useSelector(url)
     const dispatch = useDispatch()
     const navigation = useNavigation()
     const [ order, setOrder ] = useState({})

     useEffect(() => {
      
    }, []);

     const phrases = {
      buttonTxt: "Order Lom",
      descriptionTxtPt1: "Per order",
      highlightedtxt: "Rs. 200",
      descriptionTxtPt2: "toka ke paabo",
      appName: "anything.app"
     }


     const findOrders = async()=>{
      const link = `${base_url}/order/approved`

      const response = await fetch(link, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json()
      if(result.message == "success"){
        console.log(result.order)
        setOrder(result.order)
        dispatch(setOTPCode({ otpCode: result.order.otp }))
        dispatch(setOrderID({ orderID: result.order._id }))
        dispatch(setOrderList({ list: result.order.list }))
        dispatch(setOrderAddress({ address: result.order.address }))
        dispatch(setCustomerName({ name: result.order.name }))
        dispatch(setCustomerNumber({ number: result.order.phoneNumber }))
        navigation.navigate("OrderAcception")
      } else if(result.message == "NO ORDERS"){
        console.log("NO ORDERS")
        ToastAndroid.show("No orders found!", ToastAndroid.SHORT)
      }
    }
  
  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

            <TouchableOpacity onPress={findOrders} style={tw`flex flex-row justify-center items-center w-66 h-66 bg-green-500 m-4 rounded-full`}>
              <Text style={tw`text-center text-white font-bold text-6xl`}>{phrases.buttonTxt}</Text>
            </TouchableOpacity>
            
            <Text style={tw`text-center text-white font-bold text-xl m-16`}>{phrases.descriptionTxtPt1}  <Text style={tw`text-green-500`}>{phrases.highlightedtxt}</Text>  {phrases.descriptionTxtPt2}</Text>

          </View>
  
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor: '#000',
     height: height,
     width: width,
    },
})
