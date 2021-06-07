const mongoose=require('mongoose')
const tournamentSchema=mongoose.Schema({
    name:{
        type:String
    },
    startDate:{
        type:String
    },
    endDate:{
        type:String
    },
    events:[{
        type:String,
        ref:'Event'
    }]
})
const Tournament=mongoose.model('Tournament',tournamentSchema)
module.exports=Tournament