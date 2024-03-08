// userModel.js

import { ObjectId } from 'mongodb';

const userCollection = 'users';

const UserModel = {
  async findOneByEmail(email, db) {
    return await db.collection(userCollection).findOne({ user_email: email });
  },
  async findOneById(userId, db) {
    
    return await db.collection(userCollection).findOne({ _id: new ObjectId(userId )});
  },
  async insertOne(user, db) {
    const validationResult = validateUser(user);
    if (!validationResult.valid) {
      throw new Error(validationResult.message);
    }
    return await db.collection(userCollection).insertOne(user);
  },
  async insertMany(users, db) {
    // Validate each user before inserting
    users.forEach(user => {
      const validationResult = validateUser(user);
      if (!validationResult.valid) {
        throw new Error(validationResult.message);
      }
    });

    return await db.collection(userCollection).insertMany(users);
  }
};

function validateUser(user) {
  // Perform validation based on schema
  // if (!user.user_email || !isValidEmail(user.user_email)) {
  //   return { valid: false, message: 'Invalid email address' };
  // }
  if (!user.password || user.password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  // Additional validation rules can be added here
  return { valid: true };
}

function isValidEmail(email) {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default UserModel;
