import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  FlatList
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import axios from "axios";

import CustomHeaderButton from "../components/HeaderButton";
import Initial from "../models/initial-data";

const MainScreen = props => {
  const [cryptoData, setCryptoData] = useState([]);
  const [usdPrice, setUsdPrice] = useState([]);
  const [eurPrice, setEurPrice] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let keyData = [];
  let currencyValue = {
    usdValue: [],
    eurValue: []
  };

  let customData = {
    data: [],
    usd: [],
    eur: []
  };

  const allFetchedData = [];

  const dataHandler = async () => {
    const Crypto = await axios.get(
      "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD"
    );
    const CryptoData = await Crypto.data.Data;
    for (var [key, value] of Object.entries(CryptoData)) {
      keyData.push(value.CoinInfo.Name);
    }
    setCryptoData(keyData);
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
      currencyValue.usdValue.push(value.USD);
      currencyValue.eurValue.push(value.EUR);
      customData.data.push(key);
      customData.usd.push(value.USD);
      customData.eur.push(value.EUR);
    }
    allFetchedData.push(
      new Initial(customData.data, customData.usd, customData.eur)
    );
    setAllData(allFetchedData);
    setUsdPrice(currencyValue.usdValue);
    setEurPrice(currencyValue.eurValue);
    console.log(allData);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await dataHandler();
      setIsLoading(false);
    }
    loadData();
  }, []);

  function List({ data, usd, eur }) {
    return (
      <View>
        <Text style={styles.flatText}>{data}</Text>
        <Text style={styles.flatText}>{usd}</Text>
        <Text style={styles.flatText}>{eur}</Text>
      </View>
    );
  }

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" coolor="black" />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.mainTitle}>
        <Text style={styles.mainTitleText}>
          RANKING 10 CRIPTOMOEDAS (POR VOLUME)
        </Text>
        <Button title="WTF" onPress={dataHandler} />
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText}>Criptomoeda</Text>
        <Text style={styles.titleText}>Valor em USD</Text>
        <Text style={styles.titleText}>Valor em EUR</Text>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={cryptoData}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.flatText}>{item}</Text>
            </View>
          )}
          keyExtractor={item => item}
        />
        <FlatList
          data={usdPrice}
          renderItem={({ item }) => (
            <Text style={styles.flatText}>{JSON.stringify(item)}</Text>
          )}
          keyExtractor={item => item.toString()}
        />
        <FlatList
          data={eurPrice}
          renderItem={({ item }) => (
            <Text style={styles.flatText}>{JSON.stringify(item)}</Text>
          )}
          keyExtractor={item => item.toString()}
        />
        {/* <FlatList
            data={allData}
            renderItem={({ itemData }) => (
              <List
                data={itemData.data}
                usd={itemData.usd}
                eur={itemData.eur}
              />
            )}
            keyExtractor={itemData => itemData}
          /> */}
      </View>
    </View>
  );
};

MainScreen.navigationOptions = navData => {
  return {
    headerTitle: "Cryptocurrency",
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Logout" iconName="ios-log-out" onPress={() => {}} />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainTitle: {
    alignItems: "center",
    marginVertical: 10
  },
  mainTitleText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  listContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flatText: {
    flex: 1,
    padding: 5,
    marginBottom: 5,
    marginHorizontal: 15,
    fontSize: 23,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center"
  }
});

export default MainScreen;
