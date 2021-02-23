import React from "react";
import "./CheckoutProduct.css";
import { useStateValue } from "./StateProvider";
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function CheckoutProduct({ id, title, image, price, rating, quantity }) {
  const [{ basket }, dispatch] = useStateValue();

  const removeFromBasket = () => {
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };

  const incremented = () => {
    //update basket
    dispatch({
      type: "UPDATE_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
        quantity: quantity+1
      },
    });
  };

  const decremented = () => {
    //update basket
    dispatch({
      type: "UPDATE_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
        quantity: quantity-1
      },
    });
  };

  return (
    <div className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt="" />

      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">{title}</p>

        

        {rating < 1 ? (
            <i>(0 ratings given)</i>
          ) : (
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating name="read-only" value={rating} readOnly />
            </Box>
          )}

        <p className="checkoutProduct__price">
          <small>$</small>
          <strong>{price} </strong>
          | Qty: <span className="badge badge-dark">{quantity}</span>&nbsp;
          <button onClick={incremented} style={{border: "1px solid lightgrey"}} className="btn btn-sm">+</button>&nbsp;
          <button onClick={decremented} style={{border: "1px solid lightgrey"}} className="btn btn-sm">-</button>
        </p>

        <p></p>

        <button onClick={removeFromBasket}>Remove from Basket</button>
      </div>
    </div>
  );
}

export default CheckoutProduct;
