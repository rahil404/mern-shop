import React, { useState } from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import ReactTooltip from 'react-tooltip';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function Product({ id, title, image, price, rating }) {
  const [{ basket }, dispatch] = useStateValue();
  const [itemToAdd, setItemToAdd] = useState({});

  let customerLoggedIn  = localStorage.getItem("customerLoggedIn");

  const addToBasket = () => {
    let itemExist = basket.find(x => x.id === id);

    console.log(itemExist);
    if (itemExist) {
      console.log(itemExist);

      //update basket
      dispatch({
        type: "UPDATE_BASKET",
        item: {
          id: id,
          title: title,
          image: image,
          price: price,
          rating: rating,
          quantity: itemExist.quantity+1
        },
      });
    } else {
      // add item to basket
      dispatch({
        type: "ADD_TO_BASKET",
        item: {
          id: id,
          title: title,
          image: image,
          price: price,
          rating: rating,
          quantity: 1
        },
      });
    }
    console.log(basket);
  };

  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        {rating < 1 ? (
            <i>(0 ratings given)</i>
          ) : (
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating name="read-only" value={rating} readOnly />
            </Box>
          )}
        
      </div>
      <img src={image} alt="" />
      {customerLoggedIn ? (
          <button onClick={addToBasket}>Add to Basket</button>
        ) : (
          <span className="d-inline-block" tabindex="0" data-toggle="tooltip" title="Login is required to add items">
            <button style={{pointerEvents: "none"}} type="button" disabled>Add to Basket</button>
          </span>
        )}
    </div>
  );
}

export default Product;
