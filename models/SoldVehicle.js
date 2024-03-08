import mongodb from 'mongodb';
const { ObjectId } = mongodb;

const soldVehicleCollection = 'sold_vehicles';

const SoldVehicleModel = {
  async findOneById(vehicleId, db) {
    return await db.collection(soldVehicleCollection).findOne({ _id: ObjectId(vehicleId) });
  },
  async insertOne(soldVehicle, db) {
    const validationResult = validateSoldVehicle(soldVehicle);
    if (!validationResult.valid) {
      throw new Error(validationResult.message);
    }
    return await db.collection(soldVehicleCollection).insertOne(soldVehicle);
  },
  async insertMany(soldVehicles, db) { // Add insertMany function
    return await db.collection(soldVehicleCollection).insertMany(soldVehicles);
  }
};

function validateSoldVehicle(soldVehicle) {
  // Perform validation based on schema
  // Example: Validate required fields
  if (!soldVehicle.car_id || !soldVehicle.vehicle_info) {
    return { valid: false, message: 'Car ID and vehicle info are required fields' };
  }
  // Additional validation rules can be added here
  return { valid: true };
}

export default SoldVehicleModel;
