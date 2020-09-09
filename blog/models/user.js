var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog')

var Schema = mongoose.Schema

var userSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    // bio:{
    //     type:String,
    //     default:''
    // },
    // gender:{
    //     type:Number,
    //     enum:[-1,0,1],
    //     default:-1
    // },
    // birthday:{
    //     type:Date,
    //     default:''
    // },
    // photo:{
    //     type:String,
    //     default:'/public/img/avatar-default.png'
    // },
    // created_time: {
    //     type:Date,
    //     default:Date.now
    // },
    // last_edit_time:{
    //     type:Date,
    //     default:Date.now
    // },
    // status:{
    //     type:Number,
    //     enum:[0,1,2],
    //     default:0
    // }
})

var User = mongoose.model('User', userSchema)

module.exports = User