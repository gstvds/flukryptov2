import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList,
  Platform
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import axios from "axios";

import CustomHeaderButton from "../components/HeaderButton";
import Initial from "../models/initial-data";
import * as authActions from "../store/actions/auth";
import List from "../components/List";

const MainScreen = props => {
  const { navigation } = props;
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let keyData = [];

  const allFetchedData = [];

  const dispatch = useDispatch();

  const logoutHandler = useCallback(() => {
    dispatch(authActions.logout());
  }, [dispatch]);

  useEffect(() => {
    navigation.setParams({ logout: logoutHandler });
  }, [logoutHandler]);

  const dataHandler = async () => {
    const Crypto = await axios.get(
      "https://min-api.cryptocompare.com/data/top/totaltoptiervolfull?limit=10&tsym=USD",
      {
        headers: {
          authorization:
            "Apikey 1b77159fd738954a7062f9ac985943cc43c326c63b70cec8613ebb96d36b3468"
        }
      }
    );
    const CryptoData = await Crypto.data.Data;
    for (var [key, value] of Object.entries(CryptoData)) {
      keyData.push(value.CoinInfo.Name);
    }
    const currency = "USD,EUR";
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${keyData}&tsyms=${currency}`,
      {
        headers: {
          authorization:
            "Apikey 1b77159fd738954a7062f9ac985943cc43c326c63b70cec8613ebb96d36b3468"
        }
      }
    );
    const responseData = await response.data;
    for (var [key, value] of Object.entries(responseData)) {
      usdValue = `$ ${value.USD.toFixed(2)}`;
      eurValue = `€ ${value.EUR.toFixed(2)}`;
      allFetchedData.push(new Initial(key, usdValue, eurValue));
    }
    setAllData(allFetchedData);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await dataHandler();
      setIsLoading(false);
    }
    loadData();
  }, []);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" coolor="black" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.mainTitle}>
        <Text style={styles.mainTitleText}>RANKING 10 CRIPTOMOEDAS</Text>
        <Text style={styles.mainTitleText}>(por volume em USD)</Text>
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText}>Criptomoeda</Text>
        <Text style={styles.titleText}>Valor em USD</Text>
        <Text style={styles.titleText}>Valor em EUR</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={allData}
          renderItem={({ item }) => (
            <List data={item.data} usd={item.usd} eur={item.eur} />
          )}
          keyExtractor={item => item.data}
        />
      </View>
    </View>
  );
};

MainScreen.navigationOptions = navData => {
  return {
    headerTitle: "Ranking",
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
    flex: 1,
    backgroundColor: "#333"
  },
  mainTitle: {
    alignItems: "center",
    marginVertical: 10
  },
  mainTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginHorizontal: 5
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default MainScreen;
