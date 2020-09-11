var express = require('express')

var app = express()

app.use(function(req,res,next){
    res.send('a')
    next()
})

app.use()