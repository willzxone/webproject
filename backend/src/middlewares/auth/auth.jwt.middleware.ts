import * as jwt from 'jsonwebtoken';
import { getTokenVersion } from '../../redis/token-service/token.service';

const verifyJwtToken = async (req : any , res: any , next: any ) => {
    if (!req.cookies || !req.cookies.token ){
        return res.status(403).send ({
            message : 'No token provided'
        });
    }

    const token = req.cookies.token;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).send({
            message: 'JWT secret is not defined.'
        });
    }

    jwt.verify(token, jwtSecret, async (err: any, decoded: any) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized access. Please log in.'
            });
        }

        // Check the token version
        console.log(decoded.id)
        const tokenVersion = await getTokenVersion(decoded.id);
        console.log(tokenVersion)
        console.log(decoded.version)
        if (tokenVersion == null) {
            return res.status(401).send({
                message: 'User not authenticated or session expired. Please log in.'
            });
        }

        if (parseInt(tokenVersion) !== decoded.version) {
            return res.status(401).send({ message: 'Token version mismatch! Login Again' });
        }

        if (decoded.accountType == "restaurant-owner"){
            req.userId = decoded.id;
            req.accountType = decoded.accountType;
            req.userEmail = decoded.email;
        }else if (decoded.accountType == "restaurant-manager"){
            req.userId = decoded.id;
            req.accountType = decoded.accountType;
            req.userEmail = decoded.email;
            req.restaurantId = decoded.restaurantId;
        }

        next();
    });
}

export {verifyJwtToken};