const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const connection=require("./config/db");
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+"/views"));
app.use(express.static(__dirname+"/public"));

app.post("/result",(req,res)=>{
    const name=req.body.name;
    const roll=req.body.roll; 
     try{
    connection.query("select * from db_student where name=? and roll=?",[name,roll],(err,eachRow)=>{
        if(err){
            console.log("error inside result");
        }
         else{
             if(eachRow==''){
                result=JSON.stringify('{}');
                flag=false;
                res.render("StudentResult.ejs",{result,flag});
             }
             else{
                result=JSON.parse(JSON.stringify(eachRow[0]));
                flag=true;
               res.render("StudentResult.ejs",{result,flag});                
             }
         
         }
    });
    
  }
    catch(err)
    {
console.log(err);
    }
});

app.get("/",(req,res)=>{
    res.redirect("/home.html");
    });
    app.get("/student",(req,res)=>{
        connection.query("select * from db_student",(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("Teacher.ejs",{rows});
        }
        });
        });
        app.get("/Search",(req,res)=>{
            res.render("Search.ejs",{});
       
            });
    

        app.get("/delete-student",(req,res)=>{
            const deleteQuery="delete from db_student where id=?";
            connection.query(deleteQuery,[req.query.id],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/student");
        }
            });
        });

        app.get("/update-student",(req,res)=>{
            connection.query("select * from db_student where id= ?",[req.query.id],(err,eachRow)=>{
                if(err){
                    console.log("error inside update");
                }
                else{
                    result=JSON.parse(JSON.stringify(eachRow[0]));
                    console.log(result);
                    res.render("Update.ejs",{result});
                }
            });
            
            });
    
        app.post("/home",(req,res)=>{
            const name=req.body.name;
            const roll=req.body.roll;
            const dob=req.body.dob;
            const score=req.body.score;
            try{
        
        connection.query ("INSERT into db_student(name,roll,dob,score) values(?,?,?,?)", 
        [name, roll,dob,score],(err, rows)=> {
          if (err) {
            console.log(err);
          } else {

            res.redirect("/student");
          }
        }
        );
            }
            catch(err)
            {
        console.log(err);
            }
        });

        app.post("/final-update",(req,res)=>{
            const id=req.body.hiddenId;
            const name=req.body.name;
            const roll=req.body.roll;
            const dob=req.body.dob;
            const score=req.body.score;
            const queryUpdate="update db_student set name=?,roll=?,dob=?,score=? where id=?";
            try{
        
        connection.query (queryUpdate, [name, roll,dob,score,id],(err, rows)=> {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/student");
          }
        }
        );
            }
            catch(err)
            {
        console.log(err);
            }
        });
    app.listen(process.env.PORT||5000,(error)=>{

        if(error) throw error;
        console.log(`Server runs on stytem port ${process.env.PORT}`);
    });
    