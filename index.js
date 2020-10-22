var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false   }));
app.use(bodyParser.json());
var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"tdblogs"
});

con.connect((err) => {
    if(err) throw err;
    console.log('connected');
})

app.get("/show_blogs",(req,res)=>{
    var sql = 'SELECT blogs.id, blogs.title, blogs.description, blogs.link, blogs.auth_id, author.name, author.photo, author.bio, author.linkedIn FROM author, blogs WHERE author.auth_id=blogs.auth_id;';
    con.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                success:false,
                status:400
            })
        }
        else{
            console.log(result);
            res.json(result)
        }
    })
})

app.post("/search",(req,res)=>{
    var term = req.body.term;

    var sql= 'SELECT blogs.id, blogs.title, blogs.description, blogs.link, blogs.auth_id, author.name, author.photo, author.bio, author.linkedIn FROM author, blogs WHERE author.auth_id=blogs.auth_id AND CONCAT(title,description) LIKE ("%'+term+'%")';
    

 
    con.query(sql,(err,result)=>{
      
        if(err){
            console.log(err);
            
            res.json({
                success:false,
                status:400
            })
        }
        else{
            res.json(result)

            console.log(result);
        }
        
})
})

app.get("/show_tags",(req,res)=>{
    var sql = 'select * from tags';
    con.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.json({
                success:false,
                status:400
            })
        }
        else{
            console.log(result);
            res.json(result)
        }
    })
})

app.post("/contact_us",(req,res)=>{
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    //console.log(body);
    var sql= 'INSERT INTO contact (name,email,message) VALUES ("'+name+'","'+email+'","'+message+'");';
    
 
    con.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                status: 400
            })
        }
        else {
            res.json({
                success: true,
                status: 200
            })
            console.log("uploaded");
        }
    })
})

app.listen(process.env.PORT||8000);