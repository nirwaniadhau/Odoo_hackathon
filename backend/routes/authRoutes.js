// // routes/authRoutes.js
// import express from 'express';
// import { register, login, createEmployee } from '../controllers/authController.js';
// import { protect, authorize } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.post('/employees', protect, authorize('admin'), createEmployee);

// export default router;


// routes/authRoutes.js
import express from 'express';
import { register, login, createEmployee, adminDashboard, adminDashboardApprovalRules } from '../controllers/authController.js'; // Add adminDashboard
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/employees', protect, authorize('admin'), createEmployee);
router.post('/admin-dashboard', protect, authorize('admin'), adminDashboard); // New route
router.post('/admin-dashboard/approval-rules', protect, authorize('admin'), adminDashboardApprovalRules); // New route

export default router;