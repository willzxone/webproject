import express from 'express';
const router = express.Router();

// import controllers
import {viewUserDetails} from '../../controllers/user/view.user.details.controller';


// routes
router.get('/' , viewUserDetails);


// export router
export default router;