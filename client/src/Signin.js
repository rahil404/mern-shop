import React, { useState } from "react";
import axios from 'axios';
import { Link, Redirect, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import "./Login.css";
import Alert from '@material-ui/lab/Alert';

function Signin() {
  const [{products}, dispatch] = useStateValue();

  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  // let loggedIn  = localStorage.getItem("user");

  const login = (event) => {
    event.preventDefault();

    const user = {
      email: email,
      password: password
    }

        axios.post('/api/users/login', user)
      .then(async (res) => {
        console.log("logged in", res.data);
        // console.log("token after login", token);

        if (!res.data.token) {
            console.log(res);
        } else {

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
            localStorage.removeItem("adminLoggedIn");
            history.push("/");
        }  
      })
      .catch(err => {
        setShow(true);
        console.log("failed logged in", err);
      })
  };

  const register = (event) => {
    history.push("/signup");
  };

  return (
    <div>
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
      {/* logo */}
      <Link to="/">
        <img
          style={{width: "50px", position: "relative", top: "-10px"}}
          className="header__logo"
          src="logo1.png"
          alt=""
        />
        <a style={{fontWeight: "bold"}} className="navbar-brand" href="#">Online-Shop</a>      
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
    </nav>





    <div style={{position: "relative", top: "100px"}} className="login">

      <div className="login__container">
        <h1>Sign in</h1>
        <form onSubmit={login}>
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
            Sign In
          </button>         
        </form>

        <div style={{marginTop: "8px"}}>
          {show ? (
          <Alert severity="error" onClose={() => setShow(false)}>Incorrect email or password</Alert>
            ) : (null)}
        </div>

        <p style={{textAlign: "center", fontWeight: "bold"}}>Not a user?</p>
        <button onClick={register} className="login__registerButton">
          Create an Account
        </button>
      </div>
    </div>
    </div>
  );

}

export default Signin;
