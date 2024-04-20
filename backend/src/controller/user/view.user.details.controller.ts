import { mongodb } from '../../models/index.model'

const { restaurantUser } = mongodb;
const { RestaurantManager } = mongodb;
const {RestaurantOwnerDetails} = mongodb;


const viewUserDetails = async (req: any, res: any) => {
    try{
        const user = await restaurantUser.findOne({
            _id: req.userId
        });

        if(!user){
            throw { status: 404, message: 'User not found' };
        }

        if (user.accountType === 'restaurant-owner') {
            const ownerDetails = await RestaurantOwnerDetails.findOne({
                user: user._id
            });

            if (!ownerDetails) {
                res.status(200).json({
                    result:{
                        _id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        profilePicture: user.profilePicture,
                        accountType: user.accountType,
                        accountSetup: false,
                        joinedAt: user.joinedAt,
                        updatedAt: user.updatedAt,
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
            }
            else {
                res.status(200).json({
                    result:{
                        _id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        profilePicture: user.profilePicture,
                        accountType: user.accountType,
                        accountSetup: true,
                        joinedAt: user.joinedAt,
                        address: ownerDetails.address,
                        nationalIdentificationNumber: ownerDetails.nationalIdentificationNumber,
                        phoneNumber: ownerDetails.phoneNumber,
                        phoneNumberVerified: ownerDetails.phoneNumberVerified,
                        taxID: ownerDetails.taxID,
                        updatedAt: ownerDetails.updatedAt,
                    }
                });
            }

        }else if (user.accountType === 'restaurant-manager') {
            const manager = await RestaurantManager.findOne({
                user: user._id
            });

            if (!manager) {
                res.status(200).json({
                    result:{
                        _id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        profilePicture: user.profilePicture,
                        accountType: user.accountType,
                        accountSetup: false,
                        joinedAt: user.joinedAt,
                        updatedAt: user.updatedAt
                    }
                });
            }else {
                res.status(200).json({
                    result:{
                        _id: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        profilePicture: user.profilePicture,
                        accountType: user.accountType,
                        accountSetup: true,
                        joinedAt: user.joinedAt,
                        phoneNumber: manager.phoneNumber,
                        restaurantBranch: manager.restaurantBranch,
                        updatedAt: manager.updatedAt,
                    }
                });
            }

        }else {
            res.status(200).json({
                result:{
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    accountType: user.accountType,
                    joinedAt: user.joinedAt,
                    updatedAt: user.updatedAt,
                }
            });
        }

    }
    catch(err){
        res.status(err
            .status || 500)
            .send(err.message || 'Internal server error');
    }
}

export {viewUserDetails};