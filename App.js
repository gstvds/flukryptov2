import React from "react";
import { StatusBar } from "react-native";

import CryptoNavigator from "./src/navigation/CryptoNavigator";

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <CryptoNavigator />
    </>
  );
}
