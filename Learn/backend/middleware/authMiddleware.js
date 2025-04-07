const jwt = require('jsonwebtoken');

// 1) Verify JWT
exports.protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  // Format: "Bearer <token>"
  token = token.split(' ')[1]; // remove "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // e.g., decoded = { userId, role, iat, exp }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// 2) Universal role check: pass an array of allowed roles
exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// 3) Convenience: admin only
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
};

// 4) Convenience: tutor only
exports.tutorOnly = (req, res, next) => {
  if (req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Access denied, tutor only' });
  }
  next();
};
