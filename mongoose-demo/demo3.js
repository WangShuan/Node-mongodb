var fs = require('fs')

var p1 = new Promise(function (resolve, reject) {
    fs.readFile('./demo3-1.txt', 'utf8', function (err, data) {
        if (err) {
            reject(err)
        }
        resolve(data)
    })
})

var p2 = new Promise(function (resolve, reject) {
    fs.readFile('./demo3-2.txt', 'utf8', function (err, data) {
        if (err) {
            reject(err)
        }
        resolve(data)
    })
})

p1
    .then(function (data) {
        console.log(data)
        return p2
    }, function (err) {
        comsole.log(err)
    })
    .then(function (data) {
        console.log(data)
    }, function (err) {
        comsole.log(err)
    })