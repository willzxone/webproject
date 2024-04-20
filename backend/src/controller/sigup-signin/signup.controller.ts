import {mongodb} from '../../models/index.model'
import * as bcrypt from 'bcryptjs';

const {restaurantUser} = mongodb;


const signupController = async (req : any , res : any) => {
    const {email , password } = req.body;
    console.log(req.body);
    try {

        // Generate a salt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        await restaurantUser.findOneAndUpdate({
            _id: req.userId
        },{
            password : hashedPassword,
            invitationAccepted : true,
            joinedAt : new Date()
        });

        res.status(200).json({message : 'Signup successful'});
        
    }catch(err) {
        console.log(err);
        res.status( err.status || 500 ).json({ message : err.message || 'Internal Server Error'});
    }
}

export {signupController};