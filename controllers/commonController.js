// controllers/commonController.js

import DealershipModel from '../models/Dealership.js';
import { db } from '../config/db.js';
import { ObjectId } from 'mongodb';
export const getAllCars = async (req, res) => {
  try {

    const cars = await db.collection('cars').find({ $or: [{ isSold: { $exists: false } }, { isSold: false }] }).toArray();

    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching all cars:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCarsInDealership = async (req, res) => {
  try {
    const { dealershipId } = req.params;

    const dealership = await DealershipModel.findOneById(dealershipId, db);
    if (!dealership) {
      return res.status(404).json({ error: 'Dealership not found' });
    }

    const carIds = dealership.cars.map(id => new ObjectId(id))
    const cars = await db.collection('cars').find({ _id: { $in: carIds } }).toArray();

    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars in dealership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllDealerships = async (req, res) => {
  try {
    const allDealerships = await db.collection('dealerships').find({}, { password: 0 }).toArray();
    res.status(200).json(allDealerships);
  } catch (error) {
    console.error('Error fetching all dealerships:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




export const getAllDeals = async (req, res) => {
  try {
    const { dealershipId } = req.params;

    const deals = await db.collection('deals').find({ dealershipId }).toArray();
    res.status(200).json({ deals });
  } catch (error) {
    console.error('Error fetching all deals from dealership:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
