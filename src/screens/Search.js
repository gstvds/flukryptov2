import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Platform,
  ActivityIndicator
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
  const [allData, setAllData] = useState([]);
  const [dayTitle, setDayTitle] = useState("");
  const [openTitle, setOpenTitle] = useState("");
  const [highTitle, setHighTitle] = useState("");
  const [lowTitle, setLowTitle] = useState("");
  const [closeTitle, setCloseTitle] = useState("");

  const [fromFull, setFromFull] = useState("");
  const [toFull, setToFull] = useState("");

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
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${fsym}&tsym=${tsym}&limit=${limit}`,
      {
        headers: {
          authorization:
            "Apikey 1b77159fd738954a7062f9ac985943cc43c326c63b70cec8613ebb96d36b3468"
        }
      }
    );
    const responseData = response.data.Data;
    const timeFrom = new Date(responseData.TimeFrom * 1000);
    const fromDate = timeFrom.getDate();
    const fromMonth = timeFrom.getMonth() + 1;
    const fromYear = timeFrom.getFullYear();
    const fullDateFrom = `${fromDate}/${fromMonth}/${fromYear} a`;
    setFromFull(fullDateFrom);
    const timeTo = new Date(responseData.TimeTo * 1000);
    const toDate = timeTo.getDate();
    const toMonth = timeTo.getMonth() + 1;
    const toYear = timeTo.getFullYear();
    const fullDateTo = `${toDate}/${toMonth}/${toYear}`;
    setToFull(fullDateTo);
    for (var [key, value] of Object.entries(responseData.Data)) {
      time = new Date(value.time * 1000);
      day = time.getDate();
      month = time.getMonth() + 1;
      fullTime = `${day}/${month}`;
      high = value.high.toFixed(2);
      low = value.low.toFixed(2);
      open = value.open.toFixed(2);
      close = value.close.toFixed(2);
      displayData.push(new Search(fullTime, high, low, open, close));
    }
    setAllData(displayData);
    setDayTitle("Data");
    setOpenTitle("Abertura");
    setHighTitle("Máximo");
    setLowTitle("Mínimo");
    setCloseTitle("Fechamento");
    console.log(responseData);
  };

  const clearScreenHandler = () => {
    setAllData([]);
    setDayTitle("");
    setOpenTitle("");
    setHighTitle("");
    setLowTitle("");
    setCloseTitle("");
    setFromFull("");
    setToFull("");
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

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" coolor="black" />
    </View>
  ) : (
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
        <View style={styles.buttons}>
          <Button
            title="Pesquisar"
            onPress={searchDailyData}
            color={Colors.primary}
          />
          <Button
            title="Limpar"
            onPress={clearScreenHandler}
            color={Colors.primary}
          />
        </View>
      </View>
      <View style={styles.dateTitle}>
        <Text style={styles.dateTitleText}>
          Período: {fromFull} {toFull}
        </Text>
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText}>{dayTitle}</Text>
        <Text style={styles.titleText}>{openTitle}</Text>
        <Text style={styles.titleText}>{highTitle}</Text>
        <Text style={styles.titleText}>{lowTitle}</Text>
        <Text style={styles.titleText}>{closeTitle}</Text>
      </View>
      <FlatList
        data={allData}
        extraData={allData}
        keyExtractor={item => item.day}
        renderItem={({ item }) => (
          <View style={styles.flatView}>
            <Text style={styles.flatText}>{item.day}</Text>
            <Text style={styles.flatText}>{item.open}</Text>
            <Text style={styles.flatText}>{item.high}</Text>
            <Text style={styles.flatText}>{item.low}</Text>
            <Text style={styles.flatText}>{item.close}</Text>
          </View>
        )}
      />
    </View>
  );
};

SearchScreen.navigationOptions = navData => {
  return {
    headerTitle: "Buscar",
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
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginTop: 5,
    color: "white"
  },
  pickerContainer: {
    marginTop: 5,
    padding: 5,
    marginBottom: 10
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  dateTitle: {
    justifyContent: "center",
    alignItems: "center"
  },
  dateTitleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white"
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    marginHorizontal: 5,
    padding: 4,
    color: "white"
  },
  flatView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flatText: {
    flex: 1,
    padding: 4,
    marginBottom: 5,
    marginHorizontal: 5,
    fontSize: 15,
    textAlign: "center",
    color: "white"
  }
});

export default SearchScreen;
