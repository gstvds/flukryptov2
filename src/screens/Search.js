import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

import CustomHeaderButton from "../components/HeaderButton";
import Crypto from "../models/crypto";

const SearchScreen = props => {
  let dataLabel = [];
  let dataValue = [];
  let CryptoData = [];
  const [fetchCurrency, setFetchCurrency] = useState([]);
  const [userEntry, setUserEntry] = useState("");

  const dataHandler = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=50&tsym=USD"
    );

    const responseData = response.data.Data;
    for (var [key, value] of Object.entries(responseData)) {
      // dataLabel.push(value.CoinInfo.FullName);
      // dataValue.push(value.CoinInfo.Name);
      CryptoData.push(
        new Crypto(key, value.CoinInfo.FullName, value.CoinInfo.Name)
      );
    }
    console.log(CryptoData);
  };

  return (
    <View style={styles.container}>
      <Text>Search Screen</Text>
      <Button title="test" onPress={dataHandler} />
      <RNPickerSelect
        onValueChange={(value, index) => setUserEntry(value)}
        items={CryptoData}
      />
    </View>
  );
};

SearchScreen.navigationOptions = navData => {
  return {
    headerTitle: "Search",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Logout" iconName="ios-log-out" onPress={() => {}} />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SearchScreen;
