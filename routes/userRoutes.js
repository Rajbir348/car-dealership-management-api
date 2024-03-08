// routes/userRoutes.js

import express from 'express';
import { getDealershipsWithCar, getUserVehiclesWithDealerInfo, getDealsOnCar ,buyVehicle} from '../controllers/userController.js';

const router = express.Router();

// User endpoints
router.get('/dealerships/:carName', getDealershipsWithCar);
router.get('/vehicles', getUserVehiclesWithDealerInfo);
router.get('/deals/:carName', getDealsOnCar);

router.post('/buy/:vehicleId', buyVehicle);
export default router;
