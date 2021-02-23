const router = require('express').Router();
let Product = require('../models/Product');
const auth = require('../middleware/auth');
// User Model
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) throw Error('products do not exist');
    res.json(products);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) throw Error('user not an admin');
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      desc: req.body.desc,
      image: req.body.image,
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

//update rating
router.post('/update_rating', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.isAdmin) throw Error('user not a customer');
      const product = await Product.find({image: req.body.image});
      if (!product) throw Error('product do not exist');
      product[0].rating.push(req.body.rating);
      await product[0].save();
      res.json(product[0]);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
});

// route to get by id
router.route('/:id').get((req, res) => {
    Product.findById(req.params.id)
      .then(product => res.json(product))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) throw Error('user not an admin');
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw Error('product does not exist');
    res.json('Product deleted.');
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post('/update/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) throw Error('user not an admin');
    const product = await Product.findById(req.params.id);
    if (!product) throw Error('Product does not exist');

    product.name = req.body.name;
    product.price = req.body.price;
    product.desc = req.body.desc;

    if (req.body.image) {
      product.image = req.body.image;
    }

    await product.save();
    res.json('Product updated!');
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;