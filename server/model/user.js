const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    password:{
        type:String
    },
    tournaments:[{
        type:String,
        ref:'Tournament'
    }]
})
const User=mongoose.model('User',userSchema)
module.exports=User