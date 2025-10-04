import express from 'express';
import { register, login, createEmployee, adminDashboard, adminDashboardApprovalRules } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);


// Admin routes
router.post('/employees', protect, authorize('admin'), createEmployee);
router.post('/admin-dashboard', protect, authorize('admin'), adminDashboard);
router.post('/admin-dashboard/approval-rules', protect, authorize('admin'), adminDashboardApprovalRules);
router.get('/employees', protect, authorize('admin'), adminDashboard);
// or create a new controller method getEmployees


export default router;
