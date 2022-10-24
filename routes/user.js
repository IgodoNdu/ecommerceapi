const User = require('../models/User');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//updating a user (first using the verifyTokenAndAuthorization as a middleware)
router.put('/:id', verifyTokenAndAuthorization, async (req,res)=> {
    //check this user's password (encrypt it)
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_KEY).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            //setting/editing the info for this user, with the new updated details (take everything in the req.body and set it again as the user's details)
            $set: req.body
            //return the updated user with (new:true)
        },{new:true});
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Deleting a user
router.delete('/:id', verifyTokenAndAuthorization, async (req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted!!");
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting a user
router.get('/find/:id', verifyTokenAndAdmin, async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting all users
router.get('/', verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        //const { password, ...others } = user._doc;
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Getting users statistics
router.get('/stats', verifyTokenAndAdmin, async (req,res) => {
    //get today, and last/past 1yr from today
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try {
        //using mongodb aggregate
        const data = await User.aggregate([
            //condition to match (where createdAt date is > lastYear)
            { $match: { createdAt: { $gte: lastYear } } },
            //get the month numbers (get the month no from the createdAt value)
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            //group returned users by the month no
            {
                $group: {
                    _id: "$month",
                    //get total no of users in a grouping
                    total: { $sum: 1 },
                }
            }
        ]);
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json(error);
    }
});
module.exports = router;