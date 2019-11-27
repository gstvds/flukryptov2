import { FETCH_CRYPTO_DATA } from "../actions/search";

const initialState = {
  datas: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CRYPTO_DATA:
      return {
        datas: action.datas
      };
    default:
      return state;
  }
};
