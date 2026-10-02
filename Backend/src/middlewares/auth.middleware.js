import jwt from "jsonwebtoken";

const verifyJWT=async (req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message:"AccessToken Not Found"
        })
    }

        const accessToken=authHeader.split(" ")[1];

        try{
            const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

            req.user=decoded;
            next()
        }
        catch(error){
            res.status(401).json({
                message:"Invalid Access Token"
            });
        }
}

export {verifyJWT};