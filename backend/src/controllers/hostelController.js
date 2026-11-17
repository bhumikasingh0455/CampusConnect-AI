const crypto = require('crypto');
const Hostel = require('../models/Hostel');
const HostelBlock = require('../models/HostelBlock');
const HostelRoom = require('../models/HostelRoom');
const RoomAllocation = require('../models/RoomAllocation');
const HostelLeaveRequest = require('../models/HostelLeaveRequest');
const HostelComplaint = require('../models/HostelComplaint');
const HostelFee = require('../models/HostelFee');
const MessMenu = require('../models/MessMenu');
const MessFeedback = require('../models/MessFeedback');
const HostelGateLog = require('../models/HostelGateLog');
const HostelAnnouncement = require('../models/HostelAnnouncement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { notifyUser, notifyRole, broadcastEvent } = require('../services/socketService');

// Helper to notify and persist
const createNotification = async ({ recipient, title, message, type = 'hostel', link = '' }) => {
  try {
    const notif = await Notification.create({ recipient, title, message, type, link });
    notifyUser(recipient.toString(), 'new_notification', notif);
    return notif;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

/* ==========================================================================
   1. HOSTELS & BLOCKS MANAGEMENT
   ========================================================================== */

exports.getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true })
      .populate('wardens', 'name email phone avatar')
      .populate('chiefWarden', 'name email phone avatar')
      .lean();

    // Enrich with dynamic live room and bed counts
    const enriched = await Promise.all(
      hostels.map(async (hostel) => {
        const blocksCount = await HostelBlock.countDocuments({ hostel: hostel._id });
        const rooms = await HostelRoom.find({ hostel: hostel._id });
        const totalRooms = rooms.length;
        const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
        const occupiedBeds = rooms.reduce((sum, r) => sum + (r.occupiedBeds || 0), 0);
        const availableBeds = Math.max(0, totalCapacity - occupiedBeds);
        const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

        return {
          ...hostel,
          blocksCount,
          totalRooms,
          totalCapacity,
          occupiedBeds,
          availableBeds,
          occupancyRate
        };
      })
    );

    return successResponse(res, enriched, 'Hostels retrieved successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('wardens', 'name email phone avatar')
      .populate('chiefWarden', 'name email phone avatar');

    if (!hostel) {
      return errorResponse(res, 'Hostel not found.', 404);
    }

    const blocks = await HostelBlock.find({ hostel: hostel._id });
    const rooms = await HostelRoom.find({ hostel: hostel._id });

    return successResponse(res, { hostel, blocks, roomsCount: rooms.length }, 'Hostel details retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.createHostel = async (req, res) => {
  try {
    const { name, code, type, description, location, contactNumber, chiefWarden } = req.body;

    const existing = await Hostel.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return errorResponse(res, 'Hostel with this name or code already exists.', 400);
    }

    const hostel = await Hostel.create({
      name,
      code,
      type,
      description,
      location,
      contactNumber,
      chiefWarden: chiefWarden || null
    });

    return successResponse(res, hostel, 'Hostel created successfully.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hostel) {
      return errorResponse(res, 'Hostel not found.', 404);
    }
    return successResponse(res, hostel, 'Hostel updated successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getBlocks = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const filter = hostelId ? { hostel: hostelId } : {};
    const blocks = await HostelBlock.find(filter).populate('hostel', 'name code type');
    return successResponse(res, blocks, 'Blocks retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.createBlock = async (req, res) => {
  try {
    const { hostel, blockName, totalFloors, description } = req.body;

    const existing = await HostelBlock.findOne({ hostel, blockName });
    if (existing) {
      return errorResponse(res, 'Block already exists in this hostel.', 400);
    }

    const block = await HostelBlock.create({ hostel, blockName, totalFloors, description });
    return successResponse(res, block, 'Block created successfully.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   2. ROOMS MANAGEMENT & SEARCH
   ========================================================================== */

exports.getRooms = async (req, res) => {
  try {
    const { hostel, block, floor, roomType, status, onlyAvailable } = req.query;
    const filter = {};

    if (hostel) filter.hostel = hostel;
    if (block) filter.block = block;
    if (floor) filter.floor = Number(floor);
    if (roomType) filter.roomType = roomType;
    if (status) filter.status = status;

    let rooms = await HostelRoom.find(filter)
      .populate('hostel', 'name code type')
      .populate('block', 'name blockName code totalFloors')
      .sort({ roomNumber: 1 });

    if (onlyAvailable === 'true') {
      rooms = rooms.filter((r) => r.availableBeds > 0 && r.status === 'Available');
    }

    return successResponse(res, rooms, 'Rooms retrieved successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await HostelRoom.findById(req.params.id)
      .populate('hostel', 'name code type')
      .populate('block', 'name blockName code totalFloors');

    if (!room) {
      return errorResponse(res, 'Room not found.', 404);
    }

    const allocations = await RoomAllocation.find({ room: room._id, status: 'Active' })
      .populate('student', 'name email phone avatar rollNumber');

    return successResponse(res, { room, occupants: allocations }, 'Room details retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { hostel, block, roomNumber, floor, roomType, capacity, monthlyRent, amenities } = req.body;

    const existing = await HostelRoom.findOne({ hostel, block, roomNumber });
    if (existing) {
      return errorResponse(res, `Room ${roomNumber} already exists in this block.`, 400);
    }

    const room = await HostelRoom.create({
      hostel,
      block,
      roomNumber,
      floor: floor || 1,
      roomType: roomType || 'Double',
      capacity: capacity || 2,
      occupiedBeds: 0,
      monthlyRent: monthlyRent || 4500,
      amenities: amenities || ['High-speed Wi-Fi', 'Attached Washroom', 'Study Desk', 'Ergonomic Chair', 'Wardrobe'],
      status: 'Available'
    });

    // Update hostel total rooms & capacity
    await Hostel.findByIdAndUpdate(hostel, {
      $inc: { totalRooms: 1, totalCapacity: capacity || 2 }
    });

    return successResponse(res, room, 'Room created successfully.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await HostelRoom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) {
      return errorResponse(res, 'Room not found.', 404);
    }
    return successResponse(res, room, 'Room updated successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   3. ROOM ALLOCATION SYSTEM (ANTI-OVERALLOCATION)
   ========================================================================== */

exports.allocateRoom = async (req, res) => {
  try {
    const { studentId, roomId, bedNumber, academicYear, remarks } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return errorResponse(res, 'Valid student user is required for room allocation.', 400);
    }

    // Check if student already has active allocation
    const existingAllocation = await RoomAllocation.findOne({ student: studentId, status: 'Active' })
      .populate('room', 'roomNumber')
      .populate('hostel', 'name');

    if (existingAllocation) {
      return errorResponse(
        res,
        `Student is already actively allocated to Room ${existingAllocation.room?.roomNumber} in ${existingAllocation.hostel?.name}.`,
        400
      );
    }

    const room = await HostelRoom.findById(roomId);
    if (!room) {
      return errorResponse(res, 'Target room not found.', 404);
    }

    // Check capacity constraint
    if (room.occupiedBeds >= room.capacity) {
      return errorResponse(
        res,
        `Room ${room.roomNumber} is full. Capacity: ${room.capacity}, Occupied: ${room.occupiedBeds}.`,
        400
      );
    }

    // Check bed availability
    const targetBed = Number(bedNumber) || (room.occupiedBeds + 1);
    const bedTaken = await RoomAllocation.findOne({
      room: roomId,
      bedNumber: targetBed,
      status: 'Active'
    });

    if (bedTaken) {
      return errorResponse(res, `Bed #${targetBed} in Room ${room.roomNumber} is already occupied.`, 400);
    }

    // Create allocation
    const allocation = await RoomAllocation.create({
      student: studentId,
      hostel: room.hostel,
      block: room.block,
      room: room._id,
      bedNumber: targetBed,
      academicYear: academicYear || '2024-2025',
      allocatedBy: req.user._id,
      status: 'Active',
      remarks: remarks || ''
    });

    // Update room occupancy
    room.occupiedBeds += 1;
    if (room.occupiedBeds >= room.capacity) {
      room.status = 'Full';
    }
    await room.save();

    // Automatically generate or link HostelFee record for the student
    const existingFee = await HostelFee.findOne({ student: studentId, roomAllocation: allocation._id });
    if (!existingFee) {
      const roomCharges = (room.monthlyRent || 4500) * 5; // 5-month semester
      const messCharges = 18000;
      const securityDeposit = 5000;
      const maintenanceCharges = 2000;
      const totalAmount = roomCharges + messCharges + securityDeposit + maintenanceCharges;

      await HostelFee.create({
        student: studentId,
        hostel: room.hostel,
        roomAllocation: allocation._id,
        academicYear: academicYear || '2024-2025',
        term: 'Semester 1',
        roomCharges,
        messCharges,
        securityDeposit,
        maintenanceCharges,
        totalAmount,
        paidAmount: 0,
        outstandingAmount: totalAmount,
        status: 'Pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    }

    // Notify student
    await createNotification({
      recipient: studentId,
      title: 'Hostel Room Allocated',
      message: `Congratulations! You have been allocated Bed #${targetBed} in Room ${room.roomNumber}. Welcome to your hostel!`,
      link: '/student/hostel'
    });

    const populatedAllocation = await RoomAllocation.findById(allocation._id)
      .populate('student', 'name email phone avatar')
      .populate('hostel', 'name code type')
      .populate('block', 'blockName')
      .populate('room', 'roomNumber floor roomType');

    return successResponse(res, populatedAllocation, 'Room successfully allocated.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.vacateRoom = async (req, res) => {
  try {
    const { allocationId } = req.params;
    const allocation = await RoomAllocation.findById(allocationId);

    if (!allocation) {
      return errorResponse(res, 'Room allocation record not found.', 404);
    }

    if (allocation.status === 'Vacated') {
      return errorResponse(res, 'This room allocation is already marked as vacated.', 400);
    }

    allocation.status = 'Vacated';
    allocation.vacatedDate = new Date();
    await allocation.save();

    // Decrement room occupancy
    const room = await HostelRoom.findById(allocation.room);
    if (room) {
      room.occupiedBeds = Math.max(0, room.occupiedBeds - 1);
      if (room.occupiedBeds < room.capacity && room.status === 'Full') {
        room.status = 'Available';
      }
      await room.save();
    }

    // Notify student
    await createNotification({
      recipient: allocation.student,
      title: 'Hostel Room Vacated',
      message: 'Your hostel room allocation has been formally closed and marked as vacated.',
      link: '/student/hostel'
    });

    return successResponse(res, allocation, 'Room successfully vacated.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getMyAllocation = async (req, res) => {
  try {
    const allocation = await RoomAllocation.findOne({
      student: req.user._id,
      status: { $in: ['Active', 'Transfer_Requested'] }
    })
      .populate('hostel', 'name code type location contactNumber chiefWarden wardens')
      .populate('block', 'name blockName code totalFloors')
      .populate('room', 'roomNumber floor roomType capacity occupiedBeds monthlyRent amenities status');

    if (!allocation) {
      return successResponse(res, { hasAllocation: false }, 'No active hostel allocation found.');
    }

    // Fetch authorized roommates (other active occupants of this room)
    const roommates = await RoomAllocation.find({
      room: allocation.room._id,
      student: { $ne: req.user._id },
      status: 'Active'
    }).populate('student', 'name email phone avatar');

    const formattedRoommates = roommates.map((r) => ({
      allocationId: r._id,
      bedNumber: r.bedNumber,
      allocatedDate: r.allocatedDate,
      name: r.student?.name,
      email: r.student?.email,
      phone: r.student?.phone,
      avatar: r.student?.avatar
    }));

    return successResponse(
      res,
      {
        hasAllocation: true,
        allocation,
        roommates: formattedRoommates
      },
      'Hostel allocation details retrieved.'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.requestRoomTransfer = async (req, res) => {
  try {
    const { requestedRoomType, reason } = req.body;

    const allocation = await RoomAllocation.findOne({
      student: req.user._id,
      status: { $in: ['Active', 'Transfer_Requested'] }
    });

    if (!allocation) {
      return errorResponse(res, 'You do not have an active room allocation to transfer from.', 400);
    }

    allocation.status = 'Transfer_Requested';
    allocation.transferRequest = {
      requestedRoomType: requestedRoomType || 'Single',
      reason: reason || 'Personal study preferences',
      requestDate: new Date(),
      status: 'Pending',
      reviewRemarks: ''
    };
    await allocation.save();

    notifyRole('warden', 'hostel_transfer_request', {
      studentName: req.user.name,
      requestedRoomType,
      reason
    });

    return successResponse(res, allocation, 'Room transfer request submitted for warden review.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.reviewRoomTransfer = async (req, res) => {
  try {
    const { allocationId } = req.params;
    const { decision, remarks } = req.body; // 'Approved' or 'Rejected'

    const allocation = await RoomAllocation.findById(allocationId).populate('student', 'name');
    if (!allocation || !allocation.transferRequest) {
      return errorResponse(res, 'Transfer request not found.', 404);
    }

    allocation.transferRequest.status = decision;
    allocation.transferRequest.reviewRemarks = remarks || '';

    if (decision === 'Rejected') {
      allocation.status = 'Active';
    }

    await allocation.save();

    await createNotification({
      recipient: allocation.student._id,
      title: `Room Transfer Request ${decision}`,
      message: `Your room transfer request has been ${decision.toLowerCase()}. Remarks: ${remarks || 'None'}`,
      link: '/student/hostel'
    });

    return successResponse(res, allocation, `Room transfer request marked as ${decision}.`);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   4. MESS MANAGEMENT SYSTEM
   ========================================================================== */

exports.getWeeklyMessMenu = async (req, res) => {
  try {
    const { hostelId } = req.query;
    let filter = {};

    if (hostelId) {
      filter.hostel = hostelId;
    }

    let menus = await MessMenu.find(filter).populate('hostel', 'name code').populate('updatedBy', 'name');

    // If no hostel specific menu found, get any available menu
    if (menus.length === 0 && hostelId) {
      menus = await MessMenu.find().populate('hostel', 'name code').populate('updatedBy', 'name');
    }

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    menus.sort((a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek));

    // Today's menu identification
    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMenu = menus.find((m) => m.dayOfWeek === currentDayName) || menus[0] || null;

    return successResponse(res, { weeklyMenu: menus, todayMenu, currentDayName }, 'Mess menu retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateMessMenu = async (req, res) => {
  try {
    const { hostel, dayOfWeek, breakfast, lunch, snacks, dinner, isSpecial, specialNote } = req.body;

    if (!hostel || !dayOfWeek) {
      return errorResponse(res, 'Hostel ID and dayOfWeek are required.', 400);
    }

    const menu = await MessMenu.findOneAndUpdate(
      { hostel, dayOfWeek },
      {
        hostel,
        dayOfWeek,
        breakfast,
        lunch,
        snacks,
        dinner,
        isSpecial: Boolean(isSpecial),
        specialNote: specialNote || '',
        updatedBy: req.user._id
      },
      { upsert: true, new: true, runValidators: true }
    );

    broadcastEvent('mess_menu_updated', { dayOfWeek, specialNote });

    return successResponse(res, menu, `Mess menu for ${dayOfWeek} updated successfully.`);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.submitMessFeedback = async (req, res) => {
  try {
    const { hostelId, mealType, rating, hygieneRating, foodQualityRating, comments } = req.body;

    // Resolve hostel if not provided
    let targetHostel = hostelId;
    if (!targetHostel) {
      const activeAlloc = await RoomAllocation.findOne({ student: req.user._id, status: 'Active' });
      if (activeAlloc) targetHostel = activeAlloc.hostel;
    }

    if (!targetHostel) {
      const firstHostel = await Hostel.findOne();
      targetHostel = firstHostel?._id;
    }

    const feedback = await MessFeedback.create({
      student: req.user._id,
      hostel: targetHostel,
      mealType,
      rating: Number(rating),
      hygieneRating: Number(hygieneRating || 4),
      foodQualityRating: Number(foodQualityRating || 4),
      comments: comments || ''
    });

    return successResponse(res, feedback, 'Thank you! Your mess feedback has been recorded.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getMessFeedbackAnalytics = async (req, res) => {
  try {
    const feedbacks = await MessFeedback.find()
      .populate('student', 'name avatar')
      .populate('hostel', 'name')
      .sort({ createdAt: -1 })
      .limit(30);

    const total = feedbacks.length;
    let avgRating = 0;
    let avgHygiene = 0;
    let avgFoodQuality = 0;

    if (total > 0) {
      avgRating = Number((feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1));
      avgHygiene = Number((feedbacks.reduce((s, f) => s + (f.hygieneRating || 4), 0) / total).toFixed(1));
      avgFoodQuality = Number((feedbacks.reduce((s, f) => s + (f.foodQualityRating || 4), 0) / total).toFixed(1));
    }

    return successResponse(
      res,
      {
        feedbacks,
        stats: {
          totalReviews: total,
          avgRating,
          avgHygiene,
          avgFoodQuality
        }
      },
      'Mess feedback analytics retrieved.'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   5. HOSTEL LEAVE MANAGEMENT
   ========================================================================== */

exports.applyLeave = async (req, res) => {
  try {
    const { departureDate, expectedReturnDate, reason, destination, emergencyContact, parentConsentConfirmed } = req.body;

    // Student must have an active room allocation
    const allocation = await RoomAllocation.findOne({
      student: req.user._id,
      status: { $in: ['Active', 'Transfer_Requested'] }
    });

    if (!allocation) {
      return errorResponse(res, 'Active hostel allocation required before applying for hostel leave.', 400);
    }

    if (new Date(departureDate) >= new Date(expectedReturnDate)) {
      return errorResponse(res, 'Expected return date must be strictly after departure date.', 400);
    }

    const leaveRequest = await HostelLeaveRequest.create({
      student: req.user._id,
      hostel: allocation.hostel,
      room: allocation.room,
      departureDate: new Date(departureDate),
      expectedReturnDate: new Date(expectedReturnDate),
      destination,
      reason,
      emergencyContact: emergencyContact || {},
      parentConsentConfirmed: parentConsentConfirmed !== undefined ? Boolean(parentConsentConfirmed) : true,
      status: 'Pending'
    });

    notifyRole('warden', 'new_hostel_leave', {
      studentName: req.user.name,
      destination,
      departureDate
    });

    return successResponse(res, leaveRequest, 'Leave application submitted successfully.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.cancelLeave = async (req, res) => {
  try {
    const leave = await HostelLeaveRequest.findOne({
      _id: req.params.id,
      student: req.user._id
    });

    if (!leave) {
      return errorResponse(res, 'Leave request not found.', 404);
    }

    if (leave.status !== 'Pending') {
      return errorResponse(res, `Cannot cancel leave application with status '${leave.status}'.`, 400);
    }

    leave.status = 'Cancelled';
    await leave.save();

    return successResponse(res, leave, 'Hostel leave application cancelled.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await HostelLeaveRequest.find({ student: req.user._id })
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, leaves, 'Leave applications retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getWardenLeaves = async (req, res) => {
  try {
    const { status, hostel, overdue } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (hostel) filter.hostel = hostel;

    let leaves = await HostelLeaveRequest.find(filter)
      .populate('student', 'name email phone avatar rollNumber')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    const now = new Date();
    // Dynamic overdue check
    leaves = leaves.map((leave) => {
      const isOverdue = leave.status === 'Approved' && !leave.actualReturnDate && new Date(leave.expectedReturnDate) < now;
      return {
        ...leave.toObject(),
        isOverdue
      };
    });

    if (overdue === 'true') {
      leaves = leaves.filter((l) => l.isOverdue);
    }

    return successResponse(res, leaves, 'Warden leave applications list retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.reviewLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // 'Approved' | 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return errorResponse(res, "Review status must be 'Approved' or 'Rejected'.", 400);
    }

    const leave = await HostelLeaveRequest.findById(id).populate('student', 'name');
    if (!leave) {
      return errorResponse(res, 'Leave request not found.', 404);
    }

    leave.status = status;
    leave.reviewRemarks = remarks || '';
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    await leave.save();

    await createNotification({
      recipient: leave.student._id,
      title: `Hostel Leave ${status}`,
      message: `Your hostel leave request for ${new Date(leave.departureDate).toLocaleDateString()} has been ${status.toLowerCase()}.${remarks ? ` Remarks: ${remarks}` : ''}`,
      link: '/student/hostel'
    });

    return successResponse(res, leave, `Leave application has been ${status.toLowerCase()}.`);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.markStudentReturned = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await HostelLeaveRequest.findById(id);

    if (!leave) {
      return errorResponse(res, 'Leave request not found.', 404);
    }

    leave.status = 'Returned';
    leave.actualReturnDate = new Date();
    leave.isOverdue = false;
    await leave.save();

    // Log gate entry
    await HostelGateLog.create({
      student: leave.student,
      hostel: leave.hostel,
      room: leave.room,
      movementType: 'Check-In',
      destination: leave.destination,
      reason: 'Returned from approved hostel leave',
      hasApprovedLeave: true,
      leaveReference: leave._id,
      verifiedBy: req.user._id,
      remarks: 'Returned from approved out-of-station leave'
    });

    return successResponse(res, leave, 'Student marked as safely returned to hostel.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   6. HOSTEL COMPLAINT & MAINTENANCE PORTAL
   ========================================================================== */

exports.submitComplaint = async (req, res) => {
  try {
    const { category, title, description, priority } = req.body;

    const allocation = await RoomAllocation.findOne({
      student: req.user._id,
      status: { $in: ['Active', 'Transfer_Requested'] }
    });

    if (!allocation) {
      return errorResponse(res, 'Active hostel allocation required to raise maintenance complaints.', 400);
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const complaint = await HostelComplaint.create({
      student: req.user._id,
      hostel: allocation.hostel,
      room: allocation.room,
      category,
      title,
      description,
      priority: priority || 'Medium',
      images,
      status: 'Submitted'
    });

    notifyRole('warden', 'new_hostel_complaint', {
      category,
      title,
      priority: complaint.priority,
      studentName: req.user.name
    });

    return successResponse(res, complaint, 'Complaint submitted successfully.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await HostelComplaint.find({ student: req.user._id })
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, complaints, 'Complaints retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, hostel } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (hostel) filter.hostel = hostel;

    const complaints = await HostelComplaint.find(filter)
      .populate('student', 'name email phone avatar rollNumber')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber floor')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, complaints, 'All hostel complaints retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, staffName, staffPhone, resolutionNotes } = req.body;

    const complaint = await HostelComplaint.findById(id).populate('student', 'name');
    if (!complaint) {
      return errorResponse(res, 'Complaint not found.', 404);
    }

    if (status) complaint.status = status;
    if (staffName) {
      complaint.assignedStaff = {
        name: staffName,
        phone: staffPhone || '',
        assignedAt: new Date()
      };
      if (complaint.status === 'Submitted') complaint.status = 'Assigned';
    }

    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;

    if (status === 'Resolved' || status === 'Closed') {
      complaint.resolvedBy = req.user._id;
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    await createNotification({
      recipient: complaint.student._id,
      title: `Complaint Status Updated: ${complaint.status}`,
      message: `Your maintenance ticket '${complaint.title}' is now marked as ${complaint.status}.${resolutionNotes ? ` Note: ${resolutionNotes}` : ''}`,
      link: '/student/hostel'
    });

    return successResponse(res, complaint, 'Complaint updated successfully.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.rateComplaintResolution = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const complaint = await HostelComplaint.findOne({ _id: id, student: req.user._id });
    if (!complaint) {
      return errorResponse(res, 'Complaint record not found.', 404);
    }

    if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
      return errorResponse(res, 'You can only rate complaints that have been resolved or closed.', 400);
    }

    complaint.studentRating = Number(rating);
    complaint.studentFeedback = feedback || '';
    complaint.status = 'Closed';
    await complaint.save();

    return successResponse(res, complaint, 'Thank you for rating the maintenance resolution.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   7. HOSTEL FEE MANAGEMENT
   ========================================================================== */

exports.getMyHostelFees = async (req, res) => {
  try {
    const fees = await HostelFee.find({ student: req.user._id })
      .populate('hostel', 'name code')
      .populate('roomAllocation')
      .sort({ createdAt: -1 });

    const totalOutstanding = fees.reduce((sum, f) => sum + (f.outstandingAmount || 0), 0);
    const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);

    return successResponse(res, { fees, totalOutstanding, totalPaid }, 'Hostel fees retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getAllHostelFees = async (req, res) => {
  try {
    const { status, hostel, term } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (hostel) filter.hostel = hostel;
    if (term) filter.term = term;

    const fees = await HostelFee.find(filter)
      .populate('student', 'name email phone avatar rollNumber')
      .populate('hostel', 'name code')
      .populate('roomAllocation')
      .sort({ createdAt: -1 });

    const totalCollected = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
    const totalOutstanding = fees.reduce((sum, f) => sum + (f.outstandingAmount || 0), 0);

    return successResponse(res, { fees, totalCollected, totalOutstanding }, 'All hostel fee records retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.recordFeePayment = async (req, res) => {
  try {
    const { feeId } = req.params;
    const { amount, paymentMethod, remarks } = req.body;

    const fee = await HostelFee.findById(feeId);
    if (!fee) {
      return errorResponse(res, 'Hostel fee record not found.', 404);
    }

    const paymentAmount = Number(amount);
    if (paymentAmount <= 0) {
      return errorResponse(res, 'Payment amount must be greater than zero.', 400);
    }

    if (paymentAmount > fee.outstandingAmount) {
      return errorResponse(
        res,
        `Payment amount (₹${paymentAmount}) cannot exceed outstanding balance (₹${fee.outstandingAmount}).`,
        400
      );
    }

    const transactionId = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    const receiptNumber = 'REC-HST-' + Date.now().toString().slice(-6);

    fee.payments.push({
      transactionId,
      amount: paymentAmount,
      paymentMethod: paymentMethod || 'Online Gateway',
      paymentDate: new Date(),
      receiptNumber,
      isVerified: true
    });

    fee.paidAmount += paymentAmount;
    fee.outstandingAmount = Math.max(0, fee.totalAmount - fee.paidAmount);

    if (fee.outstandingAmount === 0) {
      fee.status = 'Paid';
    } else {
      fee.status = 'Partially Paid';
    }

    await fee.save();

    await createNotification({
      recipient: fee.student,
      title: 'Hostel Fee Payment Successful',
      message: `Your payment of ₹${paymentAmount} has been verified. Receipt: ${receiptNumber}. Remaining balance: ₹${fee.outstandingAmount}.`,
      link: '/student/hostel'
    });

    return successResponse(
      res,
      { fee, receiptNumber, transactionId },
      'Payment confirmed and fee record updated successfully.'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   8. HOSTEL ATTENDANCE & GATE MANAGEMENT
   ========================================================================== */

exports.logGateMovement = async (req, res) => {
  try {
    const { studentId, movementType, destination, reason, isLateEntry, remarks } = req.body;

    const student = await User.findById(studentId);
    if (!student) {
      return errorResponse(res, 'Student not found.', 404);
    }

    const allocation = await RoomAllocation.findOne({
      student: studentId,
      status: { $in: ['Active', 'Transfer_Requested'] }
    });

    // Check if student has active approved leave
    const activeLeave = await HostelLeaveRequest.findOne({
      student: studentId,
      status: 'Approved',
      departureDate: { $lte: new Date() },
      actualReturnDate: null
    });

    const gateLog = await HostelGateLog.create({
      student: studentId,
      hostel: allocation ? allocation.hostel : (await Hostel.findOne())?._id,
      room: allocation ? allocation.room : null,
      movementType,
      timestamp: new Date(),
      destination: destination || 'Campus / City',
      reason: reason || 'Routine Movement',
      isLateEntry: Boolean(isLateEntry),
      hasApprovedLeave: Boolean(activeLeave),
      leaveReference: activeLeave ? activeLeave._id : null,
      verifiedBy: req.user._id,
      remarks: remarks || ''
    });

    return successResponse(res, gateLog, `${movementType} successfully recorded at main hostel gate.`, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getMyGateLogs = async (req, res) => {
  try {
    const logs = await HostelGateLog.find({ student: req.user._id })
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber')
      .populate('verifiedBy', 'name')
      .sort({ timestamp: -1 })
      .limit(50);

    return successResponse(res, logs, 'Gate movement history retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getAllGateLogs = async (req, res) => {
  try {
    const { isLateEntry, movementType, hostel, date } = req.query;
    const filter = {};

    if (isLateEntry === 'true') filter.isLateEntry = true;
    if (movementType) filter.movementType = movementType;
    if (hostel) filter.hostel = hostel;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.timestamp = { $gte: start, $lte: end };
    }

    const logs = await HostelGateLog.find(filter)
      .populate('student', 'name email phone avatar rollNumber')
      .populate('hostel', 'name code')
      .populate('room', 'roomNumber')
      .populate('verifiedBy', 'name')
      .sort({ timestamp: -1 })
      .limit(100);

    return successResponse(res, logs, 'Gate movement audit logs retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.generateGatePass = async (req, res) => {
  try {
    const allocation = await RoomAllocation.findOne({
      student: req.user._id,
      status: { $in: ['Active', 'Transfer_Requested'] }
    })
      .populate('hostel', 'name code type location')
      .populate('room', 'roomNumber floor');

    if (!allocation) {
      return errorResponse(res, 'Active hostel allocation required to generate hostel gate pass.', 400);
    }

    const activeLeave = await HostelLeaveRequest.findOne({
      student: req.user._id,
      status: 'Approved',
      departureDate: { $lte: new Date() },
      actualReturnDate: null
    });

    const passPayload = {
      passId: 'PASS-' + req.user._id.toString().slice(-6).toUpperCase(),
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentAvatar: req.user.avatar,
      hostelName: allocation.hostel?.name,
      roomNumber: allocation.room?.roomNumber,
      bedNumber: allocation.bedNumber,
      activeLeave: activeLeave
        ? {
            id: activeLeave._id,
            destination: activeLeave.destination,
            expectedReturn: activeLeave.expectedReturnDate
          }
        : null,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    const signature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev_prod')
      .update(JSON.stringify(passPayload))
      .digest('hex');

    return successResponse(
      res,
      {
        ...passPayload,
        token: signature
      },
      'Digital student identity pass generated.'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   9. HOSTEL ANNOUNCEMENTS
   ========================================================================== */

exports.getHostelAnnouncements = async (req, res) => {
  try {
    const { hostelId } = req.query;
    const filter = {
      $or: [{ hostel: null }]
    };

    if (hostelId) {
      filter.$or.push({ hostel: hostelId });
    }

    const announcements = await HostelAnnouncement.find(filter)
      .populate('author', 'name email avatar role')
      .populate('hostel', 'name code')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(20);

    return successResponse(res, announcements, 'Hostel notices retrieved.');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.createHostelAnnouncement = async (req, res) => {
  try {
    const { title, content, hostel, priority, category, isPinned, expiresAt } = req.body;

    const notice = await HostelAnnouncement.create({
      title,
      content,
      hostel: hostel || null,
      author: req.user._id,
      priority: priority || 'normal',
      category: category || 'General',
      isPinned: Boolean(isPinned),
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    broadcastEvent('hostel_announcement', {
      title,
      priority,
      category,
      authorName: req.user.name
    });

    return successResponse(res, notice, 'Hostel announcement broadcasted successfully.', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* ==========================================================================
   10. AGGREGATED DASHBOARD SNAPSHOTS
   ========================================================================== */

exports.getStudentHostelDashboard = async (req, res) => {
  try {
    const allocation = await RoomAllocation.findOne({
      student: req.user._id,
      status: { $in: ['Active', 'Transfer_Requested'] }
    })
      .populate('hostel', 'name code type location contactNumber chiefWarden wardens')
      .populate('block', 'name blockName code totalFloors')
      .populate('room', 'roomNumber floor roomType capacity occupiedBeds monthlyRent amenities status');

    if (!allocation) {
      return successResponse(
        res,
        {
          hasAllocation: false,
          hostels: await Hostel.find({ isActive: true }).select('name code type location')
        },
        'No active room allocation found.'
      );
    }

    // Roommates
    const roommates = await RoomAllocation.find({
      room: allocation.room._id,
      student: { $ne: req.user._id },
      status: 'Active'
    }).populate('student', 'name email phone avatar');

    // Today's mess menu
    const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayMess = await MessMenu.findOne({
      dayOfWeek: currentDayName,
      $or: [{ hostel: allocation.hostel._id }, { hostel: { $exists: true } }]
    });

    // Active leave
    const activeLeave = await HostelLeaveRequest.findOne({
      student: req.user._id,
      status: { $in: ['Pending', 'Approved'] }
    }).sort({ createdAt: -1 });

    // Pending complaints
    const pendingComplaints = await HostelComplaint.find({
      student: req.user._id,
      status: { $in: ['Submitted', 'Assigned', 'In Progress'] }
    });

    // Fee balance
    const feeRecords = await HostelFee.find({ student: req.user._id });
    const totalOutstanding = feeRecords.reduce((sum, f) => sum + (f.outstandingAmount || 0), 0);
    const feeStatus = totalOutstanding === 0 ? 'Paid' : 'Pending';

    // Recent notices
    const announcements = await HostelAnnouncement.find({
      $or: [{ hostel: null }, { hostel: allocation.hostel._id }]
    })
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(4);

    return successResponse(
      res,
      {
        hasAllocation: true,
        allocation,
        roommates: roommates.map((r) => ({
          bedNumber: r.bedNumber,
          name: r.student?.name,
          email: r.student?.email,
          phone: r.student?.phone,
          avatar: r.student?.avatar
        })),
        todayMess,
        activeLeave,
        pendingComplaintsCount: pendingComplaints.length,
        totalOutstandingFee: totalOutstanding,
        feeStatus,
        announcements
      },
      'Student hostel dashboard loaded.'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.getWardenDashboardAnalytics = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true });
    const rooms = await HostelRoom.find();
    const allocations = await RoomAllocation.find({ status: 'Active' });

    const totalCapacity = rooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const occupiedBeds = rooms.reduce((sum, r) => sum + (r.occupiedBeds || 0), 0);
    const availableBeds = Math.max(0, totalCapacity - occupiedBeds);
    const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

    const pendingLeaves = await HostelLeaveRequest.countDocuments({ status: 'Pending' });
    const onLeaveNow = await HostelLeaveRequest.countDocuments({
      status: 'Approved',
      actualReturnDate: null
    });

    const now = new Date();
    const overdueReturns = await HostelLeaveRequest.countDocuments({
      status: 'Approved',
      actualReturnDate: null,
      expectedReturnDate: { $lt: now }
    });

    const openComplaints = await HostelComplaint.countDocuments({
      status: { $in: ['Submitted', 'Assigned', 'In Progress'] }
    });

    const allFees = await HostelFee.find();
    const totalCollected = allFees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
    const totalOutstanding = allFees.reduce((sum, f) => sum + (f.outstandingAmount || 0), 0);

    const recentComplaints = await HostelComplaint.find()
      .populate('student', 'name email avatar')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentGateLogs = await HostelGateLog.find()
      .populate('student', 'name avatar')
      .sort({ timestamp: -1 })
      .limit(5);

    return successResponse(
      res,
      {
        totalHostels: hostels.length,
        totalRooms: rooms.length,
        totalCapacity,
        occupiedBeds,
        availableBeds,
        occupancyRate,
        pendingLeaves,
        studentsOnLeave: onLeaveNow,
        overdueReturns,
        openComplaints,
        feeSummary: {
          totalCollected,
          totalOutstanding
        },
        recentComplaints,
        recentGateLogs
      },
      'Warden analytics loaded.'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
