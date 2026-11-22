// Centralized Live Demo & Offline Fallback Store
// Ensures the entire platform opens instantly and runs seamlessly without requiring a sign-in

export const DEMO_USERS = {
  student: {
    _id: '6afbdf16f2f03db2083b577e',
    id: '6afbdf16f2f03db2083b577e',
    name: 'Alex Rivera',
    email: 'student@campusconnect.edu',
    role: 'student',
    phone: '+1 (555) 017-3829',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    profile: {
      rollNumber: '23CSE042',
      currentSemester: 6,
      department: { name: 'Computer Science & Engineering', code: 'CSE' },
      course: { name: 'B.Tech Computer Science', code: 'BTECH-CSE' }
    }
  },
  warden: {
    _id: '6afbdf17f2f03db2083b5789',
    id: '6afbdf17f2f03db2083b5789',
    name: 'Dr. Marcus Vance',
    email: 'warden@campusconnect.edu',
    role: 'warden',
    phone: '+1 (555) 019-7711',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    title: 'Chief Hostel Warden'
  },
  faculty: {
    _id: '6afbdf16f2f03db2083b577f',
    id: '6afbdf16f2f03db2083b577f',
    name: 'Prof. Alan Turing',
    email: 'faculty@campusconnect.edu',
    role: 'faculty',
    phone: '+1 (555) 018-9943',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    title: 'Professor of Distributed Systems & AI'
  },
  admin: {
    _id: '6afbdf16f2f03db2083b577a',
    id: '6afbdf16f2f03db2083b577a',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@campusconnect.edu',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    title: 'Dean of Academic Affairs & Administrator'
  },
  parent: {
    _id: '6afbdf17f2f03db2083b5785',
    id: '6afbdf17f2f03db2083b5785',
    name: 'Robert Rivera',
    email: 'parent@campusconnect.edu',
    role: 'parent',
    phone: '+1 (555) 016-5521',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    title: 'Guardian of Alex Rivera'
  }
};

