var express = require('express')
var path = require('path')
var router = require('./router.js')

var app = express()

app.use('/public/', express.static(path.join(__dirname, '/public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html',require('express-art-template'))

app.use(router)

app.listen(8723, function () {
    console.log('running......')
})
