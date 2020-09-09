var mongoose = require('mongoose')

var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/users')

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})

var User = mongoose.model('User', userSchema)


// 新增第一條數據
// var john = new User({ username: "john", password: "123456", email: "john@kimo.com" })

// john.save(function (err, ret) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('保存成功，數據為：' + ret)
//     }
// })

// 新增第二條數據
// var cc = new User({ username: "cc", password: "123456", email: "cc@kimo.com" })

// cc.save(function (err, ret) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('保存成功，數據為：' + ret)
//     }
// })


// 查詢所有數據
// User.find(function (err, ret) {
//     if (err) {
//         console.log('查詢失敗')
//     } else {
//         console.log(ret)
//     }
// })



// 查詢所有符合條件的數據
// User.find({ password: '123456' }, function (err, ret) {
//     if (err) {
//         console.log('查詢失敗')
//     } else {
//         console.log(ret)
//     }
// })


//按條件查詢單個數據
// User.findOne({username:'cc'},function(err,ret){
//     if(err){
//         console.log('查詢失敗')
//     }else{
//         console.log(ret)
//     }
// })


// 刪除數據
// User.remove({username:'cc'},function(err){
//     if(err){
//         console.log('刪除失敗')
//     }
// })


// 利用id查找並更新數據
// User.findByIdAndUpdate('5f56364b347a37069f9e44e3',{email:'johnnn@test.com'},function(err,ret){
//     if(err){
//         console.log('更新失敗')
//     }else(
//         console.log(ret)
//     )
// })
