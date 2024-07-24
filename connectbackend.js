var express = require('express');
var app = express();
var port = 3000;

app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});
app.get('/delup', (req, res) => {
    res.sendFile(__dirname + '/table.html');
});
app.listen(port, () => {
console.log('Server listening on port ' + port);
});
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/dbcon');
var nameSchema = new mongoose.Schema({
 name:String,
 dep:String,
 rollno:Number,
 sem:Number,
 year:String
});
var User = mongoose.model('User', nameSchema);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/addname', (req, res) => {
console.log(req.body);
var myData = new User(req.body);
myData.save()
.then(users => {
   res.send(
    `<html>
            <head>
                <style>
                body{
                    background-color: black;
                color: white;

                }
                div{margin-top:200px;}
            h2{height:30px;}
            a{color:green;}
                </style>
            </head>
            <body>
            <div align="center">
                <font  size="15px">Hello</font><font size="25px"color="green"> ${users.name}</font>
                <h2 align="center">To see database&nbsp;  <a href="http://localhost:3000/users">click here</a> !...</h2>
                 <h2 align="center">To delete database&nbsp;  <a href="http://localhost:3000/delete">click here</a> !...</h2>
                  <h2 align="center">To update database&nbsp;  <a href="http://localhost:3000/update">click here</a> !...</h2>
            </div>
            </body>
        </html>`
   );
})  
.catch(err => {
res.status(400).send('unable to save to database');
});
})
app.get('/users', (req, res) => {
    User.find({}).exec()
        .then(users => {
            res.send(`<html>
                        <head>
                            <title>dbdata</title>
                            <style>
                            body{
                            background-color: black;
                            color: white;
                            }
                                table, th, td {
                                    border: 1px solid white;
                                    border-collapse: collapse;
                                    padding: 8px;
                                    width:1000px;
                                    margin-left:240px;  
                                }
                                h1{color:green;margin-top:50px;margin-left:500px;}
                            </style>
                        </head>
                        <body>
                            <h1>Data Retreived Successfully !...</h1>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Roll No</th>
                                    <th>Semester</th>
                                    <th>Year</th>
                                </tr>
                                
                                ${users.map(user => `
                                <tr>
                                    <td>${user.name}</td>
                                    <td>${user.dep}</td>
                                    <td>${user.rollno}</td>
                                    <td>${user.sem}</td>
                                    <td>${user.year}</td>
                                </tr>
                            `).join('')}
                            </table>
                        </body>
                    </html>`);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Internal Server Error');
        });
});
app.post('/update', (req, res) => {
    const { userId, name, dep, rollno, sem, year } = req.body;
    User.findByIdAndUpdate(userId, { name, dep, rollno, sem, year }, { new: true })
        .then(updatedUser => {
            res.send(`<h1>User updated successfully: ${updatedUser.name}</h1>`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
        
});

app.post('/delete', (req, res) => {
    const { deleteUserId } = req.body;
  
    User.findByIdAndDelete(deleteUserId)
      .then((deletedUser) => {
        res.send(`<h1>User deleted successfully: ${deletedUser.name}</h1>`);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  });