import { View, Text, Share, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { language } from '../slices/slice'
import { Feather } from '@expo/vector-icons'
import OrderAcceptionScreen from './order-acception'
import OrderConfirmationScreen from './order-confirmation'
import { base_url as url, orderNumber, orderID, otpCode } from '../slices/slice'
import { io } from 'socket.io-client';

const { width, height } = Dimensions.get("window")

export default function WaitingListScreen(){

     const route = useRoute()
     const dispatch = useDispatch()
     const clientNumber = useSelector(orderNumber)
     const orderId = useSelector(orderID)
     const navigation = useNavigation()
     const base_url = useSelector(url)
     const [ detailStatus, setDetailsStatus ] = useState("")
     const otp = useSelector(otpCode)
     const [ deliveryPerson, setDeliveryPerson ] = useState("")
     const [ deliveryNumber, setDeliveryNumber ] = useState("")
     const socketRef = useRef(null);

    const fetchOrder = async()=>{
      const link = `${base_url}/order/${orderId}`
      const response = await fetch(link, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Request failed: ${errorData.message || response.status}`);
      } else {
        const data = await response.json();
        setDeliveryPerson(data.order.deliveryPerson)
        setDeliveryNumber(data.order.deliveryPersonNumber)
        console.log("The delivery Person name :", data.order.deliveryPerson, " The delivery person number: ", data.order.deliveryPersonNumber)
      } 
    }

    useEffect(()=>{

      if (!socketRef.current) {
        // ✅ Ensure only one socket connection

      socketRef.current = io(base_url, { transports: ["websocket"] });
      socketRef.current.on("connect", () => {
        console.log("Socket connected!");
        socketRef.current.emit('user-connected', 'CLIENT', clientNumber, orderId);

        socketRef.current.on("user-joined", (message) => {
            console.log("User joined event received:", message);
        });

        socketRef.current.on("flagged-order", (clientSocketId) => {
          console.log("Flagged order event received:", clientSocketId);
          ToastAndroid.show(`Your order has been flagged!`, ToastAndroid.SHORT);
          navigation.replace("Home")
      });

        socketRef.current.on("display-number", (deliveryPersonName, deliveryPersonNumber, deliveryOrderId, clientSocketId) => {
          setDeliveryPerson(deliveryPersonName)
          setDeliveryNumber(deliveryPersonNumber)
          console.log("The client socket Id is: ", clientSocketId, " and client side socket id: ");
          setDetailsStatus("ASSIGNED")
      });

        socketRef.current.on("order-completed", (clientSocketId) => {
          console.log("Order completed for the client id: ", clientSocketId);
          navigation.navigate("OrderCompletion")

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
    }, [])

     useEffect(()=>{

      const handleOtpEvent = (deliveryPersonName, deliveryPersonNumber, deliveryOTP) => {
        console.log(deliveryPersonName, deliveryPersonNumber)
        setDeliveryPerson(deliveryPersonName)
        setDeliveryNumber(deliveryPersonNumber)
        setDetailsStatus("OTP-VERIFICATION");
        ToastAndroid.show(`${deliveryOTP}`, ToastAndroid.SHORT);
      };

      if (socketRef.current) {
        socketRef.current.on("display-otp", handleOtpEvent);
      }
    
      return () => {
        if (socketRef.current) {
          socketRef.current.off("display-otp", handleOtpEvent); // ✅ Check before calling `.off()`
        }
      }
      
     }, [])

    

       const RenderConditionalComponent = ()=> {
        switch (detailStatus){
          case "OTP-VERIFICATION":
            return <OrderConfirmationScreen otp={otp} deliveryPersonName={deliveryPerson} deliveryPersonNumber={deliveryNumber} />
          case "ASSIGNED":
            return <OrderAcceptionScreen deliveryPersonName={deliveryPerson} deliveryPersonNumber={deliveryNumber} />
          default:
            return <WaitingListScreen />
        }
      }

      const WaitingListScreen = ()=>{

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
            descriptionTxt: "5 min'r bhitorot apunar order confirm hoi jabo. Delivery diya manuh jonor phone number eyate ulabo olop pasot",
           }
      
           const assamesePhrases = {
            appName: "এনিথিং এপ্",
            headerTxt: "অৰ্দাৰ কনফাৰ্ম হল!",
            descriptionTxt: "৫ মিনিটৰ ভিতৰত আপোনাৰ অৰ্দাৰ কনফাৰ্ম হৈ যাব। দেলিভাৰী দিয়া মানুহজনৰ ফোন নম্বৰ ইয়াতে অলপ পাছত ওলাব।"
           }

        return (
          <View style={styles.container}>
  
            <View style={[tw`z-5 fixed top-20 left-0 w-full h-20 text-white flex flex-col justify-evenly items-center`]}>
                <Text style={tw`text-white font-bold text-2xl`}>{phrases.appName}</Text>
                <Text style={tw`text-center text-white font-bold text-3xl mt-10`}>{phrases.headerTxt}</Text>
            </View>
  
            <View View style={tw`flex flex-col justify-center items-center h-full w-full`}>
  
              <TouchableOpacity style={tw`flex flex-row justify-center items-center w-60 h-60 bg-green-500 m-4 rounded-full`}>
              <Feather name="check" size={150} color="black" />
              </TouchableOpacity>
              
              <Text style={tw`text-center text-white font-bold text-xl m-10`}>{phrases.descriptionTxt}</Text>
  
            </View>
    
      </View>
    )
        
      }
  
  return (
        <>
        <RenderConditionalComponent />
        </>
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