export const DEMO_DATA = {
  // 1. Student Academic Overview
  studentDashboardOverview: {
    profile: {
      rollNumber: '23CSE042',
      currentSemester: 6,
      department: { name: 'Computer Science & Engineering', code: 'CSE' },
      course: { name: 'B.Tech Computer Science', code: 'BTECH-CSE' }
    },
    overallAttendance: {
      percentage: 88.4,
      isLowAttendance: false,
      attendedClasses: 115,
      totalClasses: 130,
      statusMessage: 'Good attendance standing. Consistently above university threshold (75%).'
    },
    academicPerformance: {
      cgpa: 8.92,
      totalCreditsEarned: 132,
      semesterRank: 3
    },
    todaysClasses: [
      {
        _id: 'cls-1',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        room: 'Lecture Hall 401',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        faculty: { user: { name: 'Prof. Alan Turing' } }
      },
      {
        _id: 'cls-2',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        room: 'Lab Complex 3B',
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        faculty: { user: { name: 'Dr. Katherine Johnson' } }
      },
      {
        _id: 'cls-3',
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        room: 'Systems Lab 102',
        subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        faculty: { user: { name: 'Prof. Alan Turing' } }
      }
    ],
    pendingAssignments: [
      {
        _id: 'asg-1',
        title: 'Raft Consensus Protocol Simulation in Node.js',
        subject: { name: 'Distributed Systems', code: 'CS-601' },
        deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        maxMarks: 50,
        submissionStatus: 'Pending'
      },
      {
        _id: 'asg-2',
        title: 'Transformer Attention Mechanism Analysis Report',
        subject: { name: 'Machine Learning', code: 'CS-602' },
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        maxMarks: 100,
        submissionStatus: 'Pending'
      }
    ],
    subjectAttendance: [
      {
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        attended: 28,
        total: 30,
        percentage: 93.3,
        status: 'Safe'
      },
      {
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        attended: 26,
        total: 30,
        percentage: 86.7,
        status: 'Safe'
      },
      {
        subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        attended: 32,
        total: 35,
        percentage: 91.4,
        status: 'Safe'
      },
      {
        subject: { name: 'Cryptography & Network Security', code: 'CS-604' },
        attended: 29,
        total: 35,
        percentage: 82.9,
        status: 'Safe'
      }
    ]
  },

  // 2. Student Hostel Hub
  hostelStudentDashboard: {
    hasAllocation: true,
    allocation: {
      _id: 'alloc-alex-1',
      academicYear: '2024-2025',
      bedNumber: 1,
      status: 'Active',
      allocatedAt: '2024-07-15T00:00:00.000Z',
      hostel: {
        _id: 'hostel-1',
        name: 'Tagore Boys Residence Hall',
        code: 'TBRH',
        type: 'Boys',
        location: 'North Campus Quad B',
        contactNumber: '+91 98765 43210'
      },
      block: {
        _id: 'block-1',
        name: 'Block A (Chanakya Block)',
        code: 'BLK-A',
        totalFloors: 4
      },
      room: {
        _id: 'room-302',
        roomNumber: '302',
        floor: 3,
        roomType: 'Double',
        capacity: 2,
        occupiedBeds: 2,
        monthlyRent: 4500,
        amenities: ['High-Speed Wi-Fi', 'Attached Washroom', 'Balcony', 'Study Desks', 'AC'],
        status: 'Full'
      }
    },
    roommates: [
      {
        _id: 'mate-1',
        name: 'Devon Lee',
        email: 'devon.lee@campusconnect.edu',
        phone: '+1 (555) 017-4491',
        bedNumber: 2,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        course: 'B.Tech Information Tech',
        semester: 6
      }
    ],
    todayMess: {
      breakfast: { timing: '07:30 AM - 09:30 AM', items: ['Aloo Paratha', 'Curd & Pickle', 'Poha', 'Tea / Coffee / Milk'] },
      lunch: { timing: '12:30 PM - 02:30 PM', items: ['Paneer Butter Masala', 'Dal Makhani', 'Jeera Rice', 'Butter Roti', 'Gulab Jamun'] },
      snacks: { timing: '05:00 PM - 06:15 PM', items: ['Samosa / Veg Cutlet', 'Green Mint Chutney', 'Masala Chai'] },
      dinner: { timing: '07:45 PM - 09:45 PM', items: ['Mix Vegetable Curry', 'Yellow Moong Dal', 'Steam Rice', 'Phulka Roti', 'Salad'] },
      isSpecial: true,
      specialNote: 'Chef Special Dessert Night'
    },
    activeLeave: null,
    pendingComplaintsCount: 0,
    totalOutstandingFee: 0,
    feeStatus: 'Paid',
    announcements: [
      {
        _id: 'notif-h1',
        title: 'Annual Hostel Sports League 2026',
        content: 'Inter-block badminton and table tennis tournament starts this Saturday in the recreational court.',
        priority: 'Medium',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'notif-h2',
        title: 'Wi-Fi Fiber Upgrade Completed',
        content: 'Campus broadband speed has been boosted to 1 Gbps across all floors of Block A and B.',
        priority: 'High',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  },

  // 3. Hostel Room Allocation
  myAllocation: {
    _id: 'alloc-alex-1',
    academicYear: '2024-2025',
    bedNumber: 1,
    status: 'Active',
    hostel: {
      name: 'Tagore Boys Residence Hall',
      code: 'TBRH',
      type: 'Boys',
      location: 'North Campus Quad B',
      contactNumber: '+91 98765 43210',
      chiefWarden: { name: 'Dr. Marcus Vance', phone: '+1 (555) 019-7711' }
    },
    block: { name: 'Block A (Chanakya Block)', code: 'BLK-A', totalFloors: 4 },
    room: {
      _id: 'room-302',
      roomNumber: '302',
      floor: 3,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 2,
      monthlyRent: 4500,
      amenities: ['High-Speed Wi-Fi', 'Attached Washroom', 'Balcony', 'Study Desks', 'AC'],
      status: 'Full'
    }
  },

  // 4. Mess Menu Weekly
  messMenu: {
    hostelName: 'Tagore Boys Residence Hall',
    weeklyMenu: [
      {
        dayOfWeek: 'Monday',
        breakfast: { timing: '07:30 AM - 09:30 AM', items: ['Idli & Sambar', 'Coconut Chutney', 'Boiled Eggs', 'Tea / Coffee'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Rajma Masala', 'Jeera Rice', 'Tawa Roti', 'Boondi Raita', 'Salad'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Veg Sandwich', 'Masala Chai'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Aloo Gobi', 'Dal Tadka', 'Steamed Rice', 'Chapati', 'Kheer'] }
      },
      {
        dayOfWeek: 'Tuesday',
        breakfast: { timing: '07:30 AM - 09:30 AM', items: ['Aloo Paratha', 'Curd & Pickle', 'Poha', 'Tea / Coffee / Milk'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Paneer Butter Masala', 'Dal Makhani', 'Jeera Rice', 'Butter Roti', 'Gulab Jamun'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Samosa / Veg Cutlet', 'Green Mint Chutney', 'Masala Chai'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Mix Vegetable Curry', 'Yellow Moong Dal', 'Steam Rice', 'Phulka Roti', 'Salad'] }
      },
      {
        dayOfWeek: 'Wednesday',
        breakfast: { timing: '07:30 AM - 09:30 AM', items: ['Masala Dosa', 'Sambar', 'Tomato Chutney', 'Tea / Coffee'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Chole Bhature', 'Pulao', 'Sweet Lassi', 'Onion Salad'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Bread Pakoda', 'Ginger Tea'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Egg Curry / Kadai Paneer', 'Dal Fry', 'Jeera Rice', 'Roti', 'Custard'] }
      },
      {
        dayOfWeek: 'Thursday',
        breakfast: { timing: '07:30 AM - 09:30 AM', items: ['Methi Paratha', 'Dahi', 'Upma', 'Tea / Milk'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Kadhi Pakora', 'Khichdi / Steam Rice', 'Roti', 'Papad', 'Pickle'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Bhel Puri', 'Tea / Lemonade'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Shahi Paneer', 'Dal Makhani', 'Biryani Rice', 'Naan', 'Ice Cream'] }
      },
      {
        dayOfWeek: 'Friday',
        breakfast: { timing: '07:30 AM - 09:30 AM', items: ['Uttapam', 'Sambar', 'Coconut Chutney', 'Coffee / Tea'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Veg Biryani', 'Mirchi Ka Salan', 'Mixed Raita', 'Gulab Jamun'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Corn Chaat', 'Filter Coffee'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Bhindi Masala', 'Dal Fry', 'Steamed Rice', 'Tawa Roti', 'Halwa'] }
      },
      {
        dayOfWeek: 'Saturday',
        breakfast: { timing: '08:00 AM - 10:00 AM', items: ['Puri Sabzi', 'Halwa', 'Tea / Milk'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Dal Baati Churma', 'Gatta Curry', 'Rice', 'Buttermilk'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Patties', 'Cold Coffee'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Matar Mushroom', 'Yellow Dal', 'Jeera Rice', 'Roti', 'Rasgulla'] }
      },
      {
        dayOfWeek: 'Sunday',
        breakfast: { timing: '08:00 AM - 10:00 AM', items: ['Pancakes / Chole Kulche', 'Fruit Salad', 'Juice / Tea'] },
        lunch: { timing: '12:30 PM - 02:30 PM', items: ['Special Weekend Feast', 'Paneer Tikka Masala', 'Dum Biryani', 'Raita', 'Pastry'] },
        snacks: { timing: '05:00 PM - 06:15 PM', items: ['Pav Bhaji', 'Masala Chai'] },
        dinner: { timing: '07:45 PM - 09:45 PM', items: ['Light Dal Khichdi', 'Mixed Veg', 'Papad', 'Curd', 'Fruit Custard'] }
      }
    ]
  },

  // 5. Digital Gate Pass & Logs
  gatePass: {
    passId: 'PASS-2026-08942',
    studentName: 'Alex Rivera',
    rollNumber: '23CSE042',
    hostelName: 'Tagore Boys Residence Hall',
    roomNumber: '302',
    curfewTime: '09:30 PM',
    status: 'Valid',
    issuedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 86400000 * 30).toISOString(),
    qrData: 'CAMPUSCONNECT-GATEPASS:23CSE042:TBRH-302:VALID'
  },
  gateLogs: [
    {
      _id: 'gate-1',
      student: { name: 'Alex Rivera', email: 'student@campusconnect.edu' },
      movementType: 'Check-In',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      destination: 'Central University Library & Quad',
      hasApprovedLeave: false,
      isLateEntry: false,
      verifiedBy: { name: 'Warden Security Gate 1' },
      remarks: 'Returned before curfew (07:15 PM)'
    },
    {
      _id: 'gate-2',
      student: { name: 'Alex Rivera', email: 'student@campusconnect.edu' },
      movementType: 'Check-Out',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      destination: 'Academic City Center',
      hasApprovedLeave: false,
      isLateEntry: false,
      verifiedBy: { name: 'Warden Security Gate 1' },
      remarks: 'Afternoon academic study group'
    }
  ],

  // 6. Warden Command Analytics
  wardenDashboard: {
    totalBeds: 120,
    occupiedBeds: 92,
    availableBeds: 28,
    occupancyRate: 76.7,
    activeLeavesCount: 6,
    overdueCount: 0,
    pendingComplaintsCount: 2,
    todayMovementsCount: 38,
    recentComplaints: [
      {
        _id: 'comp-1',
        title: 'Room 204 Fan Speed Regulator Replacement',
        category: 'Electricity',
        priority: 'Medium',
        status: 'In Progress',
        student: { name: 'Devon Lee' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'comp-2',
        title: 'Floor 3 Water Cooler Filter Cleaning',
        category: 'Water Supply',
        priority: 'High',
        status: 'Submitted',
        student: { name: 'Alex Rivera' },
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    studentsOnLeave: [
      {
        _id: 'leave-1',
        student: { name: 'Maya Patel', rollNumber: '23CSE048' },
        departureDate: new Date(Date.now() - 86400000).toISOString(),
        expectedReturnDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        reason: 'Attending IEEE National Hackathon finals in Bengaluru',
        destination: 'Bengaluru, Karnataka',
        status: 'Approved'
      }
    ],
    recentMovements: [
      {
        _id: 'mov-1',
        student: { name: 'Alex Rivera', email: 'student@campusconnect.edu' },
        movementType: 'Check-In',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        destination: 'Library Study Block',
        isLateEntry: false,
        verifiedBy: { name: 'Dr. Marcus Vance' }
      },
      {
        _id: 'mov-2',
        student: { name: 'Maya Patel', email: 'maya.patel@campusconnect.edu' },
        movementType: 'Check-Out',
        timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
        destination: 'Airport Station',
        isLateEntry: false,
        verifiedBy: { name: 'Security Post A' }
      }
    ]
  },

  // 7. Rooms Inventory
  rooms: [
    {
      _id: 'room-101',
      roomNumber: '101',
      floor: 1,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 2,
      monthlyRent: 4000,
      amenities: ['Wi-Fi', 'Attached Washroom', 'Study Desks'],
      status: 'Full',
      hostel: { name: 'Tagore Boys Residence Hall', code: 'TBRH' },
      block: { name: 'Block A (Chanakya Block)' }
    },
    {
      _id: 'room-102',
      roomNumber: '102',
      floor: 1,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 1,
      monthlyRent: 4000,
      amenities: ['Wi-Fi', 'Attached Washroom', 'Balcony'],
      status: 'Available',
      hostel: { name: 'Tagore Boys Residence Hall', code: 'TBRH' },
      block: { name: 'Block A (Chanakya Block)' }
    },
    {
      _id: 'room-201',
      roomNumber: '201',
      floor: 2,
      roomType: 'Single',
      capacity: 1,
      occupiedBeds: 1,
      monthlyRent: 6500,
      amenities: ['Wi-Fi', 'AC', 'Attached Washroom', 'Balcony', 'Refrigerator'],
      status: 'Full',
      hostel: { name: 'Tagore Boys Residence Hall', code: 'TBRH' },
      block: { name: 'Block A (Chanakya Block)' }
    },
    {
      _id: 'room-302',
      roomNumber: '302',
      floor: 3,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 2,
      monthlyRent: 4500,
      amenities: ['High-Speed Wi-Fi', 'Attached Washroom', 'Balcony', 'Study Desks', 'AC'],
      status: 'Full',
      hostel: { name: 'Tagore Boys Residence Hall', code: 'TBRH' },
      block: { name: 'Block A (Chanakya Block)' }
    },
    {
      _id: 'room-303',
      roomNumber: '303',
      floor: 3,
      roomType: 'Triple',
      capacity: 3,
      occupiedBeds: 1,
      monthlyRent: 3500,
      amenities: ['Wi-Fi', 'Common Washroom', 'Balcony'],
      status: 'Available',
      hostel: { name: 'Tagore Boys Residence Hall', code: 'TBRH' },
      block: { name: 'Block A (Chanakya Block)' }
    }
  ],

  hostels: [
    {
      _id: 'hostel-1',
      name: 'Tagore Boys Residence Hall',
      code: 'TBRH',
      type: 'Boys',
      location: 'North Campus Quad B',
      totalFloors: 4,
      totalRooms: 60,
      chiefWarden: 'Dr. Marcus Vance'
    },
    {
      _id: 'hostel-2',
      name: 'Sarojini Girls Residence Hall',
      code: 'SGRH',
      type: 'Girls',
      location: 'South Campus Quad A',
      totalFloors: 4,
      totalRooms: 60,
      chiefWarden: 'Dr. Priya Sharma'
    }
  ],

  // 8. Admin Overview
  adminOverview: {
    metrics: {
      totalStudents: 1248,
      totalFaculty: 84,
      activeCourses: 28,
      averageAttendance: 87.2
    },
    departmentBreakdown: [
      { name: 'Computer Science & Engineering', count: 480, studentCount: 480 },
      { name: 'Electronics & Communication', count: 320, studentCount: 320 },
      { name: 'Artificial Intelligence & Data Science', count: 240, studentCount: 240 },
      { name: 'Mechanical & Mechatronics', count: 128, studentCount: 128 },
      { name: 'Civil & Sustainable Engineering', count: 80, studentCount: 80 }
    ],
    attendanceTrend: [
      { month: 'Jul', rate: 91.5 },
      { month: 'Aug', rate: 89.2 },
      { month: 'Sep', rate: 86.8 },
      { month: 'Oct', rate: 88.4 },
      { month: 'Nov', rate: 87.2 }
    ],
    gradeDistribution: [
      { grade: 'A+ (9.0+)', count: 215 },
      { grade: 'A (8.0 - 8.9)', count: 420 },
      { grade: 'B+ (7.0 - 7.9)', count: 390 },
      { grade: 'B (6.0 - 6.9)', count: 165 },
      { grade: 'C (5.0 - 5.9)', count: 58 }
    ],
    recentAuditLogs: [
      {
        _id: 'log-1',
        action: 'ROOM_ALLOCATION',
        performedBy: { name: 'Dr. Marcus Vance' },
        createdAt: new Date().toISOString(),
        details: { roomNumber: '302', bed: 1, student: 'Alex Rivera' }
      },
      {
        _id: 'log-2',
        action: 'ATTENDANCE_MARKED',
        performedBy: { name: 'Prof. Alan Turing' },
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        details: { subject: 'Distributed Systems', present: 28, absent: 2 }
      },
      {
        _id: 'log-3',
        action: 'ASSIGNMENT_CREATED',
        performedBy: { name: 'Dr. Katherine Johnson' },
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        details: { title: 'Neural Attention Mechanisms' }
      }
    ]
  },

  // 9. Faculty Dashboard
  facultyDashboard: {
    profile: {
      employeeId: 'EMP-CSE-001',
      designation: 'Professor',
      department: { name: 'Computer Science & Engineering', code: 'CSE' },
      qualification: 'Ph.D. in Distributed Computing (MIT)',
      specialization: 'Distributed Systems, Cloud & AI',
      officeRoom: 'Faculty Wing A-402'
    },
    metrics: {
      totalSubjectsAssigned: 3,
      totalStudentsEstimated: 124,
      activeAssignmentsCount: 4,
      pendingSubmissionsToGrade: 8,
      averageAttendanceRate: 92.4
    },
    todaysSchedule: [
      {
        _id: 'sch-1',
        time: '09:00 AM - 10:00 AM',
        room: 'Lecture Hall 401',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        semester: 6
      },
      {
        _id: 'sch-2',
        time: '02:00 PM - 04:00 PM',
        room: 'Systems Lab 102',
        subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        semester: 6
      }
    ],
    assignedSubjects: [
      { _id: 'sub-1', name: 'Distributed Systems & Cloud', code: 'CS-601', semester: 6 },
      { _id: 'sub-2', name: 'Full-Stack Software Architecture Lab', code: 'CS-603', semester: 6 }
    ]
  },

  // 10. Parent Dashboard
  parentDashboard: {
    linkedStudents: [
      {
        _id: 'link-1',
        student: {
          _id: '6afbdf16f2f03db2083b577e',
          name: 'Alex Rivera',
          email: 'student@campusconnect.edu',
          phone: '+1 (555) 017-3829',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
          rollNumber: '23CSE042',
          department: 'Computer Science & Engineering',
          semester: 6
        }
      }
    ],
    studentOverview: {
      attendance: {
        overallPercentage: 88.4,
        totalClasses: 130,
        attendedClasses: 115,
        status: 'Good Standing'
      },
      academics: {
        cgpa: 8.92,
        credits: 132,
        rank: 3
      },
      recentGrades: [
        { subject: 'Distributed Systems', examType: 'Mid-Term', score: 48, maxMarks: 50, grade: 'A+' },
        { subject: 'Machine Learning', examType: 'Mid-Term', score: 45, maxMarks: 50, grade: 'A' }
      ],
      hostelInfo: {
        hostel: 'Tagore Boys Residence Hall',
        room: '302',
        curfewStatus: 'In Hostel',
        lastCheckIn: '07:15 PM Today'
      }
    }
  },

  // 11. Notifications
  notifications: [
    {
      _id: 'notif-1',
      title: 'Class Timetable Notice',
      message: 'Distributed Systems Lab scheduled at 02:00 PM today in Systems Lab 102.',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'notif-2',
      title: 'Assignment Deadline Reminder',
      message: 'Raft Consensus Protocol Simulation is due in 48 hours.',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      _id: 'notif-3',
      title: 'Hostel Curfew Gate Notice',
      message: 'Evening curfew check-in time is strictly 09:30 PM.',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  ],

  // 12. Announcements
  announcements: [
    {
      _id: 'anc-1',
      title: 'Smart Campus Annual Innovation Hackathon 2026',
      content: 'Registration is now open for the 48-hour inter-college AI & Web3 Hackathon. Cash pool prizes worth ₹3,00,000.',
      author: { name: 'Dr. Sarah Jenkins' },
      priority: 'High',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'anc-2',
      title: 'Semester End Examination Schedule Released',
      content: 'Theory examinations for 6th and 8th semesters commence from May 15th. Check departmental notice boards for slot details.',
      author: { name: 'Dean Office' },
      priority: 'Medium',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

// Route matcher that returns appropriate demo response
export const getDemoResponse = (url, method = 'get') => {
  const cleanUrl = url.split('?')[0].replace(/^\/api/, '');
  const verb = method.toLowerCase();

  // Read endpoints
  if (verb === 'get') {
    if (cleanUrl.includes('/students/dashboard/overview')) {
      return { success: true, data: DEMO_DATA.studentDashboardOverview };
    }
    if (cleanUrl.includes('/hostel/dashboard/student')) {
      return { success: true, data: DEMO_DATA.hostelStudentDashboard };
    }
    if (cleanUrl.includes('/hostel/my-allocation')) {
      return { success: true, data: DEMO_DATA.myAllocation };
    }
    if (cleanUrl.includes('/hostel/mess-menu')) {
      return { success: true, data: DEMO_DATA.messMenu };
    }
    if (cleanUrl.includes('/hostel/gate/my-pass')) {
      return { success: true, data: DEMO_DATA.gatePass };
    }
    if (cleanUrl.includes('/hostel/gate/my-logs')) {
      return { success: true, data: DEMO_DATA.gateLogs };
    }
    if (cleanUrl.includes('/hostel/gate/all-logs')) {
      return { success: true, data: DEMO_DATA.gateLogs };
    }
    if (cleanUrl.includes('/hostel/dashboard/warden')) {
      return { success: true, data: DEMO_DATA.wardenDashboard };
    }
    if (cleanUrl.includes('/hostel/rooms')) {
      return { success: true, data: DEMO_DATA.rooms };
    }
    if (cleanUrl.includes('/hostel/hostels')) {
      return { success: true, data: DEMO_DATA.hostels };
    }
    if (cleanUrl.includes('/hostel/leaves/warden')) {
      return { success: true, data: DEMO_DATA.wardenDashboard.studentsOnLeave };
    }
    if (cleanUrl.includes('/hostel/complaints/all')) {
      return { success: true, data: DEMO_DATA.wardenDashboard.recentComplaints };
    }
    if (cleanUrl.includes('/hostel/complaints/my')) {
      return { success: true, data: [] };
    }
    if (cleanUrl.includes('/hostel/leaves/my')) {
      return { success: true, data: [] };
    }
    if (cleanUrl.includes('/hostel/fees/my')) {
      return { success: true, data: [] };
    }
    if (cleanUrl.includes('/hostel/fees/all')) {
      return { success: true, data: [] };
    }
    if (cleanUrl.includes('/hostel/announcements')) {
      return { success: true, data: DEMO_DATA.hostelStudentDashboard.announcements };
    }
    if (cleanUrl.includes('/users/admin-overview')) {
      return { success: true, data: DEMO_DATA.adminOverview };
    }
    if (cleanUrl.includes('/faculty/dashboard/overview')) {
      return { success: true, data: DEMO_DATA.facultyDashboard };
    }
    if (cleanUrl.includes('/parents/students')) {
      return { success: true, data: DEMO_DATA.parentDashboard };
    }
    if (cleanUrl.includes('/parents/student-overview')) {
      return { success: true, data: DEMO_DATA.parentDashboard.studentOverview };
    }
    if (cleanUrl.includes('/notifications')) {
      return { success: true, data: { notifications: DEMO_DATA.notifications, unreadCount: 2 } };
    }
    if (cleanUrl.includes('/announcements')) {
      return { success: true, data: DEMO_DATA.announcements };
    }
    if (cleanUrl.includes('/students')) {
      return {
        success: true,
        data: {
          students: [
            DEMO_USERS.student,
            { _id: 'st-2', name: 'Maya Patel', email: 'maya.patel@campusconnect.edu', rollNumber: '23CSE048' },
            { _id: 'st-3', name: 'Devon Lee', email: 'devon.lee@campusconnect.edu', rollNumber: '23CSE052' }
          ]
        }
      };
    }
    if (cleanUrl.includes('/attendance')) {
      return { success: true, data: DEMO_DATA.studentDashboardOverview.subjectAttendance };
    }
    if (cleanUrl.includes('/assignments')) {
      return { success: true, data: DEMO_DATA.studentDashboardOverview.pendingAssignments };
    }
    if (cleanUrl.includes('/auth/me')) {
      return { success: true, data: { user: DEMO_USERS.student } };
    }
  }

  // AI Chat endpoint
  if (cleanUrl.includes('/ai/chat')) {
    return {
      success: true,
      data: {
        reply: `Hello! I'm **CampusConnect AI**. Based on university records, you currently have **88.4% overall attendance** across your 4 active subjects (Distributed Systems: 93.3%, Machine Learning: 86.7%). Your next scheduled class is **Distributed Systems & Cloud** in Lecture Hall 401. How else can I assist your studies today?`
      }
    };
  }

  // Mutating endpoints (simulated success)
  return {
    success: true,
    message: 'Action completed successfully in Live Demo Mode.',
    data: {}
  };
};
