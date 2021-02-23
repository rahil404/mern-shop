import React, { useState, useEffect } from "react";
import "./Subtotal.css";
import { useStateValue } from "./StateProvider";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import MyCheckoutForm from './MyCheckoutForm';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51I8YnYKYfFgj9AHVZKUt39Do0F1qRy6DYUGm8DsXVlATrBaPN0N5FZQapH6yzivEzSbH1rSnPQmm5xRRYCycEQPB00gO7PU6o4');

function Subtotal() {
  const [{ basket }, dispatch] = useStateValue();

  const [amount, setAmount] = useState("");
console.log(getBasketTotal(basket));
  // const pay = () => {
  //   axios.post('http://localhost:5000/api/pay')
  //   .then(res => {
  //     console.log(res);
  //   })
  // }

  return (
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
  );
}

export default Subtotal;
