const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { verifyToken, authorize } = require('../middleware/auth');
const trainingController = require('../controllers/trainingController');

const router = express.Router();

// Program validation
const programValidation = [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('category').isIn(['sewing', 'tailoring', 'cooking', 'baking', 'hairdressing', 'beauty', 'computer_skills', 'business_management', 'agriculture', 'handicrafts', 'entrepreneurship', 'other']),
  body('duration').isInt({ min: 1 }),
  validate,
];

// Routes
router.post('/', authorize('ngo', 'admin'), programValidation, trainingController.createProgram);
router.get('/', verifyToken, trainingController.getAllPrograms);
router.get('/my-enrollments', authorize('woman'), trainingController.getMyEnrollments);
router.get('/:id', verifyToken, trainingController.getProgramById);
router.put('/:id', authorize('ngo', 'admin'), trainingController.updateProgram);
router.delete('/:id', authorize('ngo', 'admin'), trainingController.deleteProgram);
router.post('/:id/enroll', authorize('woman'), trainingController.enrollInProgram);
router.put('/enrollments/:enrollmentId/progress', authorize('woman'), trainingController.updateEnrollmentProgress);
router.put('/enrollments/:enrollmentId/status', authorize('ngo', 'admin'), trainingController.updateEnrollmentStatus);

module.exports = router;


