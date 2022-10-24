const Cart = require('../models/Cart');
const Product = require('../models/Cart');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATING A CART (Only users can create a cart)
router.post("/", verifyToken, async (req,res)=>{
    //using the Cart Model
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Updating a Cart
router.put('/:id', verifyTokenAndAuthorization, async (req,res)=> {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            //setting/editing the info for this Cart, with the new updated details (taking everything in the req.body and set it again as the Cart's details)
            $set: req.body
            //return the updated Cart with (new:true)
        },{new:true});
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Deleting a Cart
router.delete('/:id', verifyTokenAndAuthorization, async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted!!");
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting your cart with the userID
router.get('/find/:userId', verifyTokenAndAuthorization, async (req,res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// //Getting all carts of all users (Admin privilege only)
router.get('/', verifyTokenAndAdmin, async (req,res)=>{
    try {
        const allCarts = await Cart.find();
        res.status(200).json(allCarts);
    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports = router;