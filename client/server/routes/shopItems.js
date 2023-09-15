var shopItemsDB = require("../db/shopItems");
var express = require("express")
var router = express.Router();

router.get("/get", (req, res) => {
    shopItemsDB.getShopItems()
        .then(shopItems => {
            res.send(shopItems);
        }).catch(err => {
            console.error(err);
        })
    
})

router.get("/get/:id", (req, res) => {
    var id = req.params.id;
    shopItemsDB.getShopItem(id)
        .then(shopItem => {
            res.send(shopItem);
        }).catch(err => {
            console.error(err);
        })
    
})



function processShopItems(shopItems, shopID, req){
    // console.log(shopItems);
    // console.log(req.files)
    for(var i = 0; i< shopItems.length; i++){
        var shopItem = shopItems[i];
        
        var shopItemImg = req.files.filter(f => f.fieldname != "shopItemImg" && (f.fieldname.split(".")[1] == i))[0]
        if(shopItemImg){
            shopItem.imageUrl = shopItemImg.path.replace(/src\//, "");
        }
        shopItem.shopID = shopID
    }
    return shopItems;
}

module.exports = {
    router,
    processShopItems
};