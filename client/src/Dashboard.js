import React, { useState, useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import axios from 'axios';
import {Image} from 'cloudinary-react';
// import "./Login.css";


function Dashboard() {
  const token  = localStorage.getItem("auth-token");
  
  const [{ products }, dispatch] = useStateValue();
  const Product = props => (
  <tr>
    <td>
      <Image
        style = {{width: "40px"}}
        cloudName = "dr1xkn8l3"
        publicId = {props.product.image}
       />
    </td>
    <td>{props.product.name}</td>
    <td>{props.product.price}</td>
    <td>{props.product.desc}</td>
    <td>{props.product.register_date.substring(0,10)}</td>
    <td>
      <Link 
      to={{ pathname: "/products/edit/"+props.product._id, 
      state: {
        name: props.product.name, price: props.product.price, desc: props.product.desc
      } 
      }}>
        Edit
      </Link> | <a style={{color: "red"}} href="#" onClick={() => { if(window.confirm('Delete the product?')){props.deleteProduct(props.product._id)}; }}>Delete</a>
    </td>
  </tr>
)

  const history = useHistory();

  const user  = localStorage.getItem("user");
  const adminLoggedIn  = localStorage.getItem("adminLoggedIn");
//delete product func

const deleteProduct = (id) => {
    axios.delete('/api/products/'+id, { headers: {"x-auth-token": token} })
      .then(response => { 
        dispatch({
          type: "SET_PRODUCTS",
          products: products.filter(el => el._id !== id)
        });
      });
  }
const productList = () => {
    return products.map(currentproduct => {
      return <Product product={currentproduct} deleteProduct={deleteProduct} key={currentproduct._id}/>;
    })
  }

//logout func
const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("adminLoggedIn");
    localStorage.setItem("auth-token", "");
    localStorage.setItem("user", "");
    history.push("/admin");
      
  };

if (adminLoggedIn) {
return (
      <div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Admin Area</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="navbar-nav ml-auto">
            <p style={{marginRight: "5px"}}><b>Hello, {user}</b></p>
            <button style={{height: "40%"}} className="btn btn-primary btn-sm" onClick={logout}>Logout</button>
          </div>
              
        </div>
      </nav>
              

        <div style={{margin: "30px auto", width: "75%"}}>
            <h4 style={{clear: "both", float: "left"}}>Product List</h4>
            <Link style={{float: "right"}} className="btn btn-success btn-sm" to={"/products/add"}>Add Product</Link>
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>             
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { productList() }
              </tbody>
            </table>
        </div>
        
      </div>
  );
} else {
  return <Redirect to="/admin" />
}
}

export default Dashboard;
