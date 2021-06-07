const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/tournament', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
    console.log('Successfully connected to database')
}).catch(()=>{
    console.log('Error connecting database')
});