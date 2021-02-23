import React, { useState, useEffect } from "react";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import "./Checkout.css";
import { Redirect } from "react-router-dom";
// import Subtotal from "./Subtotal";
import {Elements} from '@stripe/react-stripe-js';
import MyCheckoutForm from './MyCheckoutForm';
import {loadStripe} from '@stripe/stripe-js';
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import Alert from '@material-ui/lab/Alert';

const stripePromise = loadStripe('pk_test_51I8YnYKYfFgj9AHVZKUt39Do0F1qRy6DYUGm8DsXVlATrBaPN0N5FZQapH6yzivEzSbH1rSnPQmm5xRRYCycEQPB00gO7PU6o4');


function Checkout() {
  const [{ basket, showAlert }, dispatch] = useStateValue();
  const [amount, setAmount] = useState("");
let customerLoggedIn  = localStorage.getItem("customerLoggedIn");
console.log(customerLoggedIn);

if (customerLoggedIn) {
  return (
    <div className="checkout" style={{marginTop: "80px"}}>

{showAlert ? (
<Alert onClose={() => {dispatch({type: "HIDE_ALERT"});}}>Payment succeeded!</Alert>
  ) : (null)}


      <div className="checkout__left">
        <a href="#">
          <img
          className="checkout__ad"
          src="https://images.pexels.com/photos/2292953/pexels-photo-2292953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1250&w=1840"
        />
        </a>
        
        {basket?.length === 0 ? (
          <div>
            <h2>Basket is empty</h2>
            <p>
              You have no items in your basket. Click "Add to Basket" to add
              items.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="checkout__title">Your basket</h2>

            {/* List of items in the basket */}
            {basket.map((item) => {

              return (
                <CheckoutProduct
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                  quantity={item.quantity}
                />
              );
            })}
          </div>
        )}
      </div>
      {basket.length > 0 && (
        <div>
          <div className="subtotal">
            <CurrencyFormat
              renderText={(value) => {
                setAmount(value);
                return (
                <>
                  <p style={{paddingLeft: "15px"}}>
                    Subtotal ({basket.length} item/s): <strong>{`${value}`}</strong>
                  </p>
                </>
              )}
              } 
              decimalScale={2}
              value={getBasketTotal(basket)}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"$"}
            />
            <Elements style={{position: "relative", bottom: "50px"}} stripe={stripePromise}>
              <MyCheckoutForm amount={amount} />
            </Elements>     
          </div>
        </div>
      )}
    </div>
  );
} else {
  return <Redirect to="/" />
}
}

export default Checkout;
