import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../models/blacklistJwt.js';

const jwtValidation = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    // Check if the token is blacklisted
    // const isBlacklisted = await isTokenBlacklisted(token);
    // if (isBlacklisted) {
    //   return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    // }

    // Verify the JWT and extract user information
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      } else {
        // Attach user information to req.user
        req.user = decodedToken;
     
        // Check user type and restrict access based on it
        if (req.originalUrl.startsWith('/api/users') && req.user.userType.userType !== 'user') {
          return res.status(403).json({ message: 'Forbidden: Only users can access this route' });
        } else if (req.originalUrl.startsWith('/api/dealerships') && req.user.userType.userType !== 'dealership') {
          return res.status(403).json({ message: 'Forbidden: Only dealerships can access this route' });
        }

        next();
      }
    });
  } catch (error) {
    console.error('Error checking JWT validity:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default jwtValidation;
