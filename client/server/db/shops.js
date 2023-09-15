var pool = require("./index");

module.exports = {
    getShops,
    getPromotedShops,
    getShop,
    addShop,
    editShop,
    deleteShop
}

function getShops(){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shops", (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getPromotedShops(){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shops WHERE isPromoted = 1", (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getShop(id){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shops WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function addShop(shop){
    return new Promise((resolve) => {
        const {name, address, officeNumber, startTime, endTime, lat, lng, imageUrl, isPromoted, accessToken} = shop
        
        pool.query(`INSERT INTO shops 
            (name, address, officeNumber, startTime, endTime, lat, lng, imageUrl, isPromoted, accessToken) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, address, officeNumber, startTime, endTime, lat, lng, imageUrl, isPromoted, accessToken], (err, result) => {
            if(err) throw err;
            return resolve(result.insertId)
        })
    })
}

function editShop(shop){
    return new Promise((resolve) => {
        const {id, name, address, officeNumber, startTime, endTime, lat, lng, imageUrl, isPromoted, accessToken} = shop
        pool.query(`UPDATE shops SET 
            name = ?, address = ?, officeNumber = ?, startTime = ?, endTime = ?, lat = ?, lng = ?, imageUrl = ?, isPromoted = ? , accessToken = ? WHERE id = ?`, 
        [name, address, officeNumber, startTime, endTime, lat, lng, imageUrl, isPromoted, accessToken, id], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function deleteShop(id){
    return new Promise((resolve) => {
        pool.query("DELETE FROM shops WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result)
        })
    })
}