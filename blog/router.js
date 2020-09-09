const express = require('express');
var router = express.Router()

router.get('/',function(req,res){
    res.render('index.html')
})

router.get('/login',function(req,res){
    res.render('login.html')
})

router.get('/register', function (req, res) {
    res.render('register.html')
})

module.exports = router