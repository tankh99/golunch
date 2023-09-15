var pool = require("./index");

module.exports = {
    getShopReward,
    getShopRewards,
    addShopReward,
    editShopReward,
    deleteShopReward
}

function getShopReward(id){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shopRewards WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getShopRewards(shopID){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shopRewards WHERE shopID = ? AND isDeleted = 0 ORDER BY distance", [shopID], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function addShopReward(shopReward){
    return new Promise((resolve) => {
        var {name, distance, description, shopID} = shopReward;
        pool.query("INSERT INTO shopRewards (name, distance, description, shopID) VALUES (?,?,?,?)", 
        [name, distance, description, shopID], (err, result) => {
            if(err) throw err;
            return resolve(result.insertId)
        })
    })
}

function editShopReward(shopReward){
    return new Promise((resolve) => {
        var {id, name, distance, description, shopID} = shopReward;
        pool.query("UPDATE shopRewards SET name = ?, distance = ?, description = ? WHERE id = ?",
        [name, distance, description, id], (err, result) => {
            if(err) throw err;
            return resolve(result)
        })
    })
}

function deleteShopReward(id){
    return new Promise((resolve) => {
        pool.query("UPDATE shopRewards SET isDeleted = 1 WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}