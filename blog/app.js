var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router.js')
const User = require('./models/user.js')

var app = express()

app.use('/public/', express.static(path.join(__dirname, '/public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('html',require('express-art-template'))

app.use(router)

app.use(function(req,res){
    res.render('404.html')
})

app.use(function(err,req,res,next){
    return res.status(500).json({
        err_code: 500,
        message:err.message
    })
})

app.listen(8723, function () {
    console.log('running......')
})
