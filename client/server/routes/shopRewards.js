const express = require("express"),
    shopRewardsDB = require("../db/shopRewards");

const router = express.Router();

router.get("/get/:shopID", (req, res) => {
    var shopID= req.params.shopID;
    shopRewardsDB.getShopRewards(shopID)
        .then((shopRewards) => {
            res.send(shopRewards)
        })
})

function processShopRewards(shopRewards, shopID, req){
    for(var i = 0; i< shopRewards.length; i++){
        var shopReward = shopRewards[i];
        if(!shopReward.id){
            shopReward.id = 0;
        }
        // var shopItemImg = req.files.filter(f => f.fieldname != "shopItemImg" && (f.fieldname.split(".")[1] == i))[0]
        shopReward.shopID = shopID
    }
    return shopRewards;
}

module.exports = {
    router,
    processShopRewards
}