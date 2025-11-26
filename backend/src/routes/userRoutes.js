const express = require('express');
const { verifyToken, authorize } = require('../middleware/auth');
const { User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get users by role (accessible to admin and NGO)
router.get('/', verifyToken, authorize('admin', 'ngo'), async (req, res, next) => {
  try {
    const {
      role,
      isApproved,
      isActive,
      limit = 100,
    } = req.query;

    const where = {};

    if (role) where.role = role;
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const { rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture'],
      order: [['firstName', 'ASC']],
    });

    const users = rows.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    }));

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

