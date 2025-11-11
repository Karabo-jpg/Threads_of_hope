const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { verifyToken, authorize } = require('../middleware/auth');
const donationController = require('../controllers/donationController');

const router = express.Router();

// Donation validation
const donationValidation = [
  body('recipientType').isIn(['child', 'woman', 'ngo', 'program', 'general']),
  body('amount').isFloat({ min: 0.01 }),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'bank_transfer', 'mobile_money', 'paypal', 'other']),
  validate,
];

// Impact report validation
const impactReportValidation = [
  body('amountUsed').isFloat({ min: 0.01 }),
  body('category').isIn(['education', 'healthcare', 'food', 'shelter', 'clothing', 'training', 'infrastructure', 'administration', 'other']),
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  validate,
];

// Routes
router.post('/', authorize('donor'), donationValidation, donationController.createDonation);
router.get('/', verifyToken, donationController.getAllDonations);
router.get('/statistics', verifyToken, donationController.getDonationStatistics);
router.get('/recipients/:type', authorize('donor'), donationController.getRecipients);
router.get('/:id', verifyToken, donationController.getDonationById);
router.post('/:id/impact-reports', authorize('ngo', 'admin'), impactReportValidation, donationController.createImpactReport);

module.exports = router;


