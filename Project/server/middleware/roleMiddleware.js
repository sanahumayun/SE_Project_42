const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).json({ msg: "You do not have permission to access this resource." });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  