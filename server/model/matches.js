const mongoose=require('mongoose')
const matchesSchema=mongoose.Schema({
    eventID:{
        type:String,
        ref:'Event'
    },
    matches:[{
        player1ID:{
            type:String,
            ref:'User'
        },
        player2ID:{
            type:String,
            ref:'User'
        },
        player1Score:{
            type:Number
        },
        player2Score:{
            type:Number
        },
        round:{
            type:Number
        },
        matchNo:{
            type:Number,
            default:0
        }
    }]
})
const Matches=mongoose.model('Matches',matchesSchema)
module.exports=Matches