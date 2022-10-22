// handle registration and login activities
const router = require('express').Router();
const User = require('../models/User');
//encrypting user submitted password
const CryptoJS = require('crypto-js');
//securing with jwt
const jwt = require('jsonwebtoken');

//REgistering a user
router.post('/register', async (req,res)=>{
    if(req.body){
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_KEY).toString(),
        });
    
        //saving to DB
        try {
            const savedUser = await newUser.save();
            //checks
            console.log(savedUser);
            res.status(201).json(savedUser);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }else{
        res.status(401).json("Please fill the form details");
    }
});

//Handle User Login
router.post('/login', async (req,res)=>{
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json('Wrong details');
        //decrypt the password in file for comparison
        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_KEY);
        const dbpassword = hashedPass.toString(CryptoJS.enc.Utf8);
        //now compare with user submitted password
        dbpassword !== req.body.password && res.status(401).json('Wroong details!!!');

        //securing with JWT: (sign on user._id and user.isAdmin props)
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            //expiration tenure, after which user login is required
            {expiresIn:'2d'}
        )

        //if everything's okay, send back everything excluding the password (maka security)
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
        console.log('hello!!')
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;