import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react"
import { StyleSheet, Text, Alert, View, ActivityIndicator, KeyboardAvoidingView, Button, Platform, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/home';
import WelcomeScreen from './screens/welcome';
import OrderInputScreen from './screens/order-input';
import AddressInputScreen from "./screens/address-input";
import DetailsScreen from "./screens/details"
import WaitingListScreen from "./screens/waiting-list"
import OrderCompletionScreen from "./screens/order-completion"

const Stack = createNativeStackNavigator()

export default function Navigator() {

  return (
      <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar />
          <KeyboardAvoidingView behavior={Platform.OS === "ios"  ? "padding":"height"} style={{ flex: 1}}
          keyboardVerticalOffset={Platform.OS === "android" ? -64 : 0}>
            
              <Stack.Navigator>
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="OrderInput" component={OrderInputScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Address" component={AddressInputScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="WaitingList" component={WaitingListScreen} options={{ headerShown: false }} />
              <Stack.Screen name="OrderCompletion" component={OrderCompletionScreen} options={{ headerShown: false }} />

             </Stack.Navigator>
        
        </KeyboardAvoidingView>
        </SafeAreaProvider>
        </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
