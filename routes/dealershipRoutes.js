// routes/dealershipRoutes.js

import express from 'express';
import { addCarToDealership, addDealToDealership, getInventory, getSoldVehiclesWithOwnerInfo ,editCar, deleteCar} from '../controllers/dealershipController.js';

const router = express.Router();

// Dealership endpoints
router.post('/cars', addCarToDealership);
router.post('/deals', addDealToDealership);
router.get('/sold-vehicles', getSoldVehiclesWithOwnerInfo);
router.get('/inventory', getInventory);
router.post('/car/edit', editCar);
router.get('/car/delete/:carId', deleteCar);

export default router;
