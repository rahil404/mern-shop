import React, { useState } from "react";
import { useStateValue } from "./StateProvider";
import "./Home.css";
import Product from "./Product";
import Carousel from 'react-bootstrap/Carousel';
import { Pagination } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';

function Home(props) {
  // set interval to null of carousel to stop autoplaying
  const [{ products }, dispatch] = useStateValue();
  const [active, setActive] = useState(1);

  function calculate(array) {
    if (array.length < 1) {
      return 0;
    }
    return array.reduce((a, b) => a + b) / array.length;
  }

  const changeActive = (p) => {
    setActive(p);
  }
  const show = () => {
    if (props.products.length > 5) {
    return (  
      <div style={{marginTop: "20px"}} className="d-flex justify-content-center">
        <Pagination>
          {(active != 1) ? (
            <Pagination.Prev onClick={() => changeActive(active-1)} />
          ) : (null)}
          <Pagination.Item active={active === 1} onClick={() => changeActive(1)}>{1}</Pagination.Item>
          <Pagination.Item active={active === 2} onClick={() => changeActive(2)}>{2}</Pagination.Item>
          {((Math.floor(props.products.length/5)+1) == 3) ? (
          <Pagination.Item active={active === 3} onClick={() => changeActive(3)}>{3}</Pagination.Item>
          ) : (null)}
          {(((Math.floor(props.products.length/5)+1) == 2 && active !=2) || ((Math.floor(props.products.length/5)+1) == 3 && active !=3)) ? (
          <Pagination.Next onClick={() => changeActive(active+1)} />
          ) : (null)}
        </Pagination>
      </div>
      );
  } else {
    return null;
  }
  }
  return (
    <div className="home" style={{backgroundColor: "#ebebe0"}}>

      <Carousel interval={4000} style={{marginBottom: "-120px"}}>
        <Carousel.Item>
          <img
            style={{height: "750px"}}
            className="d-block w-100"
            src="https://images.pexels.com/photos/2447042/pexels-photo-2447042.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{height: "750px"}}
            className="d-block w-100"
            src="https://images.pexels.com/photos/6230456/pexels-photo-6230456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            style={{height: "750px"}}
            className="d-block w-100"
            src="https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      {/* Product */}
      <Fade bottom>
      <div className="home__row">
        {products[(5*(active-1))+0] ? (
        <Product
          id="111"
          title={products[(5*(active-1))+0] && products[(5*(active-1))+0].name}
          price={products[(5*(active-1))+0] && products[(5*(active-1))+0].price}
          rating={calculate(products[(5*(active-1))+0].rating)}
          image={products[(5*(active-1))+0] && products[(5*(active-1))+0].image}
        />
        ) : (null)}
        {products[(5*(active-1))+1] ? (
        <Product
          id="222"
          title={products[(5*(active-1))+1] && products[(5*(active-1))+1].name}
          price={products[(5*(active-1))+1] && products[(5*(active-1))+1].price}
          rating={calculate(products[(5*(active-1))+1].rating)}
          image={products[(5*(active-1))+1] && products[(5*(active-1))+1].image}
        />
        ) : (null)}
      </div>
      </Fade>
      <div className="home__row">
        {products[(5*(active-1))+2] ? (
        <Product
          id="333"
          title={products[(5*(active-1))+2] && products[(5*(active-1))+2].name}
          price={products[(5*(active-1))+2] && products[(5*(active-1))+2].price}
          rating={calculate(products[(5*(active-1))+2].rating)}
          image={products[(5*(active-1))+2] && products[(5*(active-1))+2].image}
        />
        ) : (null)}
        {products[(5*(active-1))+3] ? (
        <Product
          id="444"
          title={products[(5*(active-1))+3] && products[(5*(active-1))+3].name}
          price={products[(5*(active-1))+3] && products[(5*(active-1))+3].price}
          rating={calculate(products[(5*(active-1))+3].rating)}
          image={products[(5*(active-1))+3] && products[(5*(active-1))+3].image}
        />
        ) : (null)}
        {products[(5*(active-1))+4] ? (
        <Product
          id="555"
          title={products[(5*(active-1))+4] && products[(5*(active-1))+4].name}
          price={products[(5*(active-1))+4] && products[(5*(active-1))+4].price}
          rating={calculate(products[(5*(active-1))+4].rating)}
          image={products[(5*(active-1))+4] && products[(5*(active-1))+4].image}
        />
        ) : (null)}
      </div>

      {show()}
    </div>
  );
}

export default Home;
