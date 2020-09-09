var express = require('express')
var router = express.Router()

var Students = require('./students')

router.get('/students', function (req, res) {
    Students.findAll(function (err, students) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', { students: students })
    })
})

router.get('/students/new', function (req, res) {
    res.render('new.html')
})

router.post('/students/new', function (req, res) {
    Students.save(req.body, function (err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students')
    })
})

router.get('/students/edit', function (req, res) {
    Students.findById(req.query.id, function (err, student) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('edit.html', { student: student })
    })
})

router.post('/students/edit', function (req, res) {
    Students.updateById(req.body, function (err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students')
    })
})

router.get('/students/delete', function (req, res) {
    Students.deleteById(req.query.id, function (err) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.redirect('/students')
    })
})

module.exports = router
