var pool = require("./index");

module.exports = {
    claimReward,
    getUserRewardsByUserID,
    deleteUserRewards,
    addUserRewards,
}

function claimReward(rewardID){
    return new Promise(resolve => {
        pool.query("UPDATE userRewards SET isClaimed = 1 WHERE id = ?", [rewardID], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getUserRewardsByUserID(userID){
    return new Promise((resolve) => {
        pool.query(`SELECT ur.id, ur.userID, s.name as shopName, ur.rewardID, ur.isClaimed, sr.name, sr.description, sr.distance
        FROM userRewards ur 
        LEFT JOIN shopRewards sr ON ur.rewardID = sr.id
        LEFT JOIN shops s ON sr.shopID = s.id
        WHERE ur.userID = ? AND isClaimed = 0
        ORDER BY distance`, [userID], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function addUserRewards(userID, rewardID){
    return new Promise((resolve) => {
        pool.query("INSERT INTO userRewards (userID, rewardID, dateTime) VALUES (?, ?, ?)", 
        [userID, rewardID, new Date()], (err, result) => {
            if(err) throw err;
            return resolve(result)
        })
    })
}


function deleteUserRewards(id){
    return new Promise((resolve) => {
        pool.query("DELETE FROM userRewards WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result)
        })
    })
}