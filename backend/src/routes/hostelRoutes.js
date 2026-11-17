const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/role');
const upload = require('../middleware/upload');
const hostelController = require('../controllers/hostelController');

// All hostel routes require authentication
router.use(authenticate);

// 1. Hostels & Blocks
router.get('/hostels', hostelController.getHostels);
router.get('/hostels/:id', hostelController.getHostelById);
router.post('/hostels', authorize('admin'), hostelController.createHostel);
router.put('/hostels/:id', authorize('admin', 'warden'), hostelController.updateHostel);
router.get('/blocks', hostelController.getBlocks);
router.get('/blocks/:hostelId', hostelController.getBlocks);
router.post('/blocks', authorize('admin', 'warden'), hostelController.createBlock);

// 2. Rooms
router.get('/rooms', hostelController.getRooms);
router.get('/rooms/:id', hostelController.getRoomById);
router.post('/rooms', authorize('admin', 'warden'), hostelController.createRoom);
router.put('/rooms/:id', authorize('admin', 'warden'), hostelController.updateRoom);

// 3. Room Allocations
router.post('/allocate', authorize('admin', 'warden'), hostelController.allocateRoom);
router.put('/vacate/:allocationId', authorize('admin', 'warden'), hostelController.vacateRoom);
router.get('/my-allocation', authorize('student'), hostelController.getMyAllocation);
router.post('/request-transfer', authorize('student'), hostelController.requestRoomTransfer);
router.put('/review-transfer/:allocationId', authorize('admin', 'warden'), hostelController.reviewRoomTransfer);

// 4. Mess Management
router.get('/mess-menu', hostelController.getWeeklyMessMenu);
router.put('/mess-menu', authorize('admin', 'warden'), hostelController.updateMessMenu);
router.post('/mess-feedback', authorize('student'), hostelController.submitMessFeedback);
router.get('/mess-feedback', hostelController.getMessFeedbackAnalytics);

// 5. Hostel Leaves
router.post('/leaves/apply', authorize('student'), hostelController.applyLeave);
router.put('/leaves/:id/cancel', authorize('student'), hostelController.cancelLeave);
router.get('/leaves/my', authorize('student'), hostelController.getMyLeaves);
router.get('/leaves/warden', authorize('admin', 'warden'), hostelController.getWardenLeaves);
router.put('/leaves/:id/review', authorize('admin', 'warden'), hostelController.reviewLeave);
router.put('/leaves/:id/returned', authorize('admin', 'warden'), hostelController.markStudentReturned);

// 6. Maintenance & Complaints
router.post('/complaints', authorize('student'), upload.array('images', 4), hostelController.submitComplaint);
router.get('/complaints/my', authorize('student'), hostelController.getMyComplaints);
router.get('/complaints/all', authorize('admin', 'warden'), hostelController.getAllComplaints);
router.put('/complaints/:id/status', authorize('admin', 'warden'), hostelController.updateComplaintStatus);
router.put('/complaints/:id/rate', authorize('student'), hostelController.rateComplaintResolution);

// 7. Hostel Fees
router.get('/fees/my', authorize('student'), hostelController.getMyHostelFees);
router.get('/fees/all', authorize('admin', 'warden'), hostelController.getAllHostelFees);
router.post('/fees/:feeId/pay', authorize('student', 'admin', 'warden'), hostelController.recordFeePayment);

// 8. Gate Management & Digital Pass
router.post('/gate/movement', authorize('admin', 'warden'), hostelController.logGateMovement);
router.get('/gate/my-logs', authorize('student'), hostelController.getMyGateLogs);
router.get('/gate/all-logs', authorize('admin', 'warden'), hostelController.getAllGateLogs);
router.get('/gate/my-pass', authorize('student'), hostelController.generateGatePass);

// 9. Announcements
router.get('/announcements', hostelController.getHostelAnnouncements);
router.post('/announcements', authorize('admin', 'warden'), hostelController.createHostelAnnouncement);

// 10. Dashboard Snapshots
router.get('/dashboard/student', authorize('student'), hostelController.getStudentHostelDashboard);
router.get('/dashboard/warden', authorize('admin', 'warden'), hostelController.getWardenDashboardAnalytics);

module.exports = router;
