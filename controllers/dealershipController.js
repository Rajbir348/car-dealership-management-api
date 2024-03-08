// controllers/dealershipController.js
import { ObjectId } from 'mongodb';
import { db } from '../config/db.js';
import CarModel from '../models/Car.js';
import DealModel from '../models/Deal.js';
import DealershipModel from '../models/Dealership.js';

// Add cars to dealership
export const addCarToDealership = async (req, res) => {
  try {

    const { userId: dealershipId } = req.user; // Assuming dealershipId is extracted from JWT

    const carDetails = req.body;
    

    const car = { ...carDetails, dealershipId };
    


    const newCar = await CarModel.insertOne(car, db);  //add car to cars collection
    
    await DealershipModel.addCarToDealership(newCar.insertedId, dealershipId, db);//add car to dealership
    res.status(201).json({ message: 'Car added to dealership successfully' });
  } catch (error) {
    console.error('Error adding car to dealership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add deals to dealership
export const addDealToDealership = async (req, res) => {
  try {

    const { userId: dealershipId } = req.user; // Assuming dealershipId is extracted from JWT
    const dealDetails = req.body;
    const deal = { ...dealDetails, dealershipId };

    const newDeal = await DealModel.insertOne(deal, db);//add deal to deals collection
    await DealershipModel.addDealToDealership(newDeal.insertedId, dealershipId, db);//add deal to dealership
    res.status(201).json({ message: 'Deal added to dealership successfully' });
  } catch (error) {
    console.error('Error adding deal to dealership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const getSoldVehiclesWithOwnerInfo = async (req, res) => {
  try {

    const { userId: dealershipId } = req.user; // Assuming dealership ID is available in req.user

    
    // Get all sold vehicles of the dealership
    const soldVehicles = await db.collection('sold_vehicles').find({ dealershipId: new ObjectId(dealershipId) }).toArray();
    
    // Fetch owner information for each sold vehicle
    const soldVehiclesWithOwnerInfo = [];
    for (const soldVehicle of soldVehicles) {
      const ownerInfo = await db.collection('users').findOne({ _id: soldVehicle.userId });
      soldVehiclesWithOwnerInfo.push({ ...soldVehicle, ownerInfo });
    }

    res.status(200).json( soldVehiclesWithOwnerInfo );
  } catch (error) {
    console.error('Error fetching sold vehicles with owner info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getInventory = async (req, res) => {
  const dealershipId=req.user.userId
  

  const dealership= await DealershipModel.findOneById(dealershipId, db);
  
  const carIds = dealership.cars.map(id => new ObjectId(id));
  const cars = await db.collection('cars').find({ _id: { $in: carIds } }).toArray();
  res.status(200).json(cars);
}
export const editCar = async (req, res) => {
  
try {
    const car = req.body;
  
    const result = await db.collection('cars').updateOne(
      { _id: new ObjectId(car._id) }, // Filter for the document to update
      { $set: { name: car.name, model: car.model, type: car.type, color: car.color, price: car.price } } // Update fields other than _id
    );
    
    res.status(200).json(result);
} catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
}

export const deleteCar = async (req, res) => {
  
  try {
      const {carId} = req.params;
      
      const result = await db.collection('cars').deleteOne(
        { _id: new ObjectId(carId) }
      )
      console.log(result);
      if(result.deletedCount === 0) {
        return res.status(404).json({ error: 'Car not found' });
      }else{
        console.log('Car deleted successfully',carId);
      }
      res.status(200).json(result);
  } catch (error) {
      console.error('Error deleting car:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    
  }