const mongoose = require('./db_connection');

const Schema = mongoose.Schema ;

const blogSchema = new Schema({
 
    thumbnail : String ,
    title : String ,
    content : String ,
    category : String ,
    author : String ,
    date : {
        type : Date ,
        default : Date.now
    } ,
    likes : Number ,

})
var blogModel  = mongoose.model('blog_dummy' , blogSchema) ;

var blog = new blogModel({

    thumbnail : "1.jpg" ,
    title : "Cricket" ,
    content : "abc" ,   
    author : "xyz" ,
    date : Date() ,
    likes : 2 ,
})

 

module.exports = blogModel ;


