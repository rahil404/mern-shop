import React, { useState } from "react";
import axios from 'axios';
import { Link, Redirect, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import "./Login.css";
import Alert from '@material-ui/lab/Alert';

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  let loggedIn  = localStorage.getItem("user");
  const adminLoggedIn  = localStorage.getItem("adminLoggedIn");
  
  const login = (event) => {
    event.preventDefault();

    const user = {
      email: email,
      password: password
    }
// console.log(user);
// console.log("token before login", token);
    axios.post('/api/auth', user)
      .then(res => {
        console.log("logged in", res.data);
// console.log("token after login", token);
        if (res.data.user.isAdmin) {
          localStorage.removeItem("customerLoggedIn");
          localStorage.setItem("adminLoggedIn", true);
          localStorage.setItem("auth-token", res.data.token);
          localStorage.setItem("user", res.data.user.name);
          history.push("/dashboard");
        } else {
          setShow(true);
        }
      })
      .catch(err => {
        setShow(true);
        console.log("failed logged in", err);
      })

  };

if (adminLoggedIn) {
  return <Redirect to="/dashboard" />
} else {
  return (
    <div className="login">

    

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

        <div style={{marginTop: "5px"}}>
          {show ? (
          <Alert severity="error" onClose={() => setShow(false)}>Incorrect email or password</Alert>
            ) : (null)}
        </div>
        
      </div>
    </div>
  );
} 
}

export default Login;
