// models/carModel.js

import  {db}  from '../config/db.js';
import mongodb from 'mongodb';

const { ObjectId } = mongodb;

const carCollection = 'cars';

const CarModel = {
  async findOneById(carId, db) {
    return await db.collection(carCollection).findOne({ _id:new ObjectId(carId) });
  },
  
  async insertOne(car, db) {
    
    return await db.collection(carCollection).insertOne(car);
  },

  async getAllCars() {
    
    return await db.collection(carCollection).find().toArray();
  },

  async getCarsByDealership(dealershipId) {
    
    return await db.collection(carCollection).find({ dealershipId }).toArray();
  },
  async insertMany(cars, db) { // Add insertMany function
    return await db.collection(carCollection).insertMany(cars);
  },
  async findCarByName(carName,db) {
    return await db.collection(carCollection).findOne({ name:carName });
    
  }
};

function validateCar(car) {
  // Perform validation based on schema
  // Example: Validate required fields
  if (!car.name || !car.model) {
    return { valid: false, message: 'Name and model are required fields' };
  }
  // Additional validation rules can be added here
  return { valid: true };
}

export default CarModel;
