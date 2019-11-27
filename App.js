import React from "react";
import { StatusBar } from "react-native";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import searchReducer from "./src/store/reducers/search";
import CryptoNavigator from "./src/navigation/CryptoNavigator";

const rootReducer = combineReducers({
  search: searchReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <CryptoNavigator />
    </Provider>
  );
}
