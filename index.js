const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const testRoute = require('./routes/user')
const authRoute = require('./routes/auth');

dotenv.config();

//connecting to my MongoDB Server
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('DB Connect is a success'))
.catch((err)=>{console.log(err)});

//enable json
app.use(express.json());
//middleware for routes
app.use('/api/auth', authRoute);
app.use('/user', testRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Hello I am listening!!");
});