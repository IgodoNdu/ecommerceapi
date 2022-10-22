const router = require('express').Router();

router.get('/', (req,res)=>{
    res.send('Test routing is working');
});

module.exports = router;