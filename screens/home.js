import { View, Text, Alert, Share, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import { useSelector } from "react-redux";
import { language } from "../slices/slice";

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10

export default function HomeScreen(){

     const route = useRoute()
     const selectedLanguage = useSelector(language);
     const navigation = useNavigation()

     const [phrases, setPhrases] = useState({});

     useEffect(() => {
      if (selectedLanguage === "ASSAMESE") {
        setPhrases(assamesePhrases);
      } else {
        setPhrases(enlishPhrases);
      }
    }, [selectedLanguage]);

     const enlishPhrases = {
      buttonTxt: "ORDER",
      descriptionTxtPt1: "total order jimaan daam hobo taat matro",
      highlightedtxt: "Rs. 50",
      descriptionTxtPt2: "eta add kori dibo delivery manuh jonor baabe",
      appName: "anything.app",
      headerTxt: "bortomaan okol naharkatia'r baabe."
     }

     const assamesePhrases = {
      buttonTxt: "অৰ্দাৰ",
      descriptionTxtPt1: "মূল অৰ্ডাৰ যিমান দামৰ হব তাত মাত্ৰ",
      highlightedtxt: "₹২০",
      descriptionTxtPt2: "যোগ কৰি দিব দেলিভাৰী দিয়া মানুহজনৰ বাবে।",
      appName: "এনিথিং এপ্",
      headerTxt: "বৰ্তমান অকল নাহৰকটীয়া বাবে।"
     }
  
  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
              <Text style={tw`text-center text-white font-bold text-xl mt-6`}>{phrases.headerTxt}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

            <TouchableOpacity onPress={()=> navigation.navigate("OrderInput")} style={tw`flex flex-row justify-center items-center w-60 h-60 bg-green-500 m-4 rounded-full`}>
              <Text style={tw`text-center text-white font-bold text-3xl`}>{phrases.buttonTxt}</Text>
            </TouchableOpacity>
            
            <Text style={tw`text-center text-white font-bold text-xl m-10`}>{phrases.descriptionTxtPt1}  <Text style={tw`text-green-500`}>{phrases.highlightedtxt}</Text>  {phrases.descriptionTxtPt2}</Text>

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
