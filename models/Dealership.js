// dealershipModel.js

import { ObjectId } from 'mongodb';
import faker from 'faker';

const dealershipCollection = 'dealerships';

const DealershipModel = {
  async findOneByEmail(email, db) {
    return await db.collection(dealershipCollection).findOne({ dealership_email: email });
  },
  async findOneById(dealershipId, db) {
    return await db.collection(dealershipCollection).findOne({ _id: new ObjectId(dealershipId) });
  },
  async insertOne(dealership, db) {
    const validationResult = validateDealership(dealership);
    if (!validationResult.valid) {
      throw new Error(validationResult.message);
    }
    return await db.collection(dealershipCollection).insertOne(dealership);
  },
  async insertMany(dealerships, db) {
    // Validate each dealership before inserting
    dealerships.forEach(dealership => {
      const validationResult = validateDealership(dealership);
      if (!validationResult.valid) {
        throw new Error(validationResult.message);
      }
    });

    return await db.collection(dealershipCollection).insertMany(dealerships);
  },
  async findDealershipsByCarId(carId, db) {
    
    return await db.collection(dealershipCollection).aggregate([
      {
        $match: {
          'cars':carId.toString() // Assuming 'cars' field is an array of carIds
        }
      }
    ]).toArray();
    
  },
  async addCarToDealership(carId, dealershipId, db) {
     await db.collection(dealershipCollection).updateOne(
      { _id: new ObjectId(dealershipId) }, // Filter to find the document to update
      { $push: { cars: carId.toString() } } // Update to push the new carId to the 'cars' array
    );
    
    
  },
  async addDealToDealership(dealId, dealershipId, db) {
    await db.collection(dealershipCollection).aggregate([
      { $match:{
        '_id':new ObjectId(dealershipId)
      },
        $push: {
          'deals':dealId.toString() 
        }
      }
    ])
  }
};

function validateDealership(dealership) {
  // Perform validation based on schema
  // if (!dealership.dealership_email || !isValidEmail(dealership.dealership_email)) {
  //   return { valid: false, message: 'Invalid email address' };
  // }
  // Additional validation rules can be added here
  return { valid: true };
}

function isValidEmail(email) {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default DealershipModel;
