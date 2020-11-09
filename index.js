const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.get("/api/users", (req, res)=> {
   res.setHeader("Contet-Type", "application/json");
   res.json(getUsers());
});

function getUsers() {
   return JSON.parse(fs.readFileSync(path.join(__dirname, "/data/users")));  
}

function addUser(user) {
   let users = getUsers();
   users.push(user);

   fs.writeFileSync(path.join(__dirname, "/data/users"), JSON.stringify(users));
}

function deleteUser(idUser) {
   let users = getUsers();
   for (let i = 0; i < users.length; i++) {
      if (users[i].id == idUser) {
         users.splice(i, 1);
         break;
      }
   }

   fs.writeFileSync(path.join(__dirname, "/data/users"), JSON.stringify(users));
}

function updateUser(user) {
   let users = getUsers();
   for (let i = 0; i < users.length; i++) {
      if (users[i].id == user.id) {
         users.splice(i, 1, user);
         break;
      }
   }

   fs.writeFileSync(path.join(__dirname, "/data/users"), JSON.stringify(users));
}

app.post("/api/users/create", (req, res) => {
   addUser(req.body);
   res.setHeader("Content-Type", "application/json");
   res.json({
      "error": false,
      "message": "User added"
   })
});

app.delete("/api/users/delete/:id", (req, res) => {
   deleteUser(req.params.id);
   res.setHeader("Content-Type", "application/json");
   res.json({
      "error": false,
      "message": "User deleted"
   })
});

app.post("/api/users/update", (req, res) => {
   updateUser(req.body);
   res.setHeader("Content-Type", "application/json");
   res.json({
      "error": false,
      "message": "User updated"
   })
});

app.listen(PORT, () => {
   console.log("Server running");
});