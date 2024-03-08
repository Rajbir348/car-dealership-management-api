// controllers/userController.js
import { ObjectId } from 'mongodb';
import { db } from '../config/db.js';
import CarModel from '../models/Car.js';
import DealershipModel from '../models/Dealership.js';
import UserModel from '../models/User.js';
import DealModel from '../models/Deal.js';

export const getDealershipsWithCar = async (req, res) => {
  try {
    const { carName } = req.params;
    console.log(carName);

    const car = await CarModel.findCarByName(carName, db);
    const carId = car._id;
    // await db.collection('dealerships').updateMany(

    //   { $push: { cars: carId } }
    // );
    const dealerships = await DealershipModel.findDealershipsByCarId(carId, db);
    res.status(200).json(dealerships);
  } catch (error) {
    console.error('Error fetching dealerships with car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserVehiclesWithDealerInfo = async (req, res) => {
  try {
    const { userId } = req.user;


    const user = await UserModel.findOneById(userId, db);
    const carIds = user.vehicle_info.map(id => new ObjectId(id));

    const cars = await db.collection('cars').find({ _id: { $in: carIds } }).toArray();


    // Fetch dealer information for each vehicle
    // const vehiclesWithDealerInfo = [];
    // for (const vehicle of vehicles) {
    //   const dealer = await db.collection('dealerships').findOne({ _id: vehicle.dealershipId });
    //   const dealerInfo=dealer.dealershipInfo;
    //   vehiclesWithDealerInfo.push({ ...vehicle, dealerInfo });
    // }

    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching user vehicles with dealer info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getDealsOnCar = async (req, res) => {
  try {
    const { carName } = req.params;

    const car = await CarModel.findCarByName(carName, db);
    console.log(car)
    const deals = await db.collection('deals').find({ carId: new ObjectId(car._id) }).toArray();
    console.log(deals)
    res.status(200).json({ deals });
  } catch (error) {
    console.error('Error fetching deals on car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const buyVehicle = async (req, res) => {
  try {

    const { userId } = req.user;
    const { vehicleId } = req.params;
    

    
      // Find the vehicle by ID
      const vehicle = await db.collection('cars').findOne({ _id: new ObjectId(vehicleId) });

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      } else if (vehicle.isSold) {
        return res.status(400).json({ error: 'Vehicle is already sold' });
      }
      // Define the update data
      const updateData = {
        $set: { isSold: true }
      };

      // Update the document
      await db.collection('cars').updateOne({ _id: new ObjectId(vehicleId) }, updateData);
      try {
        // Update user document to add the vehicle to their list of owned vehicles
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },         //error
          { $push: { vehicle_info: vehicleId } }
        );
      
        // Update dealership document to remove the vehicle from their inventory
        const dealership = await db.collection('dealerships').updateOne(
          { cars: vehicleId },
          { $pull: { cars: vehicleId } }
        );
     
        // Create a new sold vehicle document
        const soldVehicle = {
          car_id: vehicleId,
          vehicle_info: vehicle.car_info
        };
        await db.collection('sold_vehicles').insertOne(soldVehicle);
            
        // Vehicle purchased successfully
        res.status(200).json({ message: 'Vehicle purchased successfully' });
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error purchasing vehicle:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
// } else if (userType.userType === 'dealership') {
//   // Get dealership name from request body
//   const { email } = req.body;
//   const vehicle = await db.collection('cars').findOne({ _id: new ObjectId(vehicleId) });

//   if (!vehicle) {
//     return res.status(404).json({ error: 'Vehicle not found' });
//   }
//   // Find user ID by name
//   const user = await db.collection('users').findOne({ user_email: email });

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   try {
//     // Remove the vehicle from dealership's inventory
//     const updateResult = await db.collection('dealerships').updateOne(
//       { _id: new ObjectId(userId) },
//       { $pull: { cars: vehicleId } }
//     );

//     if (updateResult.modifiedCount === 0) {
//       return res.status(404).json({ error: 'Vehicle not found in dealership inventory' });
//     }

//     // Add the vehicle to sold vehicles
//     const soldVehicle = {
//       car_id: vehicleId,
//       vehicle_info: vehicle
//     };
//     await db.collection('sold_vehicles').insertOne(soldVehicle);

//     // Add sold vehicle to dealership's sold vehicles
//     await db.collection('dealerships').updateOne(
//       { _id: new ObjectId(userId) },
//       { $push: { sold_vehicles: soldVehicle._id } }
//     );

//     // Create a new deal document
//     const deal = {

//       car_id: vehicleId,
//       user_id: user._id
//     };
//     await db.collection('deals').insertOne(deal);

//     // Add deal to dealership's deals
//     await db.collection('dealerships').updateOne(
//       { _id: new ObjectId(userId) },
//       { $push: { deals: deal._id } }
//     );

//     // Vehicle sold successfully
//     res.status(200).json({ message: 'Vehicle sold successfully' });
//   } catch (error) {
//     throw error;
//   }
// } else {
//   res.status(403).json({ error: 'Forbidden: Only users and dealerships can purchase vehicles' });
// }
