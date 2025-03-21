import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react"
import { StyleSheet, Text, Alert, View, ActivityIndicator, KeyboardAvoidingView, Button, Platform, ToastAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from "react-redux"
import { store } from "./store"
import HomeScreen from './screens/home';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <Provider store={store} style={styles.container}>
    <NavigationContainer>
        <SafeAreaProvider>
          <StatusBar />
          <KeyboardAvoidingView behavior={Platform.OS === "ios"  ? "padding":"height"} style={{ flex: 1}}
          keyboardVerticalOffset={Platform.OS === "android" ? -64 : 0}>
            
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              </Stack.Navigator>

          </KeyboardAvoidingView>
        </SafeAreaProvider>
    </NavigationContainer>
    </Provider>
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
