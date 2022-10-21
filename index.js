const express = require('express');
const app = express();
const mongoose = require('mongoose');

//connecting to my MongoDB Server
mongoose.connect('mongodb+srv://learning:Learning01@cluster0.4k9ccvn.mongodb.net/afiaohuru?retryWrites=true&w=majority')
.then(()=> console.log('DB Connect is a success'))
.catch((err)=>{console.log(err)});

app.listen(5000, () => {
    console.log("Hello I am listening!!");
})