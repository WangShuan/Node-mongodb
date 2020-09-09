var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Promise = global.Promise

var Cat = mongoose.model('Cat', { name: String })

var kitty = new Cat({ name: 'Zildjian' })

kitty.save(function(err){
    if(err){
        console.log('err.')
    }else{
        console.log('meow~')
    }
})

