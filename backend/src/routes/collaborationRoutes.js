const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { verifyToken, authorize } = require('../middleware/auth');
const collaborationController = require('../controllers/collaborationController');

const router = express.Router();

// Collaboration validation
const collaborationValidation = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('collaborationType').isIn(['joint_program', 'resource_sharing', 'expertise_sharing', 'funding', 'event', 'advocacy', 'research', 'other']),
  validate,
];

// Resource validation
const resourceValidation = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('resourceType').isIn(['training_material', 'document', 'guide', 'template', 'event', 'opportunity', 'collaboration_request', 'other']),
  validate,
];

// Routes
router.post('/', authorize('ngo', 'admin'), collaborationValidation, collaborationController.createCollaborationRequest);
router.get('/', verifyToken, collaborationController.getAllCollaborations);
router.get('/:id', verifyToken, collaborationController.getCollaborationById);
router.put('/:id', authorize('ngo', 'admin'), collaborationController.updateCollaboration);
router.post('/:id/respond', authorize('ngo', 'admin'), collaborationController.respondToCollaboration);

// Resource routes
router.post('/resources', authorize('ngo', 'admin'), resourceValidation, collaborationController.createResource);
router.get('/resources', verifyToken, collaborationController.getAllResources);
router.get('/resources/:id', verifyToken, collaborationController.getResourceById);
router.get('/resources/:id/download', verifyToken, collaborationController.downloadResource);

module.exports = router;


