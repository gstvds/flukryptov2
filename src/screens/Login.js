import React from "react";
import { TextInput, Text, StyleSheet } from "react-native";

import Card from "../components/Card";

const LoginScreen = props => {
  return (
    <Card>
      <Text>username</Text>
      <TextInput />
      <Text>password</Text>
      <TextInput />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LoginScreen;
