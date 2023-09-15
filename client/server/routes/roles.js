var express = require("express");
var router = express.Router();
var roleDB = require("../db/roles");

router.get("/get", (req, res) => {
    roleDB.getRoles()
        .then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err);
        })
})

router.get("/getByID", (req, res) => {
    var {ids} = req.query;
    roleDB.getRolesByID(ids)
        .then(result => {
            res.send(result);
        })
})

module.exports = {
    router
};