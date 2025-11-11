const { CollaborationRequest, Resource, User } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');

// Create collaboration request
exports.createCollaborationRequest = async (req, res, next) => {
  try {
    const collaboration = await CollaborationRequest.create({
      ...req.body,
      requesterId: req.user.id,
    });

    // Notify recipient if specified
    if (req.body.recipientId) {
      await createNotification(
        req.body.recipientId,
        'collaboration_invite',
        'New Collaboration Invitation',
        `${req.user.firstName} invited you to collaborate on: ${req.body.title}`,
        {
          relatedTo: collaboration.id,
          relatedType: 'collaboration',
          actionUrl: `/collaboration/${collaboration.id}`,
          deliveryChannels: ['in_app', 'email'],
        }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Collaboration request created successfully',
      data: collaboration,
    });
  } catch (error) {
    next(error);
  }
};

// Get all collaboration requests
exports.getAllCollaborations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      visibility,
    } = req.query;

    const where = {};

    if (type) where.collaborationType = type;
    if (status) where.status = status;

    // Filter by visibility and user access
    if (req.user.role === 'ngo') {
      where[Op.or] = [
        { visibility: 'public' },
        { requesterId: req.user.id },
        { recipientId: req.user.id },
      ];
    } else if (req.user.role === 'admin') {
      if (visibility) where.visibility = visibility;
    } else {
      where.visibility = 'public';
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await CollaborationRequest.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        collaborations: rows,
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

// Get single collaboration
exports.getCollaborationById = async (req, res, next) => {
  try {
    const collaboration = await CollaborationRequest.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'requester',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found',
      });
    }

    // Check access
    if (
      collaboration.visibility === 'private' &&
      req.user.role !== 'admin' &&
      collaboration.requesterId !== req.user.id &&
      collaboration.recipientId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: collaboration,
    });
  } catch (error) {
    next(error);
  }
};

// Update collaboration
exports.updateCollaboration = async (req, res, next) => {
  try {
    const collaboration = await CollaborationRequest.findByPk(req.params.id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found',
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && collaboration.requesterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await collaboration.update(req.body);

    res.json({
      success: true,
      message: 'Collaboration updated successfully',
      data: collaboration,
    });
  } catch (error) {
    next(error);
  }
};

// Respond to collaboration
exports.respondToCollaboration = async (req, res, next) => {
  try {
    const { response, message } = req.body;

    const collaboration = await CollaborationRequest.findByPk(req.params.id, {
      include: [{ model: User, as: 'requester' }],
    });

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found',
      });
    }

    await collaboration.increment('responses');

    // Notify requester
    await createNotification(
      collaboration.requesterId,
      'collaboration_response',
      'New Collaboration Response',
      `${req.user.firstName} responded to your collaboration request: ${collaboration.title}`,
      {
        relatedTo: collaboration.id,
        relatedType: 'collaboration',
        actionUrl: `/collaboration/${collaboration.id}`,
        deliveryChannels: ['in_app', 'email'],
        metadata: { response, message },
      }
    );

    res.json({
      success: true,
      message: 'Response submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Create resource
exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create({
      ...req.body,
      createdBy: req.user.id,
      publishedAt: req.body.isActive ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// Get all resources
exports.getAllResources = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      search,
    } = req.query;

    const where = { isActive: true };

    if (type) where.resourceType = type;
    if (category) where.category = category;

    // Filter by access level
    if (req.user.role === 'woman') {
      where.accessLevel = { [Op.in]: ['public', 'verified_users'] };
    } else if (req.user.role === 'ngo' || req.user.role === 'donor') {
      where.accessLevel = { [Op.in]: ['public', 'verified_users', 'ngo_only'] };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Resource.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        resources: rows,
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

// Get single resource
exports.getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check access
    const canAccess =
      resource.accessLevel === 'public' ||
      (resource.accessLevel === 'verified_users' && req.user) ||
      (resource.accessLevel === 'ngo_only' && ['ngo', 'admin'].includes(req.user.role)) ||
      (resource.accessLevel === 'private' && (resource.createdBy === req.user.id || req.user.role === 'admin'));

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Increment views
    await resource.increment('views');

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

// Download resource
exports.downloadResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByPk(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Increment downloads
    await resource.increment('downloads');

    res.json({
      success: true,
      data: {
        downloadUrl: resource.fileUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};


