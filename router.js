const express = require("express");
const { functions } = require("underscore");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path') ;
const multer = require('multer');
var router = express.Router();
const blogModel = require('./db_model')
var data = require('./data') ;
var blogSchema = new mongoose.Schema({

  thumbnail : String ,
  title : String ,
  content : String ,
  category : String ,
  author : String ,
  date : Date,
  likes : Number ,

})  


var post = {} ;
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
      console.log(file);
      cb(null, "kel"+Date.now() + path.extname(file.originalname));
  }
});
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
//       cb(null, true);
//   } else {
//       cb(null, false);
//   }
// }
const upload = multer({
   storage: storage,
   limits : {fileSize : 1000*1024*5} ,
   fileFilter : function(req , file , cb){
     
      checkFileType(file , cb) ;

   }
  }).single('thumbnail_file');

const json = JSON.parse(fs.readFileSync('./data.json', 'utf8'));



function checkFileType(file , cb){

  const fileType = /jpeg|jpg|png/ ;
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype) ;

  if(extname && mimetype)
      cb(null , true) ;
  else  
      cb('error : i want image oly') ;

}


router.get('/temp' , function(req ,res){
  res.sendFile(__dirname+"/temp.html") ;
})


router.get("/", async function (req, res) {
   
  
  blogModel.find({}).sort('-date').lean().exec(function(err , data){

      if(!err){
        var post = data ;
        
        blogModel.find().distinct('category').lean().exec(function(err , data){

          if(!err){
            var categoryList = data ;
               
              res.render('home',{posts : post , categoryList : categoryList});
  
            }
        })

      }
  });
  
})


router.get("/login", function (req, res) {
  res.render("login", { isLogin: true });
});

router.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var isExists = true;
  var User = {};
  //match with database

  if (isExists) {
    User.username = "Rushikesh";
    User.password = "NoPassword";
    data.user = User;
    res.redirect("/");
  } else {
  }
});

router.get("/upload", function (req, res) {

  res.render("upload");
});


// router.post('/upload',  (req, res) => {
 
//     upload(req , res , (err)=>{
//       if(err)
//         res.send(err) ;
//       else  
//         res.send(req.file.filename) ;
//     })
// });

 
router.post('/upload',function(req , res){

    console.log(req.body) ;  

    if(!req.body.thumbnail){

    upload(req , res , (err)=>{

    if(err)
      res.render('upload' , { errors : err})
    else  {
        res.render('upload' , {filename : req.file.filename})
      }
      
    })
  }
  else{


          let errors = [] ;
           
          if(req.body.title == "")
            errors.push("enter the title") ;
          if(req.body.content == "")
            errors.push("enter the content") ;
          if(req.body.author == "")
            errors.push("enter the author")
          if(req.body.category == "")
            errors.push("enter the author")

        if(errors.length)
           res.render('upload' , {filename : req.body.thumbnail , errors : errors})
        
        else{
          console.log("towards post");
          data = new blogModel({

              thumbnail : req.body.thumbnail ,
              title : req.body.title ,
              content : req.body.content ,
              category : req.body.category ,
              author : req.body.author ,
              date : new Date() ,
              likes : 0             

          })
          data.save(function (err, doc) {
            if (err) console.log("error while inserting");
            else {
    
                res.redirect('/');
            }
            
          });

        }
          
      }

  }
,)


router.get('/display-article' , function(req , res){

  let id = req.query.id ;
  blogModel.find({_id:id}).sort('-date').lean().exec(function(err , data){

    if(err)
      throw err ;
     res.render('display-post',{post : data }) ;
  });
  // res.send(id) ;
  // res.render('display-post',{post : data }) ;

})




router.get('/catagory' , function(req , res){

  let category = req.query.cat ;
  blogModel.find({category:category}).sort('-date').lean().exec(function(err , data){

    if(err)
      throw err ; 
    if(data.length == 0)
      res.render('category' , {error : true});
    res.render('category' , {category : category , post : data}) ;
  });

  
router.get('/login' , function(req , res){
    res.render('login' , {error : true});
  });

  
  router.post("/login", function (req, res) {
    
  });
  

})
router.get('/register' , function(req , res){
  res.render('register' , {error : true});
});


router.post("/register", function (req, res) {
  
});



 
module.exports = router;


