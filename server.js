// Imports
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_51I8YnYKYfFgj9AHVPaDHhGSu9ioFGzX1sPsrtJD5o87SGOu9jw1HoD8qsT13L4F2HLImbvrhuLwtDECd43HRCWRX00hQeCU0gW');

// Get environment
require('dotenv').config();

// Create express web app, specify port
const app = express();
const port = process.env.PORT || 5000;

// Necessary specifications for functioning
app.use(cors());
app.use(express.json());

// Connect to DB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// API routes
// !!! Always put api routes before frontend routes !!!
const userRouter = require('./routes/users')
app.use('/api/users', userRouter)
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/purchases', require('./routes/purchases'))
app.post('/api/pay', async (req, res) => {

  await stripe.paymentIntents.create({
    amount: 1900,
    currency: 'eur',
    payment_method_types: ['card'],
  metadata: {
    order_id: '6735',
  },
  }).then(res => {
res.json({'client_secret': paymentIntent['client_secret']})
  })
  .catch(err => {
    res.json({ msg: err }); 
  });
})

// Handler for client build
if (process.env.NODE_ENV === 'production') {  
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get("/*", (_, res) => {
     res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}


// Start app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});