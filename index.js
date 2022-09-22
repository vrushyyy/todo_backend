const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors ());

const mysql = require ('mysql');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'my_todo'
})

connection.connect(err => {
    if(err){
        console.log(err);
    } else {
        console.log("Database Connected");
    }
})

app.get('/', (req, res)  =>{
    res.send('hi');
})

app.get('/get_all', (req, res) => {
    const query = "SELECT * FROM tasks";
    connection.query(query, (err, result)  => {
        if(err) {
            console.log(err);
            res.status(500).send({
                success: false,
                msg : "Server error",
                data: []
            })
        } else {
            res.send({
              success : true,
              msg : 'Success',
              data : result
            })
        }
    })
})

app.post('/add_todo', (req, res) => {
    const task = req.body.task;
    const query = "INSERT INTO tasks (task)  VALUES (?)";
    connection.query(query, [task], (err, result)  => {
        if(err) {
            res.status(500).send({
                success: false,
                msg: "server error",
                data: []
            });
        } else{
           res.status(201).send({
             success: true,
             msg:"Success",
             data:result.insertId
           })
        }
    });
})



app.put('/update_todo/:id', (req, res) => {
     const id = req.params.id;
     const task = req.body.task;
     const query = "UPDATE tasks SET task = ? WHERE id = ?";
     connection.query(query, [task, id], (err, result) => {
        if(err){
            res.status(500).send({
                success : false,
                msg : "Server error",
                data:[]
            });
        } else{
            res.status(201).send({
                success: true,
                msg:"success",
                data: result.affectedRows
            })
        }
     })

}) 


app.put('/done_todo/:id', (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    const query = "UPDATE tasks SET done = ? WHERE id = ?";
    connection.query(query, [status, id], (err, result) => {
       if(err){
           res.status(500).send({
               success : false,
               msg : "Server error",
               data:[]
           });
       } else{
           res.status(201).send({
               success: true,
               msg:"success",
               data: result.affectedRows
           })
       }
    })

})


app.delete('/delete_todo/:id' , (req, res) => {
    const id = req.params.id;
     const query = "DELETE FROM tasks WHERE id = ?"
     connection.query(query, [id], (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({
                success : false,
                msg : 'Server error',
                data:[]
            });
        } else{
            res.status(201).send({
                success: true,
                msg:'success',
                data: result.affectedRows
            })
        }
     })
 
 })
 

const port = 7377;
app.listen(port);