import { View, Text,  StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid } from 'react-native'
import tw from "twrnc"
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { language } from '../slices/slice'
import { Feather } from '@expo/vector-icons'

const { width, height } = Dimensions.get("window")

export default function OrderAcceptionScreen({ deliveryPersonName, deliveryPersonNumber }){

  const selectedLanguage = useSelector(language);

  const [phrases, setPhrases] = useState({});

  useEffect(() => {
    if (selectedLanguage === "ASSAMESE") {
      setPhrases(assamesePhrases);
    } else {
      setPhrases(enlishPhrases);
    }
    }, [selectedLanguage]);

    const enlishPhrases = {
      appName: "anything.app",
      headerTxt: "Order Confirmed!",
      name: "Delivery Person",
      phoneNumber: "Phone Number",
      descriptionTxt: "Teu'r number tut tipile call koribo paribo",
     }

     const assamesePhrases = {
      appName: "এনিথিং এপ্",
      headerTxt: "অৰ্দাৰ কনফাৰ্ম হল!",
      name: "ডেলিভাৰী মানুহজন",
      phoneNumber: "ফোন নম্বৰ",
      descriptionTxt: "তেওঁৰ নুম্বৰটোত তিপিলেই ফোন কৰিব পাৰিব।"
     }
  
  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
              <Text style={tw`text-center text-white font-extrabold text-4xl mt-6`}>{phrases.headerTxt}</Text>
              <Text style={tw`text-center text-white font-bold text-xl mt-4 mx-14`}>{phrases.descriptionTxt}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

            <TouchableOpacity style={tw`flex flex-row justify-center items-center w-60 h-60 bg-green-500 m-4 rounded-full`}>
            <Feather name="check" size={150} color="black" />
            </TouchableOpacity>

            <View style={tw`flex flex-col justify-center items-center mt-10 h-12 w-full`}>
              <Text style={tw`text-center text-white font-bold text-xl`}>{phrases.appName}</Text>
              <Text style={tw`text-center text-white font-bold text-xl `}>{deliveryPersonName}</Text>
            </View>

            <View style={tw`flex flex-col justify-center items-center mt-10 h-12 w-full`}>
              <Text style={tw`text-center text-white font-bold text-xl`}>{phrases.phoneNumber}</Text>
              <Text style={tw`text-center text-green-500 font-bold text-xl`}>{deliveryPersonNumber}</Text>
            </View>
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
