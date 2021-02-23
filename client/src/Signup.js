import React, { useState } from "react";
import axios from 'axios';
import { Link, Redirect, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import "./Login.css";

function Signup() {
  const [{products}, dispatch] = useStateValue();

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // let loggedIn  = localStorage.getItem("user");

  const register = (event) => {
    event.preventDefault();

    const user = {
        name: name,
        email: email,
        password: password
    }


        axios.post('/api/users/create', user)
      .then(async (res) => {
        console.log("registered and logged in", res.data);
        // console.log("token after login", token);

        // set purchases
        await axios.get('/api/purchases/'+res.data.user.email, { headers: {"x-auth-token": res.data.token} })
        .then(purchasesRes => {
          console.log(purchasesRes.data);
          dispatch({
              type: "SET_PURCHASES",
              purchases: purchasesRes.data
            });
        })

        localStorage.setItem("auth-token", res.data.token);
        localStorage.setItem("user", res.data.user.name);
        localStorage.setItem("user-email", res.data.user.email);
        localStorage.setItem("customerLoggedIn", true);
        history.push("/");
      })
    

  };

  return (
    <div style={{marginTop: "100px"}} className="login">

      <div className="login__container">
        <h1>Create an Account</h1>
        <form onSubmit={register}>
          <h5>Full Name</h5>
          <input
            required
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <h5>E-mail</h5>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <h5>Password</h5>
          <input
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="login__signInButton">
            Register
          </button>
        </form>
        
      </div>
    </div>
  );

}

export default Signup;
