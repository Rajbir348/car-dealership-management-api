import express from 'express';
import { loginUser, loginAdmin, userSignup,dealershipSignup,loginDealership, logout } from '../controllers/authController.js';

const router = express.Router();
//signup routes
router.post('/signup/user',userSignup);
router.post('/signup/dealership',dealershipSignup);

//login routes
router.post('/login/admin',loginAdmin)
router.post('/login/user', loginUser);
router.post('/login/dealership',loginDealership);

//logout routes
router.post('/logout', logout);

export default router;
