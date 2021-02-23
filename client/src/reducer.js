export const initialState = {
  basket: [],
  products: [],
  purchases: [],
  user: null,
};

export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => (item.price*item.quantity) + amount, 0);

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: action.token,
      };
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.products,
      };
    case "SET_PURCHASES":
      return {
        ...state,
        purchases: action.purchases,
      };
    case "ADD_PURCHASE":
      //logic for adding item to basket
      return {
        ...state,
        purchases: [...state.purchases, action.purchase],
      };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "ADD_TO_BASKET":
      //logic for adding item to basket
      return {
        ...state,
        basket: [...state.basket, action.item],
      };
      break;
    case "UPDATE_BASKET":
      //logic for updating item in basket
console.log(action.item);
      const index2 = state.basket.findIndex(
        (basketItem) => basketItem.id === action.item.id
      );
console.log(index2);
      return {
        ...state,
        basket: [...state.basket.slice(0,index2), action.item, ...state.basket.slice(index2+1)],
      };
      break;
    case "REMOVE_FROM_BASKET":
      //logic for removing item from basket
      let newBasket = [...state.basket];

      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(`Cant remove product as no item with the id`);
      }

      return { ...state, basket: newBasket };
      break;
    default:
      return state;
  }
}

export default reducer;
