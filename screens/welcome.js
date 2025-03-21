import { View, Text, Alert, Share, StyleSheet, FlatList, Image, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid } from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AntDesign, Ionicons, Feather, FontAwesome, Entypo, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import tw from "twrnc"
import { setLanguage } from "../slices/slice";

const { width, height } = Dimensions.get("window")
const IMAGE_SIZE = width / 3 - 10

export default function WelcomeScreen(){

     const route = useRoute()
     const dispatch = useDispatch()
     const navigation = useNavigation()

     const selectEnglish = ()=>{
      dispatch(setLanguage({ language: "ENGLISH" }))
      navigation.navigate("Home");
     }

     const selectAssamese = ()=>{
      dispatch(setLanguage({ language: "ASSAMESE" }))
      navigation.navigate("Home");
     }
  
  return (
        <View style={styles.container}>
          {/* TOP NAVIGATION BAR */}

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-10 text-white flex flex-row justify-evenly `]}>
            <Text style={tw`text-white font-bold text-2xl`}>anything.app</Text>
          </View>

          <View style={tw`flex flex-col justify-center items-center h-full w-full`}>
            <TouchableOpacity onPress={selectEnglish} style={tw`flex flex-row justify-center items-center w-80 h-20 bg-green-500 m-4`}>
                <Text style={tw`text-center text-white font-bold text-3xl`}>ENGLISH</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={selectAssamese} style={tw`flex flex-row justify-center items-center w-80 h-20 bg-green-500 m-4`}>
              <Text style={tw`text-center text-white font-bold text-3xl`}>অসমীয়া</Text>
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

    topBar: {
     display: "flex",
     flexDirection: "row",
     justifyContent: "space-evenly",
     backgroundColor: "#000",
     position: "absolute",
     bottom: 0,
     width: "100%",
     alignItems: "center",
    },

    grid: {
     margin: 5,
    },

    imageContainer: {
     margin: 5,
    },

    image: {
     width: IMAGE_SIZE,
     height: IMAGE_SIZE,
     borderRadius: 5,
    },

})
