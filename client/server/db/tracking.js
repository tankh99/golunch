const pool = require("./index");

module.exports = {
    stopTracking,
    scanQR
}

function stopTracking(todayDistance, userID){
    return new Promise((resolve) => {
        pool.query("UPDATE users SET todayDistance = todayDistance + ? WHERE id = ?",
        [todayDistance, userID], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function scanQR(todayDistance, userID){
    return new Promise((resolve) => {
        pool.query("UPDATE users SET accumulatedDistance = accumulatedDistance + ?, totalDistance = totalDistance + ? WHERE id = ?",
        [todayDistance, todayDistance, userID], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}