import { View, Text, Dimensions, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import RNModal from 'react-native-modal';
import tw from 'twrnc'
const { width, height } = Dimensions.get("window")

function LoadingModal({ open, close, message, progress }){

    useEffect(()=>{
        if(progress === 99){
            close()
        }
    }, [progress])

  return (
    <View>
        {!open ? (<Text></Text>) : (
            <View>
              <RNModal isVisible={open} animationIn="zoomIn" animationOut="zoomOut">
                <View style={styles.forgotpassModal}>
                  <ActivityIndicator />
                </View>
              </RNModal>
            </View>
          )}
    </View>
  )
}

export default LoadingModal

const styles = StyleSheet.create({
    container: {
   flex: 1,
   backgroundColor: '#000',
   height: height,
   width: width,
 },

  forgotpassModal: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 10,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
    elevation: 5,
  },

  


})

