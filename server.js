const express = require("express") ;
const app = express() ;
const port = process.env.PORT || 8000 ;

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(function(req,res,next){
    console.log(`${new Date()} - ${req.method} request for ${req.url}`) ;
    next() ;
}) ;


app.use(express.static("static")) ;


app.listen(port,() => {
    console.log(`listening to the port at ${port} `)
}) ;