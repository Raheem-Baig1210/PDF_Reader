import { StyleSheet, Text, View , Image, TouchableOpacity, Alert} from 'react-native'
import React from 'react'

const App = () => {
  return (
    <View>
      <Text>Welcome to PDF reader</Text>
      <Image 
      style={{width: 200 , height: 300}}
      source={{uri:"https://images.unsplash.com/photo-1747102330549-66897cb65d2c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}/>
      <TouchableOpacity style={{padding:10, backgroundColor: "green"}} onPress={()=> Alert.alert("Button Pressed....!!!!")}>
      <Text>Button</Text>
    </TouchableOpacity>
    </View>
    
  )
}

export default App

const styles = StyleSheet.create({})