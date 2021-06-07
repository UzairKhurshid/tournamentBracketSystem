const express=require('express')
const mongoose=require('mongoose')
const User=require('../model/user')
const Tournament=require('../model/tournament')
const router=new express.Router()

router.post('/createTournament',async(req,res)=>{
    try {
        const t=new Tournament(req.body)
        await t.save()
        
        return res.status(200).json({
            msg:'success'
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

router.get('/allTournament',async(req,res)=>{
    try {
        const t=await Tournament.find().populate('events')
        
        return res.status(200).json({
            msg:'success',
            Tournaments:t
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

router.get('/tournament/:id',async(req,res)=>{
    try {
        const tID=req.params.id
        const t=await Tournament.findById({_id:mongoose.Types.ObjectId(tID)}).populate('events')   
        
        
        return res.status(200).json({
            msg:'success',
            Tournament:t
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

module.exports=router