import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from 'axios';
import Header from "./Header";
import Home from "./Home";
import Checkout from "./Checkout";
import Login from "./Login";
import EditProduct from "./EditProduct";
import AddProduct from "./AddProduct";
import Dashboard from "./Dashboard";
import Signin from "./Signin";
import Signup from "./Signup";
import Purchased from "./Purchased";
import { useStateValue } from "./StateProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

function App() {
  const [{ user, products, purchases }, dispatch] = useStateValue();

console.log("userRes.data");
  //useEffect
  useEffect(() => {
    const checkLoggedIn = async () => {
      console.log("userRes.data");
      let token  = localStorage.getItem("auth-token");
      let userEmail  = localStorage.getItem("user-email");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const tokenRes = await axios.post(
        '/api/auth/tokenIsValid',
        null,
        { headers: {"x-auth-token": token} }
        );

      // get user data if token valid
      if (tokenRes.data) {
        const userRes = await axios.get('/api/auth/user', 
          { headers: {"x-auth-token": token} });
        console.log(userRes.data);

        if (userRes.data.isAdmin) {
          console.log("Admin");
          localStorage.removeItem("customerLoggedIn");
          localStorage.setItem("adminLoggedIn", true);
        } else {
          console.log("Not Admin");
          localStorage.setItem("customerLoggedIn", true);
          localStorage.removeItem("adminLoggedIn");
        }

        dispatch({
          type: "SET_USER",
          user: userRes.data.name
        });

        localStorage.setItem("user", userRes.data.name);
      } else {
        localStorage.setItem("user", "");
        localStorage.setItem("auth-token", "");
      }

      //get products
//       const pRes = await axios.get('/api/products');
//       console.log(pRes.data);
//       dispatch({
//           type: "SET_PRODUCTS",
//           products: pRes.data
//         });
    
      //get products
      await axios.get('/api/products')
      .then(pRes => {
        console.log(pRes.data);
        dispatch({
          type: "SET_PRODUCTS",
          products: pRes.data
        });
      })
      
      //get purchased items
      await axios.get('/api/purchases/'+userEmail, { headers: {"x-auth-token": token} })
      .then(purchasesRes => {
        console.log(purchasesRes.data);
        dispatch({
            type: "SET_PURCHASES",
            purchases: purchasesRes.data
          });
      })
      
    };

    checkLoggedIn();
  }, []);


  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/admin">
            <Login />
          </Route>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/signup">
            <Header />
            <Signup />
          </Route>
          <Route path="/purchased">
            <Header />
            <Purchased />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/products/edit/:id">
            <EditProduct />
          </Route>
          <Route path="/products/add">
            <AddProduct />
          </Route>
          {/* This is the default route */}
          <Route path="/">
            <Header />
            <Home products ={products} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
