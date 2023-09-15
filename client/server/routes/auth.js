var express = require("express");
var router = express.Router();

var jwt = require("jsonwebtoken");
var usersDB = require("../db/users");
var bcrypt = require("bcrypt")
const userContract = require("../contracts/user");

router.post("/register", (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = req.body;
    var saltRounds = 10;
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) throw err;
        var user = {firstName, lastName, password: hash, email, roleID: 1};
        usersDB.addUser(user)
        .then(result => {
            if(!result.code){ // checks if there is an error. This is a special case, since it is the only db function that returns the error
                user.id = result.insertId
                res.status(200).send("Successfully added user")
            } else {
                switch(result.code){
                    case "ER_DUP_ENTRY":
                        res.status(401).send("Error: Email alredy exists in our system");
                        break;
                    default:
                        res.status(500).json(result.code);
                }
            }
        }).catch(err => {
            res.json(err)
        })
    })
})

var signOptions = {
    expiresIn: "12h"
}


router.post("/login", (req, res) => {
    const {
        email,
        password
    } = req.body;
    
    usersDB.getUserByEmail(email)
        .then(user => {
            bcrypt.compare(password, user.password, (err, success) => {
                if(err) throw err;
                if(success){
                    const secretKey = process.env.REACT_APP_JWT_KEY;
                    const {password, privateKey, ...userWithoutPassword} = user;
                    var userToken = jwt.sign({user: userWithoutPassword}, secretKey, signOptions);
                    res.json({
                        success: true,
                        userToken,
                        message: "Logged in success"
                    })
                } else {
                    res.json({
                        success: false,
                        message: "Invalid credentials"
                    })
                }
            })
        }).catch(err => {
            res.json({
                success: false,
                message: "Invalid credentials",
                error: err
            })
        })
})

module.exports = {
    router
};