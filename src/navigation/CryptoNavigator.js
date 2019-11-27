import React from "react";
import { Platform } from "react-native";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "../screens/Login";
import MainScreen from "../screens/Main";
import SignupScreen from "../screens/Signup";
import Colors from "../constants/Colors";

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : ""
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary
};

const HomeNavigator = createStackNavigator(
  {
    Main: MainScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Home: HomeNavigator
});

export default createAppContainer(MainNavigator);
