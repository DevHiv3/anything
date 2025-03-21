import { View, Text, Alert, Share, StyleSheet, FlatList, Image, TextInput,  KeyboardAvoidingView, Keyboard, RefreshControl , Dimensions, TouchableOpacity, ToastAndroid, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import * as SecureStore from 'expo-secure-store'
import { useSelector, useDispatch } from "react-redux";
import SwipeButton from 'rn-swipe-button';  // This ensures correct import
import Modal from "../components/modal"
import { setOTPCode, otpCode, orderID, orderAddress, orderCustomerName, orderCustomerNumber, orderList } from "../slices/slice";
import VerifyOTPModal from '../components/verify-otp';
import LoadingModal from "../components/loading"
import { base_url as url } from '../slices/slice'
import { io } from 'socket.io-client';
const { width, height } = Dimensions.get("window")

export default function OrderDetailsScreen(){

     const route = useRoute()
     const navigation = useNavigation()
     const dispatch = useDispatch();
     const base_url = useSelector(url)
     const otp = useSelector(otpCode);
     const orderId = useSelector(orderID)
     const list = useSelector(orderList)
     const address = useSelector(orderAddress)
     const customerName = useSelector(orderCustomerName)
     const customerNumber = useSelector(orderCustomerNumber)
     const [ detailStatus, setDetailsStatus ] = useState("")
     const socketRef = useRef(null);
     const [ open, setOpen ] = useState(true)
     const [ loadingStatus, setLoadingStatus ] = useState(false)
     const [socket, setSocket] = useState(null);


     useEffect(() => {

      if (!socketRef.current) {

      socketRef.current = io(base_url, { transports: ["websocket"] });
      socketRef.current.on("connect", async() => {
        console.log("Socket connected!");

        const deliveryPerson = await SecureStore.getItemAsync('name');
        const deliveryNumber = await SecureStore.getItemAsync('number');
        socketRef.current.emit('user-connected', 'DELIVERY', deliveryNumber, orderId);

        socketRef.current.on("user-joined", (message) => {
            console.log("User joined event received:", message);
        });

        socketRef.current.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);
      });


      socketRef.current.on("connect_error", (error) => {
        console.error("⚠️ Connection error:", error.message);
    });
    });

  }
      return () => {
        socketRef.current.disconnect();
        console.log("🛑 Socket disconnected on unmount");
        socketRef.current = null; // ✅ Prevent duplicate sockets
      };

    }, []);
  
    const kinaHol = async() => {
      try {
        const deliveryPerson = await SecureStore.getItemAsync('name');
        const deliveryNumber = await SecureStore.getItemAsync('number');
        socketRef.current.emit('kina-hol', deliveryPerson, deliveryNumber, orderId);
        ToastAndroid.show('Order kina hol!', ToastAndroid.SHORT);
        setDetailsStatus('USERDETAILS');
      } catch (error) {
        console.error('Error verifying OTP:', error);
      }
    };
  
    const tapPaaluHi = async () => {
      try {
        const deliveryPerson = await SecureStore.getItemAsync('name');
        const deliveryNumber = await SecureStore.getItemAsync('number');
        ToastAndroid.show("Customer'r location't paluhi!", ToastAndroid.SHORT);
        socketRef.current.emit('verify-otp', deliveryPerson, deliveryNumber, orderId, otp);
        console.log("The otp is :", otp)
        setDetailsStatus('VERIFYOTP');
      } catch (error) {
        console.error('Error verifying OTP:', error);
      }
    };
    
    const orderCompleted = async()=>{
      socketRef.current.emit('delivered-order', orderId)
      setOpen(false);
      navigation.navigate("OrderCompletion")
    
    }

     const OrderAcceptionComponent = ()=>{
      return(
        <View style={tw`mt-6`}>
          <SwipeButton
              title="Kina hol"
              onSwipeSuccess={kinaHol}
              thumbIconBackgroundColor="#22c55e"
              railFillBackgroundColor="#86efac"
              railBackgroundColor="#d3d3d3"
              railFillBorderColor="#86efac"
              railBorderColor="#000000"
              thumbIconBorderColor="#16a34a"
              titleStyles={styles.swipeText} // Adjusting text visibility
              containerStyles={styles.swipeButton} // Fixing width
            />
            <Text style={tw`text-white font-medium mt-4 text-base text-center`}>Kina hole butam tu right'r faale taani dibo</Text>

        </View>
      )
    }

    const UserDetailsComponent = ()=>{

      const [ ask, setAsked ] = useState(false)

      return(
        <View>
          <Modal open={ask} close={()=> setAsked(false)} proceed={()=>{ setAsked(false); setDetailsStatus("ORDERCONFIRMATION") }} message={"Are you sure?"} optionOne={"yes"} />
          <View style={tw`flex flex-col justify-center items-center mt-12 h-24 w-full`}>
            <Text style={tw`text-center text-green-500 font-bold text-2xl`}>{customerNumber}</Text>
            <Text style={tw`text-center text-white font-normal text-xl mx-14 mt-4`}>Call kori ebar jonai dibo. Number tu tipilei call lagi jabo</Text>
            <TouchableOpacity onPress={()=> setAsked(true)}><Text style={tw`text-center text-green-500 font-normal text-lg mt-4`}>Taar pasot iyaat click koribo.</Text></TouchableOpacity>
          </View>
        </View>
      )
    }

    const OrderConfirmationComponent = ()=>{
      return(
        <View style={tw`mt-6`}>
          <SwipeButton
              title="Paalu Hi"
              onSwipeSuccess={() => tapPaaluHi()}
              thumbIconBackgroundColor="#22c55e"
              railFillBackgroundColor="#86efac"
              railBackgroundColor="#d3d3d3"
              railFillBorderColor="#86efac"
              railBorderColor="#000000"
              thumbIconBorderColor="#16a34a"
              titleStyles={styles.swipeText} // Adjusting text visibility
              containerStyles={styles.swipeButton} // Fixing width
            />
            <Text style={tw`text-white font-medium mt-4 text-base text-center mx-10`}>Teu'r location't paale butam tu right'r faale taani dibo</Text>

        </View>
      )
    }

    const VerifyOTPComponent = ()=>{
      
      return(
        <View style={tw`flex flex-col items-center mt-10`}>
        <VerifyOTPModal open={open} close={()=> setOpen(false)} message={'verify OTP'} proceed={orderCompleted} showLoading={()=> setLoadingStatus(true)} removeLoading={()=> setLoadingStatus(false)} orderId={orderId} />
        <LoadingModal open={loadingStatus} close={()=> setLoadingStatus(false)} />

        </View>
      )
    }

    const RenderConditionalComponent = ()=> {
      switch (detailStatus){
        case "ORDERCONFIRMATION":
          return <OrderConfirmationComponent />
        case "USERDETAILS":
          return <UserDetailsComponent />
        case "VERIFYOTP":
          return <VerifyOTPComponent />
        default:
          return <OrderAcceptionComponent />
      }
    }


  return (
        <View style={styles.container}>

          <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
              <Text style={tw`text-white font-bold text-2xl`}>anything.app</Text>
           </View>

          <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>

            <Text style={tw`text-white text-center font-extrabold text-3xl mb-2`}>Order List</Text>

            <TextInput placeholder=''
              value={list}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-26 border-4 border-green-500 rounded-xl mb-6`}
            />

            <Text style={tw`text-white text-center font-extrabold text-3xl my-6`}>Address</Text>

            <TextInput placeholder=''
              value={address}
              disabled={true}
              placeholderTextColor={tw`text-green-500`}
              style={tw`font-bold bg-white w-96 h-26 border-4 border-green-500 rounded-xl`}
            />

            <RenderConditionalComponent />
            
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

    swipeButton: {
      width: width * 0.9,
      backgroundColor: "#22c55e",
      color: "#22c55e" // 90% of screen width
    },
    swipeText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000', // Change to visible color
    },
})
