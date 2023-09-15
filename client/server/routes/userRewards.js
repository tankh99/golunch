const express = require("express");
const router = express.Router();
const usersDB = require("../db/users");
const userRewardsDB = require("../db/userRewards")
const userContract = require("../contracts/user");
const distanceTokenContract = require("../contracts/distanceToken");

router.get("/getUserRewardsByUserID/:id", (req,res) => {
    var id = req.params.id;
    userRewardsDB.getUserRewardsByUserID(id)
        .then(result => {
            res.send(result)
        })
})


router.get("/deleteUserRewards/:id", (req, res) => {
    var id = req.params.id
    userRewardsDB.deleteUserRewards(id)
        .then(result => {
            res.send(id)
        }).catch(err => {
            res.status(500).json(err);
        })
})

router.get("/claimReward/:id", (req, res) => {
    const id = req.params.id;
    userRewardsDB.claimReward(id)
    .then(result => {
        res.send(id);
    }).catch(err => {
        res.status(500).json(err);
    })
})

router.post("/addUserReward", (req, res) => {
    var {rewardID, userID, distance} = req.body
    userRewardsDB.addUserRewards(userID, rewardID, distance)
        .then(result => {
            usersDB.subtractUserDistance(userID, distance)
            .then(result => {
                usersDB.getUserByID(userID)
                .then(result=> {
                    res.json(result.accumulatedDistance)
                })
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json(err);
        })
})

module.exports = {
    router
}