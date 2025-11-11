const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { authorize } = require('../middleware/auth');
const childController = require('../controllers/childController');

const router = express.Router();

// Child registration validation
const childValidation = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('dateOfBirth').isISO8601().toDate(),
  body('gender').isIn(['male', 'female', 'other']),
  body('currentStatus').optional().isIn(['orphan', 'vulnerable', 'rescued', 'in_care', 'adopted', 'reunited', 'independent']),
  validate,
];

// Routes
router.post('/', authorize('ngo', 'admin'), childValidation, childController.registerChild);
router.get('/', authorize('ngo', 'admin'), childController.getAllChildren);
router.get('/statistics', authorize('ngo', 'admin'), childController.getChildStatistics);
router.get('/:id', authorize('ngo', 'admin'), childController.getChildById);
router.put('/:id', authorize('ngo', 'admin'), childController.updateChild);
router.delete('/:id', authorize('ngo', 'admin'), childController.deleteChild);
router.post('/:id/events', authorize('ngo', 'admin'), childController.addChildEvent);
router.get('/:id/events', authorize('ngo', 'admin'), childController.getChildEvents);

module.exports = router;


