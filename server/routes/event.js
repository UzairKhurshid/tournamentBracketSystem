const express=require('express')
const mongoose=require('mongoose')
const User=require('../model/user')
const Tournament=require('../model/tournament')
const Event=require('../model/event')
const Matches=require('../model/matches')
const router=new express.Router()

router.post('/createEvent',async(req,res)=>{
    try {
        const e=new Event(req.body)
        await e.save()

        let t=await Tournament.findById({_id:mongoose.Types.ObjectId(req.body.tournamentID)})
        let tEvents=t.events
        tEvents.push(e._id)
        t.events=tEvents
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

router.get('/allEvent',async(req,res)=>{
    try {
        const e=await Event.find()
        
        return res.status(200).json({
            msg:'success',
            events:e
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

router.get('/event/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)})   
        
        
        return res.status(200).json({
            msg:'success',
            event:e
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})


router.post('/registerPlayer/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)})
        
        let arr=e.registeredPlayer
        arr.push(req.body.userID)
        e.registeredPlayer=arr
        await e.save()

        let t=await Tournament.find()
        for(let iterator of t){
            let arr=iterator.events
            if(arr){
                for(let iterator2 of arr){
                    if(iterator2 == eID){
                        let user=await User.findById({_id:mongoose.Types.ObjectId(req.body.userID)})
                        let uT=user.tournaments
                        uT.push(iterator._id)
                        user.tournaments=uT
                        await user.save()
                    }
                }
            }
        }

        
           
        return res.status(200).json({
            msg:'success',
            event:e
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})


router.get('/allRegisteredPlayers/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)}).populate('registeredPlayer')
        
           
        return res.status(200).json({
            msg:'success',
            event:e
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})




router.post('/addBracket/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)}).populate('registeredPlayer')
        let arr=e.bracket
        let obj=req.body
        obj.players=e.registeredPlayer
        arr.push(obj)
        e.bracket=arr
        await e.save()
           
        return res.status(200).json({
            msg:'success',
            event:e
        })
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})



router.post('/checkForMatch/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        const bracketID=req.body.bracketID

        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)}).populate('registeredPlayer')
        let brackets=e.bracket
        for(let i of brackets){
           if(i._id == bracketID){
               console.log(i.bracketName)
               let matches=i.matches
               if(!matches){
                    let m=new Matches()
                    await m.save()
                    i.matches=m._id
                    e.bracket=brackets
                    await e.save() 
                    return res.status(200).json({
                        msg:'success',
                        event:e
                    })
               }else{
                    let m = await Matches.findById({_id:mongoose.Types.ObjectId(i.matches)})
                    return res.status(200).json({
                        msg:'success',
                        event:e
                    })
               }
           } 
        }
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})


router.get('/participants/:id',async(req,res)=>{
    try {
        return res.render('participants')
    } catch (err) { 
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})


router.get('/AJAXparticipants/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)}).populate('registeredPlayer')
        let m=await Matches.findOne({eventID:eID})
        
        let players=e.registeredPlayer
        let matches=m.matches
        
        let nameArr=[]

        //nameArr
        for(let [i,iterator] of players.entries()){
            nameArr.push(iterator.username)
        }
        if(nameArr.length % 2 != 0){
            throw new Error("Participants are not even!")
        }

        let len=nameArr.length
        let temp=[];
        for(let i=0;i<len;i++){
            let temp2=[]
            temp2.push(nameArr[i])
            temp2.push(nameArr[i+1])
            temp.push(temp2)
            i=i+1;
        }
        return res.json({
                nameArr:nameArr,
                matches:matches
        })

    } catch (err) { 
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})


router.post('/match/:id',async(req,res)=>{
    try {
        const eID=req.params.id
        let player1=req.body.player1
        let player2=req.body.player2
        let player1Score=req.body.player1Score
        let player2Score=req.body.player2Score
        let round=req.body.round

        const e=await Event.findById({_id:mongoose.Types.ObjectId(eID)}).populate('registeredPlayer')
        let players=e.registeredPlayer

        let player1ID;
        let player2ID;
        for(let [i,iterator] of players.entries()){
            if(iterator.username == player1){
                player1ID=iterator._id
            }
            if(iterator.username == player2){
                player2ID=iterator._id
            }
        }

        let matches=await Matches.find()
        let match;
        for (const iterator of matches) {
            if(iterator.eventID == eID){
                match=iterator
            }
        }
        if(!match){
            let m = new Matches()
            m.eventID=eID
            let mArr=m.matches
            let obj={
                player1ID:player1ID,
                player2ID:player2ID,
                player1Score:player1Score,
                player2Score:player2Score,
                matchNo:0,
                round:1
            }
            mArr.push(obj)
            m.matches=mArr
            await m.save()
            return res.status(200).json({
                msg:'success'
            })
        }else{
            let mArr=match.matches
            let len=mArr.length
            let obj={
                player1ID:player1ID,
                player2ID:player2ID,
                player1Score:player1Score,
                player2Score:player2Score,
                matchNo:len,
                round:round
            }
            mArr.push(obj)
            match.matches=mArr
            await match.save()
            return res.status(200).json({
                msg:'success'
            })
        }
    } catch (err) {
        return res.status(500).json({
            msg:"error",
            error:err.message
        })
    }
})

module.exports=router