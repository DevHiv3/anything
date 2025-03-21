import { View, Text, Share, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { language } from '../slices/slice'
import { Feather,  MaterialIcons  } from '@expo/vector-icons'

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10

const RatingComponent = ({ totalStars = 5, size = 32, color = "gold" }) => {
  const [rating, setRating] = useState(0);

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Rating: {rating}</Text>
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: totalStars }, (_, index) => {
          const starNumber = index + 1;
          return (
            <TouchableOpacity key={index} onPress={() => setRating(starNumber)}>
              <MaterialIcons
                name={rating >= starNumber ? "star" : "star-border"}
                size={size}
                color={color}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};


export default function OrderCompletionScreen(){

  const route = useRoute()
  const dispatch = useDispatch()
  const navigation = useNavigation()
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
      headerTxt: "Order Completed!",
      submitButtonTxt: "submit",
      reorderButtonTxt: "AKOU ORDER KORIM",
      orderFeedback: "Taar baabe dhonyobaad!",
      descriptionTxt: "Apuni ejon manuhor family'r karone Rs. 50 income kori dile",
     }

     const assamesePhrases = {
      appName: "এনিথিং এপ্",
      headerTxt: "অৰ্দাৰ সমাপ্ত!",
      submitButtonTxt: "কনফাৰ্ম",
      reorderButtonTxt: "আকৌ অৰ্দাৰ কৰিম",
      orderFeedback: "তাৰ বাবে অশেষ ধন্যবাদ।",
      descriptionTxt: "আজি আপুনি এজন মানুহক তেওঁৰ পৰিয়াল চলোৱাত সহায় কৰিলে।"
     }
  
  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
              <Text style={tw`text-center text-white font-extrabold text-4xl mt-6`}>{phrases.headerTxt}</Text>
              <Text style={tw`text-center text-white font-bold text-xl mt-4 mx-10`}>{phrases.descriptionTxt}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>
          <RatingComponent />

            <TouchableOpacity style={tw`flex flex-row justify-center items-center w-60 h-20 bg-green-500 m-4 rounded-2xl`}>
              <Text style={tw`text-white font-bold uppercase text-xl`}>{phrases.submitButtonTxt}</Text>
            </TouchableOpacity>
            <View style={tw`flex flex-col justify-center items-center mt-10 h-12 w-full`}>
              <Text style={tw`text-center text-white font-bold text-xl`}>{phrases.orderFeedback}</Text>
            </View>

            <TouchableOpacity onPress={()=> navigation.replace("Home")} style={tw`flex flex-row justify-center items-center w-60 h-20 bg-green-500 m-4 rounded-2xl`}>
              <Text style={tw`text-white font-bold uppercase text-xl`}>{phrases.reorderButtonTxt}</Text>
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
