import express from 'express';
const router = express.Router();

// import controllers
import { signupController } from '../../controllers/sigup-signin/signup.controller';
import { signinController } from '../../controllers/sigup-signin/signin.controller';


// import middlewares
import {verifySignUpToken} from '../../middlewares/signup/verify.auth.token';
import {validateSignInRequest} from '../../middlewares/signin/sign-in-middleware';
import {validateSignInDocument} from '../../middlewares/signin/sign-in-middleware';


// routes
router.post('/signup', verifySignUpToken ,signupController);
router.post('/signin', validateSignInRequest, validateSignInDocument ,signinController);


// export router
export default router;

