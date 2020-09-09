const mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/students')

var stuSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: Number, required: true },
    message: { type: String, required: true }
})

var Student = mongoose.model('Student', stuSchema)



exports.findAll = function (callback) {
    Student.find(function (err, ret) {
        if (err) {
            return callback(err)
        }
        callback(null, ret)
    })
}

exports.findById = function(ID,callback){
    Student.findOne({id:ID},function(err,ret){
        if (err) {
            return callback(err)
        }
        callback(null, ret)
    })
}

exports.save = function(student,callback){
    Student.find(function(err,ret){
        if(err){
            return callback(err)
        }
        var id = parseInt(ret[ret.length - 1].id) + 1
        student.id = id
        var data = new Student(student)
        data.save(function (err) {
            if (err) {
                return callback(err)
            }
            callback(null)
        })
    })
}

exports.updateById = function(student,callback){
    Student.findOneAndUpdate({id:student.id},student,function(err){
        if(err){
            return callback(err)
        }
        callback(null)
    })
}

exports.deleteById = function (ID, callback) {
    Student.findOneAndDelete({id:ID},function(err){
        if (err) {
            return callback(err)
        }
        callback(null)
    })
}
