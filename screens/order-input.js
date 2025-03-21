import { View, Text, Alert, Share, StyleSheet, TextInput, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { language, setOrderList } from "../slices/slice";
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10

export default function OrderInputScreen(){

     const route = useRoute()
     const dispatch = useDispatch()
     const navigation = useNavigation()
     const selectedLanguage = useSelector(language);

     const [ orderInput, setOrderInput ] = useState("")
     const [phrases, setPhrases] = useState({});

     useEffect(() => {
      if (selectedLanguage === "ASSAMESE") {
        setPhrases(assamesePhrases);
      } else {
        setPhrases(enlishPhrases);
      }
    }, [selectedLanguage]);


     const enlishPhrases = {
      buttonTxt: "NEXT",
      appName: "anything.app",
      headerTxt: "Ki ki lagibo likhi diyok"
     }

     const assamesePhrases = {
      buttonTxt: "নেক্সট",
      appName: "এনিথিং এপ্",
      headerTxt: "কি লাগিব, তলত লিখি দিয়ক"
     }

     const selectOrderList = ()=>{
      if(!orderInput){
        return ToastAndroid.show("khali hobo nuware!", ToastAndroid.SHORT)
      }
      dispatch(setOrderList({ orderList: orderInput }))
      navigation.navigate("Address")
     }
  
  return (
        <View style={styles.container}>

          <View style={[tw`fixed top-20 left-0 w-full h-10 text-white flex flex-col justify-evenly items-center`]}>
            <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
          </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>
          <Text style={tw`text-white font-extrabold text-3xl mb-6`}>{phrases.headerTxt}</Text>

          <TextInput placeholder=''
           value={orderInput}
           onChangeText={(text) =>{ setOrderInput(text); }}
           placeholderTextColor={tw`text-green-500`}
           style={tw`font-bold bg-white w-96 h-52 border-4 border-green-500 rounded-xl`}
          />

          <TouchableOpacity onPress={selectOrderList} style={tw`flex flex-row justify-center items-center w-60 h-60 bg-green-500 m-4 rounded-full`}>
            <Text style={tw`text-center text-white font-bold text-3xl`}>{phrases.buttonTxt}</Text>
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
