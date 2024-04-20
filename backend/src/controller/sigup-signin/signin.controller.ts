import { mongodb } from '../../models/index.model'
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { setTokenVersion } from '../../redis/token-service/token.service';

const { restaurantUser } = mongodb;
const { RestaurantManager } = mongodb;
const { RestaurantBranch } = mongodb;
const {RestaurantOwnerDetails} = mongodb;


const signinController = async (req: any, res: any) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        const user = await restaurantUser.findOne({
            email
        });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            user.failedLoginAttempts += 1;
            user.lastFailedAttempt = new Date();
            await user.save();
            throw { status: 401, message: 'Invalid password' };
        }

        // Set the token version in Redis
        await setTokenVersion(user._id.toString(), user.version);


        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw { status: 500, message: 'Jwt Secret is not defined' };
        }

        if (user.accountType === 'restaurant-owner') {
            const token = jwt.sign(
                {
                    id: user._id,
                    accountType: user.accountType,
                    email: user.email,
                    version: user.version
                },
                jwtSecret,
                {
                    expiresIn: '6h'
                }
            );

            // set the JWT as a cookie on the response
            // res.cookie('token', token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',
            //     maxAge: 6 * 60 * 60 * 1000 // 6 hours
            // });

            // check if the user has a restaurant owner details
            const ownerDetails = await RestaurantOwnerDetails.findOne({
                user: user._id
            });

            // set the JWT as a cookie on the response
            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${6 * 60 * 60 * 1000}`)
                .status(200)
                .json({
                    message: 'Signin successful',
                    result: {
                        _id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        profilePicture: user.profilePicture,
                        accountType: user.accountType,
                        updatedAt: user.updatedAt,
                        accountSetup: !ownerDetails ? false : true,
                        joinedAt: user.joinedAt,
                        address: {
                            country: "",
                            state: "",
                            city: "",
                            address: "",
                            postalCode: "",
                        },
                        nationalIdentificationNumber: '',
                        phoneNumber: '',
                        phoneNumberVerified:false,
                        taxID: '',
                    }
                });

        } else if (user.accountType === 'restaurant-manager') {

            const manager = await RestaurantManager.findOne({
                user: user._id
            })

            if (!manager) {
                throw { status: 403, message: 'Branch is not assigned to him yet' };
            }

            // Check if restaurantBranch is a valid MongoDB ObjectId
            if (!mongodb.mongoose.Types.ObjectId.isValid(manager.restaurantBranch)) {
                throw { status: 400, message: 'Invalid restaurantBranch' };
            } else {
                // Retrieve the branch from the database
                const branch = await RestaurantBranch.findById(manager.restaurantBranch);

                // Check if the branch exists
                if (!branch) {
                    throw { status: 404, message: 'Branch not found' };
                }

                // Check if the branchStatus is 'active' and verifiedBranch is true
                if (branch.branchStatus !== 'active' || !branch.verifiedBranch) {
                    throw { status: 403, message: 'Branch is not active or not verified yet' };
                }
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    accountType: user.accountType,
                    email: user.email,
                    restaurantId: manager.restaurantBranch,
                    version: user.version
                },
                jwtSecret,
                {
                    expiresIn: '6h'
                }
            );

            // set the JWT as a cookie on the response
            // res.cookie('token', token, {
            //     httpOnly: true,
            //     secure: true,
            //     sameSite: 'strict',
            //     domain: ".craiveco.vercel.app",
            //     maxAge: 6 * 60 * 60 * 1000 // 6 hours
            // });

            // console.log('Token: ', token);

            // update the active date
            user.lastLogin = new Date();
            await user.save();

            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${6 * 60 * 60 * 1000}`)
            .status(200)
            .json({ 
                message: 'Signin successful',
                result: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    accountType: user.accountType,
                    updatedAt: user.updatedAt,
                    accountSetup: true,
                }
             });
        } else {
            throw { status: 403, message: 'Unauthorized access' };
        }

    } catch (err) {
        console.log(err);
        res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    }
}

export { signinController };