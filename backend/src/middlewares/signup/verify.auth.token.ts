import * as jwt from 'jsonwebtoken';

import { mongodb } from '../../models/index.model';

const { restaurantUser } = mongodb;

const verifySignUpToken = async (req : any , res: any , next: any ) => {
    const token = req.query.token;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).send({
            message: 'JWT secret is not defined.'
        });
    }

    jwt.verify(token , jwtSecret , (err : any , decoded : any) => {
        if (err) {
            return res.status(401).send({
                message : 'Your signup url is expired. Contact the admin for a new signup link.'
            });
        }
        req.userId = decoded.id;
        req.accountType = decoded.accountType;
        req.userEmail = decoded.email;

        if (decoded.accountType === 'restaurant-owner') {
            restaurantUserValidation(req , res , next , decoded);
        }else if (decoded.accountType === 'restaurant-manager') {
            restaurantUserValidation(req , res , next , decoded);
        }else {
            return res.status(401).send({
                message : 'Invalid account type'
            });
        }

    });
}



async function restaurantUserValidation (req : any , res : any , next : any , decoded : any) {

    // validate the password and check length
    if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
            message : 'Password is required and should be at least 6 characters long'
        });
    }

    // retrieve the user from the database
    const user = await restaurantUser.findOne({
        _id : req.userId
    });

    if(!user) {
        return res.status(404).send({
            message : 'User not found'
        });
    }

    if(user.invitationAccepted) {
        return res.status(409).send({
            message : 'User has already registered'
        });
    }

    if (parseInt(user.invitationTime) !== decoded.iat) {
        return res.status(401).send({
            message : 'New link is already generated this link is expired. please try new link or contact the admin for new link.'
        });
    }

    const {email} = req.body

    if (user.email !== email) {
        return res.status(400).send({
            message : 'Try same email which was used for invitation'
        });
    }

    next();
}



export {verifySignUpToken};