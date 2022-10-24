const Product = require('../models/Product');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATING A PRODUCT
router.post("/", verifyTokenAndAdmin, async (req,res)=>{
    //using the Product Model
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Updating a product
router.put('/:id', verifyTokenAndAdmin, async (req,res)=> {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            //setting/editing the info for this product, with the new updated details (taking everything in the req.body and set it again as the product's details)
            $set: req.body
            //return the updated product with (new:true)
        },{new:true});
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Deleting a Product
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted!!");
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting a Product (Everyone can access products visitors and non-registered users likewise)
router.get('/find/:id', async (req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting all products
router.get('/', async (req,res) => {
    //so i could fetch products by createdAtDate and category
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try {
        let products;
        if(queryNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        }else if(queryCategory) {
            products = await Product.find({
                categories: {
                    $in: [queryCategory],
                },
            });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;