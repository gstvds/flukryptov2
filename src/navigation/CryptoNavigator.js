import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import LoginScreen from "../screens/Login";
import MainScreen from "../screens/Main";
import SearchScreen from "../screens/Search";
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

const SearchNavigator = createStackNavigator(
  {
    Search: SearchScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const tabScreenConfig = {
  Main: {
    screen: HomeNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <Ionicons name="ios-home" size={23} color={tabInfo.tintColor} />;
      },
      tabBarColor: Colors.primary
    }
  },
  Search: {
    screen: SearchNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          <Ionicons name="ios-search" size={23} color={tabInfo.tintColor} />
        );
      }
    }
  }
};

const TabNavigator = createBottomTabNavigator(tabScreenConfig, {
  tabBarOptions: {
    showLabel: false,
    activeTintColor: Colors.primary
  }
});

const LoginNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    Signup: SignupScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Login: LoginNavigator,
  Main: TabNavigator
});

export default createAppContainer(MainNavigator);
