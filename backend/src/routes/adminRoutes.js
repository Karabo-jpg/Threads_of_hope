const express = require('express');
const { authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

const router = express.Router();

// All routes require admin role
router.use(authorize('admin'));

// Routes
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/export', adminController.exportData);
router.get('/system/health', adminController.getSystemHealth);

module.exports = router;


