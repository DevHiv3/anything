import { View, Text, Alert, Share, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import { Feather } from '@expo/vector-icons';
import { useSelector } from "react-redux";

const { width, height } = Dimensions.get("window")

export default function OrderCompletionScreen(){

     const route = useRoute()
     const navigation = useNavigation()

     useEffect(() => {
     
    }, []);

     const phrases = {
      buttonTxt: "ORDER",
      descriptionTxtPt1: "total order jimaan daam hobo taat matro",
      highlightedtxt: "Rs. 50",
      descriptionTxtPt2: "eta add kori dibo delivery manuh jonor baabe",
      appName: "anything.app",
      headerTxt: "bortomaan okol naharkatia'r baabe."
     }


  
  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
              <Text style={tw`text-center text-white font-extrabold text-3xl mt-8`}>Order Complete!</Text>
              <Text style={tw`text-center text-white font-normal text-lg mt-2 mx-10`}>Apunar account't Rs. 200 toka humai jabo aji rati loi.</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

            <TouchableOpacity style={tw`flex flex-row justify-center items-center w-80 h-80 bg-green-500 m-4 mt-20 rounded-full`}>
              <Feather name="check" size={200} color="black" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={()=> navigation.navigate("ReceiveOrders")} style={tw`flex flex-row justify-center items-center w-60 h-16 bg-green-500 rounded-2xl mt-10`}>
              <Text style={tw`text-center text-2xl font-extrabold text-white`}>Aru order lom</Text>
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
