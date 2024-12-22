import "./App.css";
import Header from "./component/layout/Header/Header.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userActions";
import UserOptions from "./component/layout/Header/UserOptions";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js"
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrder";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey()
  }, []);

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
          {isAuthenticated && <Route path="/process/payment" element={<Payment />} />}
        </Routes>
      </Elements>

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/product/:id" element={<ProductDetails />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/products/:keyword" element={<Products />}></Route>
        <Route path="/search" element={<Search />}></Route>
        {isAuthenticated && <Route path="/account" element={<Profile />}></Route>}
        {isAuthenticated && <Route path="/me/update" element={<UpdateProfile />}></Route>}
        {isAuthenticated && <Route path="/password/update" element={<UpdatePassword />}></Route>}
        <Route path="/password/forgot" element={<ForgotPassword />}></Route>
        <Route path="/password/reset/:token" element={<ResetPassword />}></Route>
        <Route path="/login" element={<LoginSignUp />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        {isAuthenticated && <Route path="/shipping" element={<Shipping />}></Route>}
        {isAuthenticated && <Route path="/order/confirm" element={<ConfirmOrder />}></Route>}
        {isAuthenticated && <Route path="/success" element={<OrderSuccess />}></Route>}
        {isAuthenticated && <Route path="/orders" element={<MyOrders />}></Route>}
      </Routes>
      {/* <Home /> */}
      <Footer />
    </Router>
  );
}

export default App;
