const jwt = require('jsonwebtoken');  


const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  console.log("Authorization Header:", req.header('Authorization')); 

  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user info:", decoded);  
    req.user = {  
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.error("Error decoding token:", err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  console.log("Inside checkRole middleware");
  console.log("User object in checkRole:", req.user);  

  if (!roles.includes(req.user.role)) {
    console.error("Access denied. User role:", req.user.role);
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};

module.exports = { authenticate, checkRole };
