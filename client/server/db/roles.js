var pool = require("./index");

module.exports = {
    getRoles,
    getRolesByID
}

async function getRoles(){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM roles", (err, result) => {
            if(err) throw err;
            return resolve(result);
        })
    })
}
async function getRolesByID(ids){
    return new Promise((resolve) => {
        pool.query("SELECT * FROM roles WHERE id IN (?)", [ids], (err, result) => {
            if (err) throw err;
            return resolve(result);
        })
    })
}