// utils/populateData.js

import faker from "faker";
import connectDB from "../config/db.js";
import UserModel from '../models/User.js';
import DealershipModel from '../models/Dealership.js';
import CarModel from '../models/Car.js';
import DealModel from '../models/Deal.js';
import SoldVehicleModel from '../models/SoldVehicle.js';

const NUM_USERS = 10;
const NUM_DEALERSHIPS = 5;
const NUM_CARS = 20;
const NUM_DEALS = 30;
const NUM_SOLD_VEHICLES = 50;

const populateData = async () => {
  try {
    const db = await connectDB();

    // Populate users
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const newUser = {
        email: generateValidEmail(),
        location: faker.address.city(),
        userInfo: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          phone: faker.phone.phoneNumber(),
        },
        password: faker.internet.password(),
        vehicleInfo: [],
      };
      users.push(newUser);
    }
    await UserModel.insertMany(users, db);

    // Populate dealerships
    const dealerships = [];
    for (let i = 0; i < NUM_DEALERSHIPS; i++) {
      const newDealership = {
        email: generateValidEmail(),
        name: faker.company.companyName(),
        location: faker.address.city(),
        password: faker.internet.password(),
        dealershipInfo: {
          website: faker.internet.url(),
          phoneNumber: faker.phone.phoneNumber(),
        },
        cars: [],
        deals: [],
        soldVehicles: [],
      };
      dealerships.push(newDealership);
    }
    await DealershipModel.insertMany(dealerships, db);

    // Populate cars
    const cars = [];
    for (let i = 0; i < NUM_CARS; i++) {
      const newCar = {
        type: faker.vehicle.type(),
        name: faker.vehicle.model(),
        model: faker.random.number({ min: 1990, max: 2022 }).toString(), // Generate a random year between 1990 and 2022
        carInfo: {
          color: faker.commerce.color(), // Use Faker's color method to generate a random color
          price: faker.random.number({ min: 10000, max: 50000 }),
        },
      };
      cars.push(newCar);
    }

    await CarModel.insertMany(cars, db); // Insert cars into the database

    // Populate deals
    const deals = [];
    for (let i = 0; i < NUM_DEALS; i++) {
      const newDeal = {
        carId: faker.random.arrayElement(cars)._id,
        dealInfo: {
          discount: faker.random.number({ min: 5, max: 20 }),
          duration: faker.random.number({ min: 1, max: 5 }),
        },
      };
      deals.push(newDeal);
    }
    await DealModel.insertMany(deals, db);

    // Populate sold vehicles
    const soldVehicles = [];
    for (let i = 0; i < NUM_SOLD_VEHICLES; i++) {
      const newSoldVehicle = {
        carId: faker.random.arrayElement(cars)._id,
        dealershipId: faker.random.arrayElement(dealerships)._id,
        userId: faker.random.arrayElement(users)._id,
        vehicleInfo: {
          registrationDate: faker.date.past(),
          mileage: faker.random.number({ min: 1000, max: 50000 }),
        },
      };
      soldVehicles.push(newSoldVehicle);
    }
    await SoldVehicleModel.insertMany(soldVehicles, db);

    console.log('Data populated successfully!');
  } catch (error) {
    console.error('Error populating data:', error);
  }
};

// Function to generate valid email addresses
function generateValidEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let email = faker.internet.email();
  while (!emailRegex.test(email)) {
    email = faker.internet.email();
  }
  return email;
}

export default populateData;
