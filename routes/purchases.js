const router = require('express').Router();
let Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');
// User Model
const User = require('../models/User');

// add purchases
router.post('/add', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) throw Error('user not a customer');
    const newPurchase = new Purchase({
      user: req.body.user,
      product: req.body.product,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity
    });
    await newPurchase.save();
    res.json(newPurchase);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//get purchases
router.get('/:email', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.isAdmin) throw Error('user not a customer');
      const purchases = await Purchase.find({user: req.params.email});
      if (!purchases) throw Error('purchases do not exist');
      res.json(purchases);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
});

router.post('/update_rating_given', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.isAdmin) throw Error('user not a customer');
      const purchase = await Purchase.findById(req.body.id);
      if (!purchase) throw Error('purchase do not exist');
      purchase.ratingGiven = true;
      await purchase.save();
      res.json(purchase);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
});

module.exports = router;