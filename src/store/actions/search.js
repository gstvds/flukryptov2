import Crypto from "../../models/crypto";
import axios from "axios";

export const FETCH_CRYPTO_DATA = "FETCH_CRYPTO_DATA";

export const fetchData = () => {
  return async dispatch => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/top/totalvolfull?limit=50&tsym=USD"
    );
    const responseData = await response.data.Data;
    const cryptoData = [];

    for (var [key, value] of Object.entries(responseData)) {
      cryptoData.push(
        new Crypto(key, value.CoinInfo.FullName, value.CoinInfo.Name)
      );
    }
    dispatch({ type: FETCH_CRYPTO_DATA, datas: cryptoData });
  };
};
