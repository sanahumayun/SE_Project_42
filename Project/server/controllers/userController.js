const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
      const { role } = req.query;
      console.log('🔍 Role Query:', role);
  
      const query = role ? { role } : {};
      console.log('🧾 MongoDB Query:', query);
  
      const users = await User.find(query);
      console.log('📦 Fetched Users:', users);
  
      res.status(200).json(users);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };
  

module.exports = {
  getUsers,
};
