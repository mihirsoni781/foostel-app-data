const express = require('express');
const bodyParser = require('body-parser');
const app = new express()
const api = require('./server/api');
const cors = require('cors');
const path = require('path');
const methodOverrride = require('method-override');
console.log('starting server'); 

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api',api);
app.use(express.static(path.join(__dirname,'dist')));
app.use(methodOverrride('_method'));
const port = process.env.PORT || 3000;

 app.get('*',function(req,res){
     res.sendFile(path.join(__dirname,'./dist/index.html'));
 })

app.listen(port,'0.0.0.0', function (success, err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log("server running")
    }
})