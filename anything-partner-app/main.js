import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react"
import { StyleSheet, Text, Alert, View, ActivityIndicator, KeyboardAvoidingView, Button, Platform, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PartnerCodeScreen from './screens/partner-code';
import ReceiveOrderScreen from "./screens/receive-order"
import OrderAcceptionScreen from "./screens/accept-order"
import OrderDetailsScreen from './screens/orderdetails';
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
              <Stack.Screen name="Partner" component={PartnerCodeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ReceiveOrders" component={ReceiveOrderScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Details" component={OrderDetailsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="OrderAcception" component={OrderAcceptionScreen} options={{ headerShown: false }} />
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
