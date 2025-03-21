import { View, Text, Alert, Share, StyleSheet, TextInput, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { language, base_url as url, setOrderID, orderList, orderAddress, setOrderUsername, setOrderNumber, setOTPCode } from '../slices/slice'
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10

export default function DetailsScreen(){

     const route = useRoute()
     const dispatch = useDispatch()
     const navigation = useNavigation()
     const selectedLanguage = useSelector(language);
     const base_url = useSelector(url)
     const address = useSelector(orderAddress)
     const list = useSelector(orderList)

     const [ username, setUsername ] = useState("")
     const [ contactNumber, setContactNumber ] = useState("")
     const [phrases, setPhrases] = useState({});

     useEffect(() => {
      if (selectedLanguage === "ASSAMESE") {
        setPhrases(assamesePhrases);
      } else {
        setPhrases(enlishPhrases);
      }
      }, [selectedLanguage]);

      const enlishPhrases = {
        buttonTxt: "Place Order",
        appName: "anything.app",
        headerTxt: "Apunar details",
        name: "Name",
        phoneNumber: "Phone Number"
       }
  
       const assamesePhrases = {
        buttonTxt: "অৰ্দাৰ কৰি দিয়ক",
        appName: "এনিথিং এপ্",
        headerTxt: "আপোনাৰ বিষয়ে",
        name: "নাম",
        phoneNumber: "ফোন নম্বৰ"
       }

       const selectOrderDetails = async()=>{
        if(!username){
          return ToastAndroid.show("khali hobo nuware!", ToastAndroid.SHORT)
        }

        if(!contactNumber){
          return ToastAndroid.show("khali hobo nuware!", ToastAndroid.SHORT)
        }

        if(contactNumber.length !== 10){
          return ToastAndroid.show("Phone number tu 10 honkhyar hobo lagibo!", ToastAndroid.SHORT)
        }


        dispatch(setOrderUsername({ orderUsername: username }))
        dispatch(setOrderNumber({ orderNumber: contactNumber }))

        const link = `${base_url}/order`
        console.log(address, list, contactNumber, username)
        const response = await fetch(link, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            list: list,
            address: address,
            name: username,
            phoneNumber: contactNumber
          })
        })

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Request failed: ${errorData.message || response.status}`);
        } else {
          const data = await response.json();
          dispatch(setOrderID({ orderId: data.orderId }))
          dispatch(setOTPCode({ otp: data.otp }))
          console.log("OrderId: ", data.orderId)
          navigation.navigate("WaitingList")
        }
       }
     
  
  return (
        <View style={styles.container}>

          <View style={[tw`fixed top-20 left-0 w-full h-10 text-white flex flex-col justify-evenly items-center`]}>
            <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>
          <Text style={tw`text-white font-extrabold text-3xl mb-6`}>{phrases.headerTxt}</Text>

          <View style={tw`flex flex-col justify-start items-start w-full`}>

            <Text style={tw`text-white font-extrabold text-xl mb-2`}>{phrases.name}</Text>

            <TextInput placeholder=''
              value={username}
              onChangeText={(text) =>{ setUsername(text); }}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-16 border-4 border-green-500 rounded-xl`}
            />

            <Text style={tw`text-white font-extrabold text-xl my-2`}>{phrases.phoneNumber}</Text>

            <TextInput placeholder=''
              value={contactNumber}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              onChangeText={(text) =>{ setContactNumber(text); }}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-16 border-4 border-green-500 rounded-xl`}
            />
          </View>

          <TouchableOpacity onPress={selectOrderDetails} style={tw`flex flex-row justify-center items-center w-60 h-60 bg-green-500 m-4 rounded-full`}>
            <Text style={tw`text-center text-white font-bold text-6xl`}>{phrases.buttonTxt}</Text>
          </TouchableOpacity>

        </View>
  
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#000',
    height: height,
    width: width,
   },

})
