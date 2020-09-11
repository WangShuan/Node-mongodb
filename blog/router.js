var express = require('express')

var router = express.Router()

var md5 = require('blueimp-md5')

var User = require('./models/user.js')

var mongoose = require('mongoose')

var loginUser = ''

mongoose.connect('mongodb://localhost/blog')

router.get('/', function (req, res) {
    res.render('index.html', { user: loginUser })
})

router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res,next) {
    User.findOne({ email: req.body.email , password: md5(md5(req.body.password)) }, function (err, user) {
        if (err) {
            return next(err)
        }
        if (ret === 'null') {
            return res.status(200).json({
                err_code: 1
            })
        }

        loginUser = user
        res.status(200).json({
            err_code: 0
        })
    })
})

router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register', function (req, res,next) {
    User.findOne({ $or: [{ email: req.body.email }, { nickname: req.body.nickname }] }, function (err, ret) {
        if (err) {
            return next(err)
        }
        if (ret) {
            return res.status(200).json({
                err_code: 1
            })
        }

        req.body.password = md5(md5(req.body.password))

        new User(req.body).save(function (err, user) {
            if (err) {
                return next(err)
            }
            loginUser = user
            res.status(200).json({
                err_code: 0
            })
        })
    })
})

router.get('/logout', function (req, res) {
    loginUser = ''
    res.redirect('/')
})

module.exports = router