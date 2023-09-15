var pool = require("./index");

module.exports = {
    getShopItems,
    getShopItem,
    addShopItem
}

function getShopItems(){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shopItems", (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function getShopItem(id){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM shopItems WHERE id = ?", [id], (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}

function addShopItem(shopItem){
    return new Promise((resolve) => {
        var {name, price, imageUrl, shopID} = shopItem;
        pool.query("INSERT INTO shopItems (name, price, imageUrl, shopID) VALUEs (?, ?, ?, ?)",
            [name, price, imageUrl, shopID], (err, result) => {
                if(err) throw err;
                return resolve(result);
            })
    })
}