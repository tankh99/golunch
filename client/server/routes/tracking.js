const express = require("express");
let router = express.Router();
const usersDB = require('../db/users');
const userHistoryDB = require("../db/userHistory");
const trackingDB = require("../db/tracking");
const datefns = require('date-fns');
const distanceContract = require('../contracts/distance');
const userContract = require("../contracts/user");
const {web3} = require("../contracts/index");



router.get("/getTime", (req, res) => {
    const date = new Date();
    res.send(date);

})

router.post("/scanQR", (req, res) => {
    
    let {userID} = req.body[0]
    let totalDistance = 0;
    for(let trackingInfo of req.body){
        let {userID, startTime, endTime, date, distance} = trackingInfo;
        // prevents records that have distance of 0 from beingi nserted
        if(distance > 0){
            date = convertJSDateToMySQLDate(date);
            startTime = convertJSDateToMySQLDate(startTime);
            endTime = convertJSDateToMySQLDate(endTime);
            userHistoryDB.addHistory(date, startTime, endTime, userID)
            totalDistance += distance;
        }
    }
    // console.log(req.body);
    // console.log(totalDistance);
    totalDistance *= 2;
    usersDB.addUserDistance(userID, totalDistance)
    .then(result => {
        // console.log(result);
        res.json("OK");
    })
    
})

function convertJSDateToMySQLDate(date){
    const mysqlDate = date.slice(0, 19).replace('T', ' ')
    return mysqlDate;
}

module.exports = {
    router
}