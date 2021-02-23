import React, { useState } from "react";
import axios from 'axios';
import { Link, Redirect, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import {Image} from 'cloudinary-react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Purchased() {
  const modalId = "#myModal-";
  const m = "myModal-";

  const [{ purchases }, dispatch] = useStateValue();
  const [defaultRating, setRating] = useState(2);
  const customerLoggedIn  = localStorage.getItem("customerLoggedIn");
  const token  = localStorage.getItem("auth-token");

  const submitRating = async (index) => {
    console.log(purchases[index].image);
    console.log(defaultRating);
    const update_obj = {
      image: purchases[index].image,
      rating: defaultRating
    }
    await axios.post('/api/products/update_rating', update_obj, { headers: {"x-auth-token": token} })
            .then(res => {
              console.log(res);
            })

    await axios.post('/api/purchases/update_rating_given', {id: purchases[index]._id}, { headers: {"x-auth-token": token} })
            .then(res => {
              console.log(res);
            })
    window.location.reload(false);
    };

  const productList = () => {
    return purchases.map((currentproduct, index) => {
      return (
                      <tr>
                        <td>
                          <Image
                            style = {{width: "40px"}}
                            cloudName = "dr1xkn8l3"
                            publicId = {currentproduct.image}
                           />
                        </td>
                        <td>{currentproduct.product}</td>
                        <td>{currentproduct.price}</td>
                        <td>{currentproduct.quantity}</td>
                        {currentproduct.date ? (
                          <td>{currentproduct.date}</td>
                                ): (
                          <td>{currentproduct.register_date.substring(0,10)}</td>
                          )}
                        
                        <td>
                        {(currentproduct.ratingGiven == true) ? (
                          <p>Rating submitted</p>
                          ) : (
                          <div>

                          <button type="button" className="btn btn-primary" data-toggle="modal" data-target={modalId.concat(index.toString())}>
                            Give Rating
                          </button>
                          <div className="modal" id={m.concat(index.toString())}>
                            <div className="modal-dialog">
                              <div className="modal-content">

                                
                                <div className="modal-header">
                                  <h4 className="modal-title">Give Rating</h4>
                                  <button type="button" className="close" data-dismiss="modal">×</button>
                                </div>

                                
                                <div className="modal-body">
                                 <Box component="fieldset" mb={3} borderColor="transparent">
                                  <Rating
                                    name="simple-controlled"
                                    value={defaultRating}
                                    onChange={(event, newValue) => {
                                      
                                      setRating(newValue)
                                    }}
                                  />
                                </Box>
                                <button type="button" onClick={() => {submitRating(index)}} className="btn btn-success btn-sm">Submit</button>
                                </div>

                                
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                </div>

                              </div>
                            </div>
                          </div>

                          </div>

                          )}        

                        </td>
                      </tr>
                    );
    })
  }

  if (customerLoggedIn) {
    if (purchases.length < 1) {
      return <p style={{textStyle: "italic", marginTop: "100px", textAlign: "center"}}>You have not purchased any items.</p>
    } else {
      return (
        <div style={{marginTop: "100px"}}>
          <div style={{width: "70%", margin: "0 auto"}}>
                <h4 style={{clear: "both", float: "left"}}>Purchased Items</h4>
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th></th>
                      <th>Title</th>
                      <th>Unit Price (€)</th>
                      <th>Quantity</th>             
                      <th>Date</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    { productList() }
                  </tbody>
                </table>
            </div>
        </div>
      );
    }
} else {
  return <Redirect to="/" />
}
}

export default Purchased;
