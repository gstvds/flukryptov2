import React from "react";
import { View, Text, StyleSheet } from "react-native";

const List = props => {
  return (
    <View style={{ ...styles.flatView, ...props.style }}>
      <Text style={{ ...styles.flatText, ...props.style }}>{props.data}</Text>
      <Text
        style={{ ...styles.flatText, ...styles.flatTextCoin, ...props.style }}
      >
        {props.usd}
      </Text>
      <Text
        style={{ ...styles.flatText, ...styles.flatTextCoin, ...props.style }}
      >
        {props.eur}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  flatView: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flatText: {
    flex: 1,
    padding: 4,
    marginBottom: 5,
    marginHorizontal: 10,
    fontSize: 23,
    textAlign: "center",
    color: "white"
  },
  flatTextCoin: {
    textAlign: "right"
  }
});

export default List;
