const { User, NGOProfile, Child, Donation, TrainingProgram, Enrollment, AuditLog } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    // User statistics
    const totalUsers = await User.count();
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count'],
      ],
      group: ['role'],
      raw: true,
    });

    const pendingApprovals = await User.count({ where: { isApproved: false } });

    // Children statistics
    const totalChildren = await Child.count({ where: { isActive: true } });
    const childrenByStatus = await Child.findAll({
      where: { isActive: true },
      attributes: [
        'currentStatus',
        [Child.sequelize.fn('COUNT', Child.sequelize.col('id')), 'count'],
      ],
      group: ['currentStatus'],
      raw: true,
    });

    // Donation statistics
    const totalDonations = await Donation.sum('amount') || 0;
    const donationCount = await Donation.count();
    const allocatedAmount = await Donation.sum('allocatedAmount') || 0;

    // Training statistics
    const activePrograms = await TrainingProgram.count({ where: { status: 'active' } });
    const totalEnrollments = await Enrollment.count();
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });

    // Recent activities (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });
    const recentDonations = await Donation.count({ where: { donationDate: { [Op.gte]: thirtyDaysAgo } } });
    const recentChildren = await Child.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });

    // Growth trends (last 12 months)
    const growthData = await User.sequelize.query(`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(*) as new_users
      FROM users
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month DESC
    `, { type: User.sequelize.QueryTypes.SELECT });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          pendingApprovals,
          recent: recentUsers,
        },
        children: {
          total: totalChildren,
          byStatus: childrenByStatus,
          recent: recentChildren,
        },
        donations: {
          total: totalDonations,
          count: donationCount,
          allocated: allocatedAmount,
          remaining: totalDonations - allocatedAmount,
          recent: recentDonations,
        },
        training: {
          activePrograms,
          totalEnrollments,
          completedEnrollments,
          completionRate: totalEnrollments > 0 ? ((completedEnrollments / totalEnrollments) * 100).toFixed(2) : 0,
        },
        growth: growthData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      isApproved,
      isActive,
      search,
    } = req.query;

    const where = {};

    if (role) where.role = role;
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: NGOProfile,
          as: 'ngoProfile',
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const sanitizedRows = rows.map(user => user.getPublicProfile());

    res.json({
      success: true,
      data: {
        users: sanitizedRows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Approve/reject user
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { isApproved, isActive, reason } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updates = {};
    if (isApproved !== undefined) updates.isApproved = isApproved;
    if (isActive !== undefined) updates.isActive = isActive;

    await user.update(updates);

    // Send notification
    let notifTitle = '';
    let notifMessage = '';

    if (isApproved !== undefined) {
      notifTitle = isApproved ? 'Account Approved' : 'Account Rejected';
      notifMessage = isApproved
        ? 'Your account has been approved. You can now access all features.'
        : `Your account application was not approved. ${reason || ''}`;
    } else if (isActive !== undefined) {
      notifTitle = isActive ? 'Account Activated' : 'Account Deactivated';
      notifMessage = isActive
        ? 'Your account has been reactivated.'
        : `Your account has been deactivated. ${reason || ''}`;
    }

    await createNotification(
      user.id,
      isApproved ? 'user_approved' : 'user_rejected',
      notifTitle,
      notifMessage,
      {
        deliveryChannels: ['in_app', 'email'],
      }
    );

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

// Get audit logs
exports.getAuditLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      entityType,
      userId,
      startDate,
      endDate,
    } = req.query;

    const where = {};

    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        logs: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Export data
exports.exportData = async (req, res, next) => {
  try {
    const { type, format = 'json' } = req.query;

    let data = [];

    switch (type) {
      case 'users':
        data = await User.findAll({
          attributes: { exclude: ['password', 'twoFactorSecret', 'resetPasswordToken'] },
        });
        break;

      case 'children':
        data = await Child.findAll({ where: { isActive: true } });
        break;

      case 'donations':
        data = await Donation.findAll();
        break;

      case 'programs':
        data = await TrainingProgram.findAll();
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type',
        });
    }

    if (format === 'json') {
      res.json({
        success: true,
        data,
      });
    } else if (format === 'csv') {
      // CSV export would use csv-writer here
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_export.csv`);
      // Implement CSV conversion
      res.send('CSV export not yet implemented');
    }
  } catch (error) {
    next(error);
  }
};

// Get system health
exports.getSystemHealth = async (req, res, next) => {
  try {
    const dbHealth = await User.sequelize.authenticate()
      .then(() => true)
      .catch(() => false);

    const uptime = process.uptime();
    const memory = process.memoryUsage();

    res.json({
      success: true,
      data: {
        status: dbHealth ? 'healthy' : 'unhealthy',
        database: dbHealth ? 'connected' : 'disconnected',
        uptime: `${Math.floor(uptime / 3600)} hours`,
        memory: {
          used: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
        },
        timestamp: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};


