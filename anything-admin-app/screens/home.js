import { View, Text, Alert, Share, Switch, RefreshControl, TextInput, Platform, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, ToastAndroid, ScrollView } from 'react-native'
import { useState, useEffect, useRef } from 'react';
import { AntDesign, FontAwesome5 } from "@expo/vector-icons"
import * as Device from 'expo-device';
import * as SecureStore from "expo-secure-store";
import { useSelector, useDispatch } from 'react-redux';
import { base_url as url } from "../slices/slice"
import * as Notifications from 'expo-notifications';
import { io } from 'socket.io-client';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from "twrnc"
import { checkForUpdateAsync } from 'expo-updates';

const { width, height } = Dimensions.get("window")

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function HomeScreen(){

     const navigation = useNavigation()
     const base_url = useSelector(url)
     const dispatch = useDispatch()
     const [expoPushToken, setExpoPushToken] = useState('');
     const [ turn, setTurn ] = useState(false)
     const [notification, setNotification] = useState(null)
     const notificationListener = useRef();
     const responseListener = useRef();
     const [ refreshing, setRefreshing ] = useState(false)
     const socketRef = useRef(null);

     const [ orders, setOrders ] = useState([])

     const registerForPushNotificationsAsync = async () => {

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Failed to get push token for push notification!');
          return;
        }

        const deviceToken = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(deviceToken)
        await pushTokenToServer(deviceToken)
        await SecureStore.setItemAsync("token", deviceToken)
        ToastAndroid.show("Notification are turned on!", ToastAndroid.SHORT);
      } else {
        Alert.alert('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      };

      const pushTokenToServer = async(deviceToken)=>{
        const link = `${base_url}/add-push-token`;
        const response = await fetch(link, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pushToken: deviceToken, userType: "ADMIN" }),
          });

          const result = await response.json()
          if(result.message == "success"){
            await SecureStore.setItemAsync("pushId", result.pushId)
          }
      }

      const removeTokenFromServer = async()=>{
        const pushId = await SecureStore.getItemAsync("pushId")
        const token = await SecureStore.getItemAsync("token")
        console.log(pushId, token)
        const link = `${base_url}/delete-push-token`;
        const response = await fetch(link, {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceToken: token })
          });
  
          const result = await response.json()
          if(result.message == "success"){
            ToastAndroid.show("Notifications turned off!", ToastAndroid.SHORT)
          }
      }

      const getNotification = async()=>{
        if(!turn){
            setTurn(true)
            await registerForPushNotificationsAsync()
        } else {
            setTurn(false)
            await removeTokenFromServer()
            await SecureStore.deleteItemAsync("token")
            await SecureStore.deleteItemAsync("pushId")
            setExpoPushToken("")
        }
    }

    const fetchOrders = async()=>{
      const link = `${base_url}/orders`

      const response = await fetch(link, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json()
      if(result.message == "success"){
        console.log(result.orders)
        setOrders(result.orders)
      }
    }

    const approveOrder = async(orderId)=>{
      const link = `${base_url}/order/approve/${orderId}`

      const response = await fetch(link, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json()
      if(result.message == "success"){
        setOrders(result.orders)
        onRefresh()
      }

    }

    const flagOrder = async(orderId)=>{
      const link = `${base_url}/order/flag/${orderId}`

      const response = await fetch(link, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json()
      if(result.message == "success"){
        setOrders(result.orders)
        socketRef.current.emit('flag-order', orderId);
        onRefresh()
      }

    }

    const onRefresh = async()=>{
      setRefreshing(true)
      await fetchOrders()
      setRefreshing(false)  
    };

    useEffect(()=>{

      if (!socketRef.current) {
        // ✅ Ensure only one socket connection

      socketRef.current = io(base_url, { transports: ["websocket"] });
      socketRef.current.on("connect", () => {
        console.log("Socket connected!");
        socketRef.current.emit('user-connected', 'ADMIN', null, null);

        socketRef.current.on("user-joined", (socketId) => {
            fetchOrders()
            console.log("ADMIN joined event received:", socketId);
        });

        socketRef.current.on("new-pending-order", (pendingOrders) => {
          console.log("pending orders: ", pendingOrders);
          fetchOrders()
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

     useEffect(() => {

      const checkPushToken = async()=>{
          const localDeviceToken = await SecureStore.getItemAsync("token")
          if(localDeviceToken === null){
            setTurn(false)
            console.log("No saved push tokens!")
          } else {
            setTurn(true)
            console.log("The saved push token is: ", localDeviceToken)
          }
      }

      checkPushToken()

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

      // Listener for user interaction with the notification
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        //  console.log('User interacted with the notification:', response);
        const route = response.notification.request.content.data.route; // Route from the notification payload
        if (route) {
          navigation.navigate(route);
        }
        });
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
     
    }, []);
  
  return (
        <View style={styles.container}>

          <ScrollView style={tw`flex flex-col h-full w-full `} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            {/* APP NAME */}
            <Text style={tw`text-white font-bold text-2xl self-center`}>anything.app</Text>
            <TouchableOpacity style={tw`flex flex-col justify-center mt-2 mb-2`}>
            <View style={tw`flex flex-row justify-between items-center ml-4`}>
                <View style={tw`flex flex-row`}>
                    <FontAwesome5 name="bell" size={24} color="white" />
                    <Text style={tw`text-white text-lg ml-2`}>Notifications</Text>
                </View>
                <Switch rackcolor={{ false: "#87CEEB", true: "#87CEEB" }} thumbColor={turn ? "#fff" : "#f4f3f4"} value={turn} onValueChange={getNotification} />
            </View>
            </TouchableOpacity>

            <FlatList data={orders} keyExtractor={(item, index) => index.toString()} renderItem={({ item })=>( 
                <>

            {/* ORDER NUMBER */}
            <View style={tw`flex flex-row justify-between items-center self-center w-4/5 my-4`}>
                <Text style={tw`text-white font-bold text-2xl`}>Order  </Text>
                <TouchableOpacity><AntDesign name="caretdown" size={24} color="white" /></TouchableOpacity>
            </View>
            
            <View style={tw`flex flex-col justify-center w-4/5 self-center`}>
              
              {/* NAME */}
              <View style={tw`flex flex-col justify-start`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Name</Text>
                <Text style={tw`text-white font-light text-lg self-start`}>{item.name}</Text>
              </View>

              {/* ADDRESS */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Address</Text>
                <Text style={tw`text-white font-light text-lg self-start`}>{item.address}</Text>
              </View>

              {/* PHONE NUMBER */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Phone Number</Text>
                <Text style={tw`text-green-500 font-light text-lg self-start`}>{item.phoneNumber}</Text>
              </View>

              {/* Order List */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Order List</Text>
                <Text style={tw`text-white font-light text-lg self-start`}>{item.list}</Text>
              </View>

              {/* BUTTONS */}

              {item.status == "PENDING" ?
                <View style={tw`flex flex-row justify-evenly w-full mt-4`}>
                  <TouchableOpacity onPress={()=> approveOrder(item._id)} style={tw`flex flex-row justify-center items-center rounded-3xl px-6 h-12 bg-green-500 mr-2`}><Text style={tw`text-white font-bold text-center text-xl`}>Approve Order</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=> flagOrder(item._id)} style={tw`flex flex-row justify-center items-center rounded-3xl px-6 h-12 bg-red-500`}><Text style={tw`text-white font-bold text-center text-xl`}>Flag order</Text></TouchableOpacity>
                </View>
                :
                <View style={tw`flex flex-row justify-evenly w-full mt-4`}>
                  {item.status == "APPROVED" ?
                    <> 
                    <TouchableOpacity style={tw`flex flex-row justify-center items-center rounded-3xl px-6 h-12 bg-green-500 mr-2`}>
                      <Text style={tw`text-white font-bold text-center text-xl`}>Approved!</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={tw`flex flex-row justify-center items-center rounded-3xl px-6 h-12 bg-gray-400  mr-2`}>
                      <Text style={tw`text-gray-100 font-bold text-center text-xl`}>flag order</Text>
                    </TouchableOpacity>
                    </>
                    :

                    <>
                    <TouchableOpacity style={tw`flex flex-row justify-center items-center rounded-3xl px-6 h-12 bg-gray-400 mr-2`}>
                      <Text style={tw`text-gray-100 font-bold text-center text-xl`}>Approve Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={tw`flex flex-row justify-center items-center rounded-3xl px-6 h-12 bg-red-500 mr-2`}>
                      <Text style={tw`text-white font-bold text-center text-xl`}>Order Flagged!</Text>
                    </TouchableOpacity>
                    </>
                  }
                
                </View>
              }
              

              {/* DELIVERY PERSON */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Delivery Person</Text>
                <Text style={tw`text-white font-light text-lg self-start`}>{item.status !== "ASSIGNED" ? "NOT ASSIGNED" : item.deliveryPerson} <Text style={tw`text-green-500`}>{item.status !== "ASSIGNED" ? "NOT ASSIGNED" : item.deliveryPersonNumber}</Text></Text>
              </View>

              {/* CURRENT LOCATION */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Current Location</Text>
                <Text style={tw`text-white font-light text-lg self-start`}>{item.status == "ASSIGNED" ? "Check on" : ""} <Text style={tw`text-green-500`}>{item.status == "ASSIGNED" ? "WhatsApp" : ""}</Text></Text>
              </View>

              {/* OTP SENT */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>OTP sent</Text>
                <Text style={tw`text-white font-light text-lg self-start`}>{item.status == "ASSIGNED" ? "9215" : ""}</Text>
              </View>

              {/* ORDER STATUS */}
              <View style={tw`flex flex-col justify-start mt-4`}>
                <Text style={tw`text-white font-medium text-xl self-start`}>Order Status</Text>
                <Text style={tw`text-white font-light text-lg self-start`}><Text style={tw`text-green-500`}>{item.status}</Text> {item.status == "ASSIGNED" ? `${item.deliveryPerson} has earned Rs. 200` : ""}</Text>
              </View>

            </View>

            </>

            )} />

          </ScrollView>
  
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor: '#000',
     height: height,
     width: width,
     paddingTop: 50,
    },
})
