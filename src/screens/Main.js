import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const MainScreen = props => {
  return (
    <View style={syles.container}>
      <Text>Main Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default MainScreen