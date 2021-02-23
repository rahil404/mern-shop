import React, { useState, useEffect } from "react";
import { Link, useHistory, Redirect, useLocation, useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';

function EditProduct () {
      const params = useParams();
      console.log(params);
      // console.log(history);

      const history = useHistory();
      let location = useLocation();
      console.log(location);
      const [{ products }, dispatch] = useStateValue();

      let user  = localStorage.getItem("user");
      const adminLoggedIn  = localStorage.getItem("adminLoggedIn");
      const token  = localStorage.getItem("auth-token");
      
      const [name, setName] = useState(location.state.name);
      const [price, setPrice] = useState(location.state.price);
      const [desc, setDesc] = useState(location.state.desc);
      const [img, setImg] = useState("");
      const [show, setShow] = useState(false);

const update = async (event) => {
    event.preventDefault();
    // if image need not be updated
    const product = {
        name: name,
        price: price,
        desc: desc
      }

  if (img != "") {
    const formData = new FormData();
    formData.append("file", img);
    formData.append("upload_preset", "jngmzxpk");

    // upload image
    await axios.post(
      'https://api.cloudinary.com/v1_1/dr1xkn8l3/image/upload', 
      formData).then( async (res) => {
      console.log(res.data.secure_url);

      const product = {
        name: name,
        price: price,
        desc: desc,
        image: res.data.secure_url
      }

      await axios.post('/api/products/update/'+params.id, product, { headers: {"x-auth-token": token} })
      .then(async (res) => {
        console.log(res.data);

        const pRes = await axios.get('/api/products');
        console.log(pRes.data);
        dispatch({
          type: "SET_PRODUCTS",
          products: pRes.data
        });
      })
    });
  } else {
    await axios.post('/api/products/update/'+params.id, product, { headers: {"x-auth-token": token} })
      .then(async (res) => {
        console.log(res.data);
// alert("Product Updated!");
setShow(true);
        const pRes = await axios.get('/api/products');
        console.log(pRes.data);
        dispatch({
          type: "SET_PRODUCTS",
          products: pRes.data
        });
      })
  }
    
    // alert(product.name);
console.log(product);
// console.log("token before login", token);
    
  };

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
      <Link to="/admin">
        <a className="navbar-brand" href="#">Admin Area</a>
      </Link>
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

      
      <div style={{margin: "30px auto", width: "40%"}}>

{show ? (
<Alert onClose={() => setShow(false)}>Product updated!</Alert>
  ) : (null)}

        <h4 style={{textAlign: "center"}}>Edit Product</h4>
        <form style={{backgroundColor: "lightgrey"}} className="rounded p-3" onSubmit={update}>
        <div className="form-group">
            <h5>Name</h5>
          <input
            required
            className="form-control"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
          
          <div className="form-group">
              <h5>Price</h5>
                <input
                required
                className="form-control"
                  type="number"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
        </div>
          
          <div className="form-group">
              <h5>Description</h5>
                <textarea required className="form-control" rows="4" cols="50" value={desc} onChange={(event) => setDesc(event.target.value)}>           
                </textarea>
        </div>
          
        <div className="form-group">
              <h5>Image</h5>
                <input
                
                className="form-control"
                  type="file"
                  
                  onChange={(event) => setImg(event.target.files[0])}
                />
        </div>

          <button style={{clear: "both"}} type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
        <Link style={{float: "right", marginTop:"10px"}} className="btn btn-link" to={"/dashboard"}>Go Back</Link>
      </div>
</div>
  );
} else {
  return <Redirect to="/admin" />
  
}

  
}

export default EditProduct;
