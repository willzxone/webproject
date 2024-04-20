import { validationResult, check } from 'express-validator';
import { mongodb } from '../../models/index.model';
const { restaurantUser } = mongodb;

const validateSignInRequest = [
    check('email').isEmail().withMessage('Email is required'),
    check('password').isString().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    async (req: any, res: any, next: any) => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                message: "Bad Request: Invalid inputs provided. Please check the error object for more details."
            });
        }
    
        // Proceed to the next middleware or route handler
        next();
    },
];


const validateSignInDocument = async (req : any , res : any , next: any) => {
    const {email} = req.body;
    try {
        const user = await restaurantUser.findOne({
            email
        });
        if (!user) {
            throw {status : 404 , message : 'User not found. Please sign up first.'};
        }

        if (user.invitationAccepted === false) {
            throw {status : 403 , message : 'Unauthorized  access. Please accept the invitation first.'};
        }

        if (user.accountSuspension === true) {
            throw {status : 403 , message : 'Unauthorized  access. Your account is suspended. Please contact the admin.'};
        }

        if (user.failedLoginAttempts >= 5) {
            const lockoutTime = 15; // 15 minutes
            const currentTime = new Date();
            const lastFailedAttempt = new Date(user.lastFailedAttempt);
            const differenceInMinutes = (currentTime.getTime() - lastFailedAttempt.getTime()) / (1000 * 60);
        
            if (differenceInMinutes < lockoutTime) {
                const timeLeft = lockoutTime - differenceInMinutes;
                throw {status: 403, message: `You have exceeded the maximum number of login attempts. Try again in ${timeLeft.toFixed(2)} minutes.`};
            } else {
                // Reset failed login attempts and last failed attempt time
                user.failedLoginAttempts = 0;
                user.lastFailedAttempt = null;
                await user.save();
            }
        }

        next();
    
    } catch (err) {
        console.log(err);
        res.status( err.status || 500 ).json({ message : err.message || 'Internal Server Error'});
    }
}



export { validateSignInRequest, validateSignInDocument };