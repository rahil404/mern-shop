import React, {useState} from 'react';
import axios from 'axios';
// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from './CardInput';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { useStateValue } from "./StateProvider";
import Alert from '@material-ui/lab/Alert';

const MyCheckoutForm = (props) => {
  const [{ basket }, dispatch] = useStateValue();
  console.log("amount in ..", props.amount);
  // const classes = useStyles();
  // State
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  let userEmail  = localStorage.getItem("user-email");
  const token  = localStorage.getItem("auth-token");
  
  const stripe = useStripe();
  const elements = useElements();

  //get current date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    } else {
      console.log("loaded");
    }

    await axios.post('/api/pay', {email: email, amount: props.amount})
    .then(async (res) => {
      console.log(res);
      if (res.status == 200) {
        console.log("payment succeded !");
        setShow(true);
        

        basket.map(async (item) => {
          console.log(item.id);
          let purchase = {user: userEmail, product: item.title, image: item.image, price: item.price, quantity: item.quantity, date: today};
          await axios.post('/api/purchases/add', purchase, { headers: {"x-auth-token": token} })
          .then(res => {
            console.log(res);
            dispatch({
              type: "ADD_PURCHASE",
              purchase: purchase,
            });
            dispatch({
              type: "REMOVE_FROM_BASKET",
              id: item.id,
            });
          })
        });
        // alert("payment succeded !");
        window.location.reload(false);
        console.log(basket);
      }
    })
  };

  return (
    <div style={{marginTop: "-25px"}}>
    <CardContent>
          <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label for="ccc">Card Number</label>
            <input required className="form-control" id="ccc" type="tel" inputmode="numeric" pattern="[0-9\s]{13,19}" autocomplete="cc-number" maxlength="19" placeholder="xxxx xxxx xxxx xxxx" />
          </div>
          <button type="submit" className="btn btn-primary">
            Pay
          </button>
          </form>
      </CardContent>
      <div style={{position: "relative", top: "500px"}}>
      {show ? (
      <Alert onClose={() => setShow(false)}>Payment succeeded!</Alert>
        ) : (null)}
      </div>
    </div>
  );
}

export default MyCheckoutForm;