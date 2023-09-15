import ResponseMsg from "../../models/ResponseMsg";

var jwt = require("jsonwebtoken");

export function getUserInfo(): Promise<ResponseMsg>{
    return new Promise((resolve, reject) => {
        const userToken = localStorage.getItem("userToken");
        if(userToken){
            jwt.verify(userToken, process.env.REACT_APP_JWT_KEY, (err: any, decoded: any) => {
                if(decoded){
                    // return resolve({isVerified: true, userInfo: decoded});
                    // const obj = {
                    //     success: true,
                    //     payload: decoded
                    // }
                    return resolve({success: true, payload: decoded})
                } else{
                    const obj = {
                        success: false,
                        msgHeader: err
                    }
                    return resolve({success: false, msgHeader: err})
                }
    
            })
        } else {
            const obj = {
                success: false,
                msgHeader: "Not logged in"
            }
            return resolve({success: false, msgHeader: "Not logged in"});
        }
    })
}

export function verifyToken (): Promise<ResponseMsg>{
    return new Promise((resolve) => {
        const userToken = localStorage.getItem("userToken");
        if(userToken){
            jwt.verify(userToken, process.env.REACT_APP_JWT_KEY, (err: any, decoded: any) => {
                if(decoded){
                    return resolve({success: true, payload: decoded.user})
                } else{
                    switch(err.name){
                        case "TokenExpiredError":
                            return resolve({success: false, msgHeader: "Your session expired. Please login again"})
                        case "JsonWebTokenError":
                            return resolve({success: false, msgHeader: "Invalid email/password"})
                        default:
                            return resolve({success: false, msgHeader: "Sorry, something went wrong when verifying your credentials"})
                    }
                }
    
            })
        } else {
            return resolve({success: false, msgHeader:"User is not logged in"});
        }
    })
}