var pool = require("./index");

module.exports = {
    getAllUsers,
    getUserByID,
    getUsersByRoleIDs,
    getUserByEmail,
    addUser,
    editUser,
    addUserDistance,
    subtractUserDistance
}

function getAllUsers(){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM users" , (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getUserByID(id){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result[0]);
        })
    })
}

function getUsersByRoleIDs(ids){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM users WHERE roleID IN (?)", [ids], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getUserByEmail(email){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
            if(err) throw err;
            return resolve(result[0]);
        })
    })
}

function addUser(user){
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO users (firstName, lastName, password, email, roleID) VALUES (?, ?, ?, ?, ?)", 
        [user.firstName, user.lastName, user.password, user.email, user.roleID], (err, result) => {
            if(err) return resolve(err);
            return resolve(result);
        })
    })
}

function editUser(user){
    return new Promise((resolve, reject) => {
        const {firstName, lastName, password, email, roleID, distanceAccumulated, totalDistance, todayDistance, id} = user
        pool.query("UPDATE users SET firstName = ?, lastName = ?, password = ?, email = ?, roleID = ?, accumulatedDistance = ?, totalDistance = ?, todayDistance = ? WHERE id = ?"
        [firstName, lastName, password, email, roleID, distanceAccumulated, totalDistance, todayDistance, id], (err, result) => {
            if(err) throw err;
            return resolve(user);
        })
    })
}

function addUserDistance(id, distance){
    return new Promise((resolve) => {
        pool.query("UPDATE users SET accumulatedDistance = accumulatedDistance + ?, totalDistance = totalDistance + ? WHERE id=?", 
        [distance, distance, id], (err, result) => {
            if(err) throw err;
            return resolve(result)
        })
    })
}

function subtractUserDistance(id, distance){
    return new Promise((resolve) => {
        pool.query("UPDATE users SET accumulatedDistance = accumulatedDistance - ? WHERE id=?", 
        [distance, id], (err, result) => {
            if(err) throw err;
            return resolve(result)
        })
    })
}

