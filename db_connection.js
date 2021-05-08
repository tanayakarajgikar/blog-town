const mongoose = require('mongoose') ;
const URL = "mongodb://localhost:27017/blog"
mongoose.connect(URL,{useNewUrlParser : true}) ;

const db = mongoose.connection ;
db.on("err" , () => {
  console.log("something wrong while connecting to db") ;
})

db.once("open" , ()=>{

  console.log("connected successfully") ;
})

module.exports = mongoose ;