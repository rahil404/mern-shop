import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import { useStateValue } from "./StateProvider";
import ReactTooltip from 'react-tooltip';
import Fade from 'react-reveal/Fade';

function Header() {
  const history = useHistory();
  const [{ basket, user, purchases }] = useStateValue();

  let customerLoggedIn  = localStorage.getItem("customerLoggedIn");

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    localStorage.removeItem("customerLoggedIn");
    localStorage.removeItem("user-email");
    window.location.reload(false);
  };

  

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
      {/* logo */}
      <Fade left>
      <Link to="/">
        <img
          style={{width: "50px", position: "relative", top: "-10px"}}
          className="header__logo"
          src="https://res.cloudinary.com/dr1xkn8l3/image/upload/v1614055064/logo1_snqcpl.png"
          alt=""
        />
        <a style={{fontWeight: "bold"}} className="navbar-brand" href="#">Online-Shop</a>
        
      </Link>
      </Fade>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
<Fade right>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
          
           <div className="header__nav ml-auto">
            {/* 1st link */}

            {/* 4th link */}
            
            {customerLoggedIn ? (

              <div className="header__loggedin__list">
              
                <Link to='/purchased'>
                  <a style={{color: "white"}} className="header__optionBasket">
                    Purchased Items
                  </a>
                </Link>

                <Link to="/checkout">
                  <div style={{color: "white"}} className="header__optionBasket">
                    <ShoppingBasket />
                    <span className="header__optionLineTwo header__basketCount">
                      {basket?.length}
                    </span>
                  </div>
                </Link>

                <button onClick={logout} className="btn btn-sm btn-secondary">
                  Logout
                </button>
                
              </div>
              
              ) : (
              <Link style={{marginRight: "20px"}} to="/signin">
                <button className="btn btn-md btn-secondary">
                  Login
                </button>
              </Link>
              )}
            
          </div>

      </div>
      </Fade>
      {/* 3 links */}
      
      {/* basket icon */}
    </nav>
  );
}

export default Header;
