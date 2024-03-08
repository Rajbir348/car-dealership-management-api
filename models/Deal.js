import mongodb from 'mongodb';
const { ObjectId } = mongodb;

const dealCollection = 'deals';

const DealModel = {
  async findOneById(dealId, db) {
    return await db.collection(dealCollection).findOne({ _id: ObjectId(dealId) });
  },
  async insertOne(deal, db) {
    // Validate the deal object against the schema before insertion
    // Implement validation logic here
    return await db.collection(dealCollection).insertOne(deal);
  },
  async insertMany(deals, db) { // Add insertMany function
    return await db.collection(dealCollection).insertMany(deals);
  }
};

export default DealModel;
