import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../models/blacklistJwt.js';

const appendRequestData = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(req)
    console.log(token);
    // Check if the token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user=decodedToken;
    next();
    // Verify the JWT and extract user information
    // jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    //   if (err) {
    //     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    //   } else {
    //     // Attach user information to req.user
    //     req.user = decodedToken;

    //     next();
    //   }
    // });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default appendRequestData;
