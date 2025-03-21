import { View, Text, Alert, Share, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'
import tw from "twrnc"
import * as SecureStore from 'expo-secure-store';
import { base_url as url, orderID } from '../slices/slice';
import { useSelector, useDispatch } from "react-redux";
const { width, height } = Dimensions.get("window")

export default function OrderAcceptionScreen(){

     const base_url = useSelector(url)
     const orderId = useSelector(orderID)
     const dispatch = useDispatch()
     const navigation = useNavigation()

     useEffect(() => {
      console.log(orderId)
    }, []);

     const phrases = {
      buttonTxt: "Accept",
      appName: "anything.app",
      headerTxt: "Order eta ahise!"
     }

    
    const acceptOrder = async()=>{
          const link = `${base_url}/order/assign/${orderId}`
          const deliveryPerson = await SecureStore.getItemAsync("name")
          const deliveryNumber = await SecureStore.getItemAsync("number")
          console.log(deliveryNumber, deliveryPerson)
    
          const response = await fetch(link, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              deliveryPerson: deliveryPerson,
              deliveryNumber: deliveryNumber
            })
          })
    
          const result = await response.json()
          if(result.message == "success"){
            return navigation.navigate("Details")
          } else {
            console.log("NO ORDERS")
            return ToastAndroid.show("No orders found!", ToastAndroid.SHORT)
          }
      }


  
  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
              <Text style={tw`text-center text-white font-bold text-3xl mt-12`}>{phrases.headerTxt}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

            <TouchableOpacity onPress={acceptOrder} style={tw`flex flex-row justify-center items-center w-72 h-72 bg-green-500 m-4 rounded-full`}>
              <Text style={tw`text-center text-white font-bold text-6xl`}>{phrases.buttonTxt}</Text>
            </TouchableOpacity>
        
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
