const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
//const stripeRoute = require('./routes/stripe');

dotenv.config();

//connecting to my MongoDB Server
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('DB Connect is a success'))
.catch((err)=>{console.log(err)});

//enable json
app.use(express.json());
//middleware for routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);
//app.use('/api/payment', stripeRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Hello I am listening!!");
});