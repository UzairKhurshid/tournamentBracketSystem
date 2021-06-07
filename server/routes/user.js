const express=require('express')
const mongoose=require('mongoose')
const User=require('../model/user')
const router=new express.Router()


router.get('/',async(req,res)=>{
    try {
        return res.render('index',{
            msg:"some msg from server"
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})



router.post('/createUser',async(req,res)=>{
    try {
        const user=new User(req.body)
        await user.save()
        
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

router.get('/allUser',async(req,res)=>{
    try {
        const users=await User.find()
        
        return res.status(200).json({
            msg:'success',
            users:users
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

router.get('/user/:id',async(req,res)=>{
    try {
        const userID=req.params.id
        const user=await User.findById({_id:mongoose.Types.ObjectId(userID)})   
        
        
        return res.status(200).json({
            msg:'success',
            user:user
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

module.exports=router