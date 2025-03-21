import { View, Text, Alert, Share, TextInput, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRoute } from '@react-navigation/native'
import { partnerCode } from '../slices/slice';
import tw from "twrnc"
import { useSelector, useDispatch } from "react-redux";

const { width, height } = Dimensions.get("window")

export default function PartnerCodeScreen(){

     const route = useRoute()
     const dispatch = useDispatch()
     const navigation = useNavigation()
     const [ code, setCode ] = useState("")
     const [ username, setUsername ] = useState("")
     const [ contactNumber, setContactNumber ] = useState("")
     

     useEffect(() => {
      const checkForDetails = async()=>{
        const code = await SecureStore.getItemAsync("code")
        const number = await SecureStore.getItemAsync("number")

        if(code !== null && number !== null){
          navigation.navigate("ReceiveOrders")
        }

      }

      checkForDetails()
    }, []);

     const phrases = {
      buttonTxt: "Submit",
      appName: "anything.app",
      headerTxt: "Partner Code"
     }

     const verifyPartnerCode = async()=>{
        await SecureStore.setItemAsync("code", code)
        await SecureStore.setItemAsync("name", username)
        await SecureStore.setItemAsync("number", contactNumber)
        navigation.navigate("ReceiveOrders")
     } 
  
  return (
        <View style={styles.container}>

          
          <Text style={tw`text-white font-bold text-2xl mt-20`}>{phrases.appName}</Text>
        

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

          <Text style={tw`text-white font-extrabold text-3xl mb-6`}>{phrases.headerTxt}</Text>

            <TextInput placeholder='code'
              value={code}
              onChangeText={(text) =>{ setCode(text); }}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-16 border-4 border-green-500 rounded-xl`}
            />

            <View style={tw`flex flex-col justify-start items-start w-full`}>

            <Text style={tw`text-white font-extrabold text-xl my-2`}>Name</Text>

            <TextInput placeholder=''
              value={username}
              onChangeText={(text) =>{ setUsername(text); }}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-16 border-4 border-green-500 rounded-xl`}
            />

            <Text style={tw`text-white font-extrabold text-xl my-4`}>Phone number</Text>

            <TextInput placeholder=''
              value={contactNumber}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              onChangeText={(text) =>{ setContactNumber(text); }}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-16 border-4 border-green-500 rounded-xl`}
            />
          </View>

            <TouchableOpacity onPress={verifyPartnerCode} style={tw`flex flex-row justify-center items-center w-60 h-60 bg-green-500 m-4 mt-10 rounded-full`}>
              <Text style={tw`text-center text-white font-bold text-5xl`}>{phrases.buttonTxt}</Text>
            </TouchableOpacity>
            
    
          </View>
  
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
     display: "flex",
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: '#000',
     height: height,
     width: width,
    },
})
