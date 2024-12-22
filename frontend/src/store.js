import { configureStore } from '@reduxjs/toolkit'
import { applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { productsDetailsReducer, productsReducer } from "./reducers/productReducers"
import { forgotPasswordReducer, profileReducer, userReducer } from "./reducers/userReducers"
import { cartReducer } from "./reducers/cartReducer"
import { myOrdersReducer, newOrderReducer } from './reducers/orderReducer'

// we dont need combinereducers for configure store
// const reducer = combineReducers({
//     product:productsReducer,
// })


// // Load the initial state from localStorage
// const loadState = () => {
//     try {
//         const serializedState = localStorage.getItem('cart');
//         if (serializedState === null) {
//             return undefined; // Return undefined to use the default initial state
//         }
//         return JSON.parse(serializedState);
//     } catch (error) {
//         console.error('Error loading state from localStorage:', error);
//         return undefined; // Return undefined to use the default initial state
//     }
// };

// // Save the state to localStorage
// const saveState = (state) => {
//     try {
//         const serializedState = JSON.stringify(state);
//         localStorage.setItem('cart', serializedState);
//     } catch (error) {
//         console.error('Error saving state to localStorage:', error);
//     }
// };


let initialState = {
    cart: {
      cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : []
    },
};
// const initialState = loadState();

const middleware = [thunk];

const store = configureStore({
    reducer: {
        products: productsReducer,
        productsDetails: productsDetailsReducer,
        user: userReducer,
        profile: profileReducer,
        forgotPassword: forgotPasswordReducer,
        cart: cartReducer,
        newOrder : newOrderReducer,
        myOrders : myOrdersReducer
    }
}, initialState, composeWithDevTools(applyMiddleware(...middleware)));


// // Subscribe to changes in the Redux store
// store.subscribe(() => {
//     const state = store.getState();
//     saveState(state);
// });


export default store;