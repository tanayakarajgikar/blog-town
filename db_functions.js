const blogModel = require('./db_model') ;

blogModel.find({dummyName:"hello"},function(err , data){

    console.log(data) ;

})
