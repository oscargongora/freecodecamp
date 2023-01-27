const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

require('dotenv').config();

app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const db = require("./db");

//users
app.post("/api/users", (req, res) =>{
  const username = req.body.username;
  if(username){
    const dbres = db.addUser(username);
    if(dbres.succeeded){
      return res.json(dbres.data);
    }
  }
  return res.status(500).send("ValidationError: Users validation failed: username: Path `username` is required.");
});

app.get("/api/users", (req, res) =>{
  const users = db.getUsers();
  return res.json(users);
});

//exercises
app.post("/api/users/:_id/exercises", (req, res) =>{
  const {description, duration, date} = req.body;
  try {
    if(description && duration){
      const dbres = db.updateUser(req.params._id, description, Number(duration), date);
      if(dbres.succeeded){
        return res.json(dbres.data);
      }
    }
  } catch (error) {
    
  }
  return res.status(500).send("ValidationError: Exercises validation failed: description: Path `description` is required., duration: Path `duration` is required.");
});

//logs
app.get("/api/users/:_id/logs", (req, res) =>{
  const id = req.params._id;
  const {from, to, limit} = req.query;
  try {
    const dbres = db.getUserWithLogs(id,from,to,limit);
    if(dbres.succeeded){
      return res.json(dbres.data);
    }
  } catch (error) {
    
  }
  return res.status(500).send("ValidationError: Exercises validation failed: description: Path `description` is required., duration: Path `duration` is required.");

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
})
