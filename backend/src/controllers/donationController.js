const { Donation, ImpactReport, User, Child, TrainingProgram } = require('../models');
const { Op } = require('sequelize');
const { createNotification } = require('../services/notificationService');
const { sendDonationReceiptEmail } = require('../services/emailService');

// Create donation
exports.createDonation = async (req, res, next) => {
  try {
    const {
      recipientType,
      recipientId,
      ngoId,
      amount,
      currency,
      paymentMethod,
      purpose,
      message,
      isAnonymous,
      isRecurring,
      recurringFrequency,
    } = req.body;

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const donation = await Donation.create({
      donorId: req.user.id,
      recipientType,
      recipientId,
      ngoId,
      amount,
      currency: currency || 'USD',
      paymentMethod,
      transactionId,
      paymentStatus: 'completed', // In real app, this would be pending until payment processor confirms
      purpose,
      message,
      isAnonymous: isAnonymous || false,
      isRecurring: isRecurring || false,
      recurringFrequency,
      remainingAmount: amount,
    });

    // Send receipt
    await donation.update({
      receiptIssued: true,
      receiptUrl: `/receipts/${donation.id}`,
    });

    await sendDonationReceiptEmail(req.user, donation);

    // Notify NGO
    if (ngoId) {
      await createNotification(
        ngoId,
        'donation_received',
        'New Donation Received',
        `You received a donation of ${currency} ${amount} from ${isAnonymous ? 'Anonymous' : req.user.firstName}`,
        {
          relatedTo: donation.id,
          relatedType: 'donation',
          actionUrl: `/donations/${donation.id}`,
          deliveryChannels: ['in_app', 'email'],
        }
      );
    }

    // Notify donor
    await createNotification(
      req.user.id,
      'donation_received',
      'Thank You for Your Donation',
      `Your donation of ${currency} ${amount} has been received successfully`,
      {
        relatedTo: donation.id,
        relatedType: 'donation',
        actionUrl: `/donations/${donation.id}`,
        deliveryChannels: ['in_app'],
      }
    );

    res.status(201).json({
      success: true,
      message: 'Donation successful. Thank you for your generosity!',
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// Get all donations
exports.getAllDonations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      recipientType,
      paymentStatus,
    } = req.query;

    const where = {};

    // Filter based on user role
    if (req.user.role === 'donor') {
      where.donorId = req.user.id;
    } else if (req.user.role === 'ngo') {
      where.ngoId = req.user.id;
    }

    if (recipientType) where.recipientType = recipientType;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const offset = (page - 1) * limit;

    const { count, rows } = await Donation.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['donationDate', 'DESC']],
    });

    // Hide donor info if anonymous (for NGOs)
    const sanitizedRows = rows.map(donation => {
      const data = donation.toJSON();
      if (data.isAnonymous && req.user.role !== 'admin' && req.user.id !== data.donorId) {
        data.donor = { firstName: 'Anonymous', lastName: 'Donor' };
      }
      return data;
    });

    res.json({
      success: true,
      data: {
        donations: sanitizedRows,
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

// Get single donation
exports.getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'donor',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: ImpactReport,
          as: 'impactReports',
          order: [['reportDate', 'DESC']],
        },
      ],
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Check access
    if (
      req.user.role !== 'admin' &&
      donation.donorId !== req.user.id &&
      donation.ngoId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const data = donation.toJSON();
    if (data.isAnonymous && req.user.role !== 'admin' && req.user.id !== data.donorId) {
      data.donor = { firstName: 'Anonymous', lastName: 'Donor' };
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Create impact report
exports.createImpactReport = async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && donation.ngoId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiving NGO can create impact reports',
      });
    }

    const { amountUsed } = req.body;

    // Validate amount
    if (amountUsed > donation.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: 'Amount used exceeds remaining donation amount',
      });
    }

    const report = await ImpactReport.create({
      ...req.body,
      donationId: donation.id,
      reportedBy: req.user.id,
    });

    // Update donation allocated amount
    await donation.update({
      allocatedAmount: parseFloat(donation.allocatedAmount) + parseFloat(amountUsed),
      remainingAmount: parseFloat(donation.remainingAmount) - parseFloat(amountUsed),
      impactReported: true,
      lastImpactReportDate: new Date(),
    });

    // Notify donor
    await createNotification(
      donation.donorId,
      'impact_report',
      'New Impact Report Available',
      `A new impact report has been submitted for your donation`,
      {
        relatedTo: report.id,
        relatedType: 'impact_report',
        actionUrl: `/donations/${donation.id}`,
        deliveryChannels: ['in_app', 'email'],
      }
    );

    res.status(201).json({
      success: true,
      message: 'Impact report created successfully',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// Get donation statistics
exports.getDonationStatistics = async (req, res, next) => {
  try {
    const where = {};

    // Filter based on role
    if (req.user.role === 'donor') {
      where.donorId = req.user.id;
    } else if (req.user.role === 'ngo') {
      where.ngoId = req.user.id;
    }

    const totalDonations = await Donation.sum('amount', { where });
    const totalAllocated = await Donation.sum('allocatedAmount', { where });
    const totalRemaining = await Donation.sum('remainingAmount', { where });

    const donationCount = await Donation.count({ where });

    const byRecipientType = await Donation.findAll({
      where,
      attributes: [
        'recipientType',
        [Donation.sequelize.fn('COUNT', Donation.sequelize.col('id')), 'count'],
        [Donation.sequelize.fn('SUM', Donation.sequelize.col('amount')), 'total'],
      ],
      group: ['recipientType'],
      raw: true,
    });

    const byMonth = await Donation.sequelize.query(`
      SELECT 
        TO_CHAR("donationDate", 'YYYY-MM') as month,
        COUNT(*) as count,
        SUM(amount) as total
      FROM donations
      WHERE "donationDate" >= NOW() - INTERVAL '12 months'
        ${req.user.role === 'donor' ? `AND "donorId" = '${req.user.id}'` : ''}
        ${req.user.role === 'ngo' ? `AND "ngoId" = '${req.user.id}'` : ''}
      GROUP BY month
      ORDER BY month DESC
    `, { type: Donation.sequelize.QueryTypes.SELECT });

    const impactReportsCount = await ImpactReport.count({
      include: [
        {
          model: Donation,
          as: 'donation',
          where,
          attributes: [],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        totalDonations: totalDonations || 0,
        totalAllocated: totalAllocated || 0,
        totalRemaining: totalRemaining || 0,
        donationCount,
        impactReportsCount,
        byRecipientType,
        byMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get available recipients for donation
exports.getRecipients = async (req, res, next) => {
  try {
    const { type } = req.params;

    let data = [];

    switch (type) {
      case 'child':
        data = await Child.findAll({
          where: { isActive: true },
          attributes: ['id', 'firstName', 'lastName', 'currentStatus', 'profilePhoto'],
          limit: 50,
        });
        break;

      case 'woman':
        data = await User.findAll({
          where: { role: 'woman', isActive: true, isApproved: true },
          attributes: ['id', 'firstName', 'lastName', 'profilePicture'],
          limit: 50,
        });
        break;

      case 'ngo':
        data = await User.findAll({
          where: { role: 'ngo', isActive: true, isApproved: true },
          attributes: ['id', 'firstName', 'lastName'],
          limit: 50,
        });
        break;

      case 'program':
        data = await TrainingProgram.findAll({
          where: { status: 'active' },
          attributes: ['id', 'title', 'category', 'cost'],
          limit: 50,
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid recipient type',
        });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Get message recipients for donors (admins and NGOs they've donated to)
exports.getMessageRecipients = async (req, res, next) => {
  try {
    // Get all admins
    const admins = await User.findAll({
      where: { role: 'admin', isActive: true, isApproved: true },
      attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture'],
    });

    // Get all NGOs
    const allNGOs = await User.findAll({
      where: { role: 'ngo', isActive: true, isApproved: true },
      attributes: ['id', 'firstName', 'lastName', 'email', 'profilePicture'],
    });

    // Get NGOs the donor has donated to
    const donations = await Donation.findAll({
      where: { donorId: req.user.id },
      attributes: ['ngoId'],
      group: ['ngoId'],
      raw: true,
    });

    const donatedNGOIds = donations
      .map(d => d.ngoId)
      .filter(id => id !== null);

    // Mark NGOs that have received donations
    const ngoMap = new Map();
    allNGOs.forEach(ngo => {
      ngoMap.set(ngo.id, {
        ...ngo.toJSON(),
        hasDonated: donatedNGOIds.includes(ngo.id),
      });
    });

    // Sort: NGOs with donations first, then others
    const sortedNGOs = Array.from(ngoMap.values()).sort((a, b) => {
      if (a.hasDonated && !b.hasDonated) return -1;
      if (!a.hasDonated && b.hasDonated) return 1;
      return 0;
    });

    res.json({
      success: true,
      data: {
        admins: admins.map(a => a.toJSON()),
        ngos: sortedNGOs,
      },
    });
  } catch (error) {
    next(error);
  }
};


