import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Platform
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import axios from "axios";

import Colors from "../constants/Colors";
import CustomHeaderButton from "../components/HeaderButton";
import { Currency, Data } from "../data/currency";
import * as searchActions from "../store/actions/search";
import * as authActions from "../store/actions/auth";

import Search from "../models/search-data";

const SearchScreen = props => {
  const { navigation } = props;

  const [fsym, setFsym] = useState("");
  const [tsym, setTsym] = useState("");
  const [limit, setLimit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const data = useSelector(state => state.search.datas);

  const displayData = [];

  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    await dispatch(searchActions.fetchData());
    setIsLoading(false);
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    loadData();
  }, [loadData, dispatch]);

  const logoutHandler = useCallback(() => {
    dispatch(authActions.logout());
  }, [dispatch]);

  useEffect(() => {
    navigation.setParams({ logout: logoutHandler });
  }, [logoutHandler]);

  const searchDailyData = async () => {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${fsym}&tsym=${tsym}&limit=${limit}`
    );
    const responseData = response.data.Data;
    const timeFrom = new Date(responseData.TimeFrom * 1000).toUTCString();
    const timeTo = new Date(responseData.TimeTo * 1000).toUTCString();
    const highValue = [];
    const lowValue = [];
    const openValue = [];
    const closeValue = [];
    for (var [key, value] of Object.entries(responseData.Data)) {
      highValue.push(value.high);
      lowValue.push(value.low);
      openValue.push(value.open);
      closeValue.push(value.close);
    }
    displayData.push(
      new Search(timeFrom, timeTo, highValue, lowValue, openValue, closeValue)
    );
  };

  const pickerStyle = {
    inputIOS: {
      color: Colors.primary,
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
      fontSize: 15
    },
    inputAndroid: {
      color: Colors.primary,
      fontSize: 15
    },
    placeholderColor: "black",
    underline: { borderTopWidth: 0 }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerTitle}>Escolha uma Criptomoeda</Text>
        <RNPickerSelect
          onValueChange={(value, index) => setFsym(value)}
          items={data}
          style={{ ...pickerStyle }}
          useNativeAndroidPickerStyle={false}
        />
        <Text style={styles.pickerTitle}>Escolha uma Conversão</Text>
        <RNPickerSelect
          onValueChange={(value, index) => setTsym(value)}
          items={Currency}
          style={{ ...pickerStyle }}
          useNativeAndroidPickerStyle={false}
        />
        <Text style={styles.pickerTitle}>Escolha um período</Text>
        <RNPickerSelect
          onValueChange={(value, index) => setLimit(value)}
          items={Data}
          style={{ ...pickerStyle }}
          useNativeAndroidPickerStyle={false}
        />
        <Button
          title="Submit"
          onPress={searchDailyData}
          color={Colors.primary}
        />
      </View>
      <ScrollView></ScrollView>
    </View>
  );
};

SearchScreen.navigationOptions = navData => {
  return {
    headerTitle: "Search",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Logout"
          iconName={Platform.OS === "android" ? "md-log-out" : "ios-log-out"}
          onPress={() => {
            navData.navigation.getParam("logout");
            navData.navigation.navigate("Login");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginTop: 5
  },
  pickerContainer: {
    marginTop: 5,
    padding: 5,
    marginBottom: 10
  }
});

export default SearchScreen;
