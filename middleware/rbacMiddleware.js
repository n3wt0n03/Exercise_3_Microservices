const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(404).json({ message: 'User not authenticated' });
      }

      const userRole = req.user.role;

      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error checking user role', error: error.message });
    }
  };
};

module.exports = checkRole;