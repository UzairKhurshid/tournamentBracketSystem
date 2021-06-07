require('./db/db')
const express=require('express')
const bodyParser=require('body-parser')
const handlebars = require('hbs');
var cors = require('cors')
const path=require('path')

const app=express()

const publicDirectory = path.join(__dirname, '../public')

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(publicDirectory))

const viewsDirectory = path.join(__dirname, '../views')
app.set('views', viewsDirectory)
app.set('view engine', 'hbs')

const userRoute=require('./routes/user')
const tournamentRoute=require('./routes/tournament')
const eventRoute=require('./routes/event')

app.use(userRoute)
app.use(tournamentRoute)
app.use(eventRoute)

app.listen(3000,()=>{
    console.log('server is up and running on port 3000')
})