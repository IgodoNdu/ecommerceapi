const Order = require('../models/Order');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATING An Order (Only users can create an order)
router.post("/", verifyToken, async (req,res)=>{
    //using the Cart Model
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
})

//Updating an Order (Admin privilege only)
router.put('/:id', verifyTokenAndAdmin, async (req,res)=> {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            //setting/editing the info for this Order, with the new updated details (taking everything in the req.body and set it again as the Order's details)
            $set: req.body
            //return the updated Order with (new:true)
        },{new:true});
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Deleting an Order
router.delete('/:id', verifyTokenAndAdmin, async (req,res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted!!");
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting user's order via user's ID
router.get('/find/:userId', verifyTokenAndAuthorization, async (req,res) => {
    try {
        //since a user can have more than 1 order
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting all orders of all users (Admin privilege only)
router.get('/', verifyTokenAndAdmin, async (req,res)=>{
    try {
        const allOrders = await Order.find();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json(error)
    }
});

//STATS: MONTHLY INFLOW
router.get('/', verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));

    //aggregate the data
    try {
        const inflow = await Order.aggregate([
            //condition to match: where createdAtDate is > previous month
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "createdAt" },
                    sales: "$amount",
                },
            },
            //group by month and sum all the sales and pass to total
            {
                $group:{
                    _id:"$month",
                    total:{$sum: "$sales"}
                },
            },
        ]);
        res.status(200).json(inflow);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;