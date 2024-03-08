// routes/commonRoutes.js

import express from 'express';
import { getAllCars, getCarsInDealership, getAllDeals,getAllDealerships } from '../controllers/commonController.js';

const router = express.Router();

// Common endpoints
router.get('/cars', getAllCars);
router.get('/cars/:dealershipId', getCarsInDealership);

router.get('/deals/:dealershipId', getAllDeals);
router.get('/alldealerships', getAllDealerships);

export default router;
