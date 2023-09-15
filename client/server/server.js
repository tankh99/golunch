require('dotenv').config() // enables access of .env variables
var compression = require("compression"); // to compress headers, improving performance
var helmet = require("helmet") // for security
var express = require("express")
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();


app.use(express.static(`${__dirname}/../build`)); // makes it so that the serve uses files from the build folder instead of src
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(compression())
app.use(helmet())

const API_ROOT = "/api";

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const userRewardsRoute = require("./routes/userRewards");
const rolesRoute = require("./routes/roles");
const shopRewardsRoute = require("./routes/shopRewards")
const shopItemsRoute = require("./routes/shopItems")
const shopsRoute = require("./routes/shops");
const trackingRoute = require("./routes/tracking")

// app.get("/", (req, res) => {
//     console.log("konichi")
//     res.sendFile(path.resolve('build/index.html'));
// })

// the router.router above is subject to change, so may not need to  
app.use(`${API_ROOT}/auth`, authRoute.router);
app.use(`${API_ROOT}/users`, usersRoute.router);
app.use(`${API_ROOT}/userRewards`, userRewardsRoute.router);
app.use(`${API_ROOT}/roles`, rolesRoute.router);
app.use(`${API_ROOT}/shops`, shopsRoute.router);
app.use(`${API_ROOT}/shopItems`, shopItemsRoute.router);
app.use(`${API_ROOT}/shopRewards`, shopRewardsRoute.router);
app.use(`${API_ROOT}/tracking`, trackingRoute.router)

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))