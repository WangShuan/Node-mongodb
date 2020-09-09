var express = require('express')
var bodyParser = require('body-parser')
var router = require('./router')
var app = express()

app.use('/node_modules/', express.static('./node_modules/'))
app.use('/public/', express.static('./public/'))

app.engine('html', require('express-art-template'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router)

app.listen(8723, function () {
    console.log('server is running ....')
})