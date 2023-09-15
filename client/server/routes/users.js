const express = require("express");
const router = express.Router();
const userDB = require("../db/users");
const userRewardsDB = require("../db/userRewards")
const bcrypt = require("bcrypt");
const userContract = require("../contracts/user");

router.post("/add", (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        roleID
    } = req.body;
    var saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) throw err;
        var user = {firstName, lastName, password: hash, email, roleID};
        userDB.addUser(user)
        .then(result => {
            res.send("Successfully added user")
        }).catch(err => {
            console.error(err);
            res.status(500).json(err);
        })
    })
})

router.get("/get", (req, res) => {
    userDB.getAllUsers()
        .then(result => {
            res.send(result);
        })
})

router.get("/getByID/:id", (req, res) => {
    var id = req.params.id;
    userDB.getUserByID(id)
        .then(result => {
            res.send(result)
        })
})

router.get("/getByName/:name", (req, res) => {
    var name = req.params.name;
    userDB.getUserByName(name)
        .then(result => {
            res.send(result)
        })
})

router.get("/getByRoles", (req, res) => {
    // var {ids} = req.body;
    // ids = JSON.parse(ids);
    var {ids} = req.query
    userDB.getUsersByRoleIDs(ids)
        .then(result => {
            res.send(result)
        })
})

module.exports = {
    router
};