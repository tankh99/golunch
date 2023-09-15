var express = require("express");
var multer = require("multer");
var fs = require("fs");
var router = express.Router();


var shopItemsRouter = require('./shopItems')
var shopRewardsRouter = require("./shopRewards")

var shopDB = require("../db/shops");
var shopItemDB = require("../db/shopItems");
var shopRewardDB = require("../db/shopRewards");

router.get("/get", (req, res) => {
    shopDB.getShops()
        .then(shops => {
            res.send(shops);
        })
})

router.get("/getPromoted", (req, res) => {
    shopDB.getPromotedShops()
        .then(shops => {
            res.send(shops);
        })
})

router.get("/get/:id", (req, res) => {
    var id = req.params.id;
    shopDB.getShop(id)
        .then(shop => {
            // console.log(shops);
            res.send(shop);
        })
})

// adding and editing shops //

var storage = multer.diskStorage({
    // there is an issue where req.body ONLY shows id and name. This only occurs when adding a shop
    // with a shop image and name
    destination: function(req, file, cb){ // cb stands for callback
        
        const dir = `src/images/shops`;
        const publicDir = __dirname + '../../../build/static/media';
        cb(null, dir);
    },
    // renames the image into [shop name]-shopImage.jpg
    filename: function(req, file, cb){
        var shopName = req.body.name;
        // the 2 slashes are regex stuff, the g allows me to replace ALL spaces
        shopName = shopName.replace(/ /g, ""); 
        var imageUrl = shopName + "-" + file.fieldname + ".jpg";
        cb(null, imageUrl);

    }
})

var upload = multer({storage})

router.post("/add", upload.any(), (req, res) => {
    // console.log(req.body);
    var shop = processShop(req);
    var {
        shopItems,
        shopRewards
    } = req.body
    // var shopItems = shopItems ? JSON.parse(shopItems) : null;
    var shopRewards = shopRewards ? JSON.parse(shopRewards) : null;
    // console.log(shopRewards)
    shopDB.addShop(shop)
        .then(insertedID => {
            var newShopRewards = shopRewardsRouter.processShopRewards(shopRewards, insertedID, req);
            for (var shopReward of newShopRewards){
                shopRewardDB.addShopReward(shopReward)
            }
            shop.id = insertedID; // adds id to the newly ccreated shop, so that when clicking on the newly created shop, it wont have an undefined id
            res.send(shop);
        }).catch(err => {
            console.error(err);
            res.status(500).send(err);
        })
})

router.post("/edit", upload.any(), (req, res) => {
    var shop = processShop(req);

    var {
        shopRewards
    } = req.body;
    var shopRewards = shopRewards ? JSON.parse(shopRewards) : null;
    shopRewards = shopRewardsRouter.processShopRewards(shopRewards, shop.id);
    shopDB.editShop(shop)
        .then(result => {
            shopRewardDB.getShopRewards(shop.id)
                .then(data => {
                    var oldShopRewards = data;
                    // 3 situations
                    // yes and no are for if they exist in the lists: oldShopRewards and shopRewards
                    // 1. reward already exists, no new input: yes, no
                    // 2. reward is new, new input: no, yes
                    // 3. reward already exists, but new input, yes, yes
                    
                    for(var oldShopReward of oldShopRewards){
                        var rewardStillExists = false;
                        for(var shopReward of shopRewards){
                            if(shopReward.id == oldShopReward.id){
                                rewardStillExists = true
                            }
                        }
                        if(rewardStillExists){
                            var shopReward = shopRewards.filter(sr => sr.id == oldShopReward.id)[0]
                            shopRewardDB.editShopReward(shopReward)
                                .then(result => {
                                    console.log("edited shop reward")
                                }).catch(err => {
                                    console.error(err)
                                })
                        } else {
                            shopRewardDB.deleteShopReward(oldShopReward.id)
                                .then(result => {
                                    console.log("deleted shop reward")
                                }).catch(err => {
                                    console.log(err)
                                })
                        }
                    }
                    for(var shopReward of shopRewards){
                        if(shopReward.id == null || shopReward.id == 0){
                            console.log("adding shopreward");
                            shopRewardDB.addShopReward(shopReward);
                        }
                    }
                })
            res.send(shop)
        }).catch(err => {
            res.send(err);
        })
})

router.get("/delete/:id", (req, res) => {
    var id = req.params.id
    shopDB.getShop(id)
    .then(result => {
        let shop = result[0]
        if(shop.imageUrl){
            const imageUrl = "src/" + shop.imageUrl;
            if(fs.existsSync(imageUrl)){
                console.log("iamge eixsts");
                fs.unlinkSync("src/" + shop.imageUrl, (err) => {
                    if(err) throw err;
                    console.log("successfully deleted image");
                }); 
            }
        }
        shopDB.deleteShop(id)
        .then(result => {
            res.send(id)
        }).catch(err => {
            res.status(500).json(err);
        })
    })
})

function processShop(req){
    var {
        id,
        name,
        address,
        officeNumber,
        startTime,
        endTime,
        coords,
        imageUrl,
        isPromoted,
        accessToken,
    } = req.body
    
    var shopImgUrl = "";
    if(req.files && req.files.length > 0 && req.files[0].fieldname == "imageUrl"){
        let imgPath = req.files[0].path; 
        shopImgUrl = imgPath.replace(/src\//g, ""); // replace the src/, because you cannot use src/ in relative path
        shopImgUrl = shopImgUrl.replace(/src\\/g, ""); // for windows
        shopImgUrl = shopImgUrl.replace(/\\/g, "/");
        // shopImgUrl = req.files[0].path.
    } else if (imageUrl){
        shopImgUrl = imageUrl // that means we are updating an old imageUrl
    }

    let isPromotedVal = 0;
    if(isPromoted && isPromoted === 'true'){
        isPromotedVal = 1;
    }

    var shop = {
        id, 
        name, 
        address,
        officeNumber,
        startTime,
        endTime,
        isPromoted: isPromotedVal,
        imageUrl: shopImgUrl,
        accessToken,
    }
    
    if(coords){
        let parsedCoords = JSON.parse(coords);
        let {lat, lng} = parsedCoords
        shop.lat = lat;
        shop.lng = lng;
    }
    return shop;
}

module.exports = {
    router,
    processShop
}