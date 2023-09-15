const pool = require("./index");

module.exports = {
    addHistory
}

function addHistory(date, startTime, endTime, userID){
    return new Promise((resolve) => {
        // const {date, startTime, endTime, userID} = history;
        pool.query("INSERT INTO userHistory (date, startTime, endTime, userID) VALUES (?, ?, ?, ?)", 
        [date, startTime, endTime, userID], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}