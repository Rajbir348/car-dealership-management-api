import bcrypt from 'bcryptjs';
import {db} from '../config/db.js';

import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';
import DealershipModel from '../models/Dealership.js';
import AdminModel from '../models/Admin.js';
import generateTokenAndSetCookie from '../utils/token.js';
import { addToBlacklist } from '../models/blacklistJwt.js';

const loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
       

        // Check if admin exists
        const admin = await AdminModel.findOneByEmail(email, db);
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate access token
        const token=generateTokenAndSetCookie(admin._id, res,{userType:'admin'});


        return res.status(200).json({message:' Admin Login successful',token}); // Send success response
        
    }catch{
        return res.status(500).json({ error: 'Internal Server Error' });
    } 
};

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    
    try {
      
  
      // Check if user exists
      const user = await UserModel.findOneByEmail(email, db);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate access token
      const token= generateTokenAndSetCookie(user._id, res,{userType:'user'});

  
      return res.status(200).json({message:' User Login successful',token}); // Make sure to return the response
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    } 
  };
  
  const loginDealership = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
    
    try {
      
  
      // Check if dealership exists
      const dealership = await DealershipModel.findOneByEmail(email, db);
      if (!dealership) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const validPassword = await bcrypt.compare(password, dealership.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate access token
      const token=generateTokenAndSetCookie(dealership._id, res,{userType:'dealership'});

  
      return res.status(200).json({message:" Dealership Login Successful",token}); // Make sure to return the response
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    } 
  };



const userSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, location, userInfo } = req.body;
    

    try {
        // Check if user with the same email already exists
        const existingUser = await UserModel.findOneByEmail(email, db);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user object
        const newUser = {
            user_email: email,
            password: hashedPassword,
            user_location: location,
            user_info: userInfo,
            vehicle_info: [] // Initial value for vehicle_info, assuming it's an array
        };

        // Insert new user into database
        const result = await UserModel.insertOne(newUser, db);

        // Generate access token
        const token=generateTokenAndSetCookie(result._id, res,{userType:'user'});



        res.status(201).json({ message: 'User created successfully' , token});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } 
};

const dealershipSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, location, dealershipInfo } = req.body;
    

    try {
        // Check if dealership with the same email already exists
        const existingDealership = await DealershipModel.findOneByEmail(email, db);
        if (existingDealership) {
            return res.status(400).json({ message: 'Dealership already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new dealership object
        const newDealership = {
            dealership_email: email,
            password: hashedPassword,
            dealership_name: name,
            dealership_location: location,
            dealership_info: dealershipInfo,
            cars: [], // Initial value for cars, assuming it's an array
            deals: [], // Initial value for deals, assuming it's an array
            sold_vehicles: [] // Initial value for sold_vehicles, assuming it's an array
        };

        // Insert new dealership into database
        const result = await DealershipModel.insertOne(newDealership, db);

        const token=generateTokenAndSetCookie(result._id, res,{userType:'dealership'});


        res.status(201).json({ message: 'Dealership created successfully', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } 
};

// logoutController.js



const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    // Add the token to the blacklist
    await addToBlacklist(token);

    // Clear the JWT cookie on the client side
    res.clearCookie('jwt');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export { loginUser, loginAdmin, userSignup, dealershipSignup, loginDealership, logout };
