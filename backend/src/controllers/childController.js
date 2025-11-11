const { Child, ChildEvent, User } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');

// Register a new child
exports.registerChild = async (req, res, next) => {
  try {
    // Generate unique case number
    const caseNumber = `CH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const child = await Child.create({
      ...req.body,
      registeredBy: req.user.id,
      caseNumber,
    });

    res.status(201).json({
      success: true,
      message: 'Child registered successfully',
      data: child,
    });
  } catch (error) {
    next(error);
  }
};

// Get all children (with filters)
exports.getAllChildren = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      registeredBy,
    } = req.query;

    const where = { isActive: true };

    // Filter by status
    if (status) {
      where.currentStatus = status;
    }

    // Filter by NGO (for admin) or own children (for NGO)
    if (req.user.role === 'ngo') {
      where.registeredBy = req.user.id;
    } else if (registeredBy && req.user.role === 'admin') {
      where.registeredBy = registeredBy;
    }

    // Search by name or case number
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { caseNumber: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Child.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'registrar',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        children: rows,
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

// Get single child by ID
exports.getChildById = async (req, res, next) => {
  try {
    const child = await Child.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'registrar',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: ChildEvent,
          as: 'events',
          order: [['eventDate', 'DESC']],
          limit: 10,
        },
      ],
    });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check access permissions
    if (req.user.role === 'ngo' && child.registeredBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: child,
    });
  } catch (error) {
    next(error);
  }
};

// Update child information
exports.updateChild = async (req, res, next) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check permissions
    if (req.user.role === 'ngo' && child.registeredBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await child.update(req.body);

    // Log the update as an event
    await ChildEvent.create({
      childId: child.id,
      recordedBy: req.user.id,
      eventType: 'status_update',
      eventDate: new Date(),
      title: 'Child Record Updated',
      description: 'Child information was updated by ' + req.user.firstName,
    });

    res.json({
      success: true,
      message: 'Child information updated successfully',
      data: child,
    });
  } catch (error) {
    next(error);
  }
};

// Delete (archive) child
exports.deleteChild = async (req, res, next) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check permissions
    if (req.user.role === 'ngo' && child.registeredBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await child.update({
      isActive: false,
      archivedAt: new Date(),
      archivedReason: req.body.reason || 'Archived by user',
    });

    res.json({
      success: true,
      message: 'Child record archived successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Add child event
exports.addChildEvent = async (req, res, next) => {
  try {
    const child = await Child.findByPk(req.params.id);

    if (!child) {
      return res.status(404).json({
        success: false,
        message: 'Child not found',
      });
    }

    // Check permissions
    if (req.user.role === 'ngo' && child.registeredBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const event = await ChildEvent.create({
      ...req.body,
      childId: child.id,
      recordedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Event recorded successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Get child events
exports.getChildEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const where = { childId: req.params.id };

    if (type) {
      where.eventType = type;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await ChildEvent.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'recorder',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['eventDate', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        events: rows,
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

// Get child statistics
exports.getChildStatistics = async (req, res, next) => {
  try {
    const where = { isActive: true };

    // Filter by NGO if not admin
    if (req.user.role === 'ngo') {
      where.registeredBy = req.user.id;
    }

    const totalChildren = await Child.count({ where });

    const byStatus = await Child.findAll({
      where,
      attributes: [
        'currentStatus',
        [Child.sequelize.fn('COUNT', Child.sequelize.col('id')), 'count'],
      ],
      group: ['currentStatus'],
      raw: true,
    });

    const byAge = await Child.sequelize.query(`
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) < 5 THEN '0-4'
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 5 AND 12 THEN '5-12'
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 13 AND 17 THEN '13-17'
          ELSE '18+'
        END as age_group,
        COUNT(*) as count
      FROM children
      WHERE is_active = true ${req.user.role === 'ngo' ? `AND registered_by = '${req.user.id}'` : ''}
      GROUP BY age_group
    `, { type: Child.sequelize.QueryTypes.SELECT });

    const byGender = await Child.findAll({
      where,
      attributes: [
        'gender',
        [Child.sequelize.fn('COUNT', Child.sequelize.col('id')), 'count'],
      ],
      group: ['gender'],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        totalChildren,
        byStatus,
        byAge,
        byGender,
      },
    });
  } catch (error) {
    next(error);
  }
};


