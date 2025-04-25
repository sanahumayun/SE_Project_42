const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id:   payload.id,
      role: payload.role,
      name: payload.name
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

function checkRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (req.user.role !== expectedRole) {
      return res.status(403).json({
        message: `Forbidden: requires ${expectedRole} role, you are ${req.user.role}`
      });
    }
    next();
  };
}

module.exports = { authenticate, checkRole };