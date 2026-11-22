// Centralized Live Demo & Offline Fallback Store
// Guarantees instant 0ms latency, zero server lag, and 100% full platform functionality

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
        roomNumber: 'Hall 401',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        faculty: { user: { name: 'Prof. Alan Turing' } }
      },
      {
        _id: 'cls-2',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        room: 'Lab Complex 3B',
        roomNumber: 'Lab 3B',
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        faculty: { user: { name: 'Dr. Katherine Johnson' } }
      },
      {
        _id: 'cls-3',
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        room: 'Systems Lab 102',
        roomNumber: 'Lab 102',
        subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        faculty: { user: { name: 'Prof. Alan Turing' } }
      }
    ],
    subjectAttendance: [
      {
        _id: 'att-sub-1',
        subject: { _id: 'sub-cs601', name: 'Distributed Systems & Cloud', code: 'CS-601' },
        subjectName: 'Distributed Systems & Cloud',
        subjectCode: 'CS-601',
        attended: 28,
        total: 30,
        percentage: 93.3,
        isShortage: false,
        facultyName: 'Prof. Alan Turing'
      },
      {
        _id: 'att-sub-2',
        subject: { _id: 'sub-cs602', name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        subjectName: 'Machine Learning & Neural Nets',
        subjectCode: 'CS-602',
        attended: 26,
        total: 30,
        percentage: 86.7,
        isShortage: false,
        facultyName: 'Dr. Katherine Johnson'
      },
      {
        _id: 'att-sub-3',
        subject: { _id: 'sub-cs603', name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        subjectName: 'Full-Stack Software Architecture Lab',
        subjectCode: 'CS-603',
        attended: 29,
        total: 32,
        percentage: 90.6,
        isShortage: false,
        facultyName: 'Prof. Alan Turing'
      },
      {
        _id: 'att-sub-4',
        subject: { _id: 'sub-cs604', name: 'Cryptography & Network Security', code: 'CS-604' },
        subjectName: 'Cryptography & Network Security',
        subjectCode: 'CS-604',
        attended: 22,
        total: 28,
        percentage: 78.6,
        isShortage: false,
        facultyName: 'Dr. Claude Shannon'
      },
      {
        _id: 'att-sub-5',
        subject: { _id: 'sub-cs605', name: 'Compiler Design', code: 'CS-605' },
        subjectName: 'Compiler Design',
        subjectCode: 'CS-605',
        attended: 10,
        total: 14,
        percentage: 71.4,
        isShortage: true,
        facultyName: 'Prof. Grace Hopper'
      }
    ],
    pendingAssignments: [
      {
        _id: 'asg-1',
        title: 'Distributed Consensus with Raft & Paxos Simulation',
        description: 'Implement a distributed consensus state machine in Node.js or Go with leader election, log replication, and partition healing.',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        faculty: { name: 'Prof. Alan Turing' },
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        maxMarks: 100,
        isSubmitted: false,
        isOverdue: false
      },
      {
        _id: 'asg-2',
        title: 'Convolutional Neural Network for Image Segmentation',
        description: 'Design and train a UNet model on medical scan images achieving >85% Dice coefficient score.',
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        faculty: { name: 'Dr. Katherine Johnson' },
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        maxMarks: 100,
        isSubmitted: true,
        mySubmission: {
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          fileUrl: '#',
          marksObtained: 94,
          feedback: 'Outstanding architecture and ablation study.'
        },
        isOverdue: false
      },
      {
        _id: 'asg-3',
        title: 'Zero-Knowledge Proofs in Decentralized Identity',
        description: 'Analyze zk-SNARK verifications and benchmark gas costs for identity verification.',
        subject: { name: 'Cryptography & Network Security', code: 'CS-604' },
        faculty: { name: 'Dr. Claude Shannon' },
        dueDate: new Date(Date.now() + 86400000 * 8).toISOString(),
        maxMarks: 100,
        isSubmitted: false,
        isOverdue: false
      }
    ]
  },

  // 2. Student Attendance Deep Analytics
  studentAttendanceDetails: {
    overall: {
      percentage: 88.4,
      attended: 115,
      total: 130
    },
    subjectBreakdown: [
      {
        _id: 'sub-cs601',
        subject: { _id: 'sub-cs601', name: 'Distributed Systems & Cloud', code: 'CS-601' },
        subjectName: 'Distributed Systems & Cloud',
        subjectCode: 'CS-601',
        attended: 28,
        total: 30,
        percentage: 93.3,
        isShortage: false,
        facultyName: 'Prof. Alan Turing'
      },
      {
        _id: 'sub-cs602',
        subject: { _id: 'sub-cs602', name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        subjectName: 'Machine Learning & Neural Nets',
        subjectCode: 'CS-602',
        attended: 26,
        total: 30,
        percentage: 86.7,
        isShortage: false,
        facultyName: 'Dr. Katherine Johnson'
      },
      {
        _id: 'sub-cs603',
        subject: { _id: 'sub-cs603', name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        subjectName: 'Full-Stack Software Architecture Lab',
        subjectCode: 'CS-603',
        attended: 29,
        total: 32,
        percentage: 90.6,
        isShortage: false,
        facultyName: 'Prof. Alan Turing'
      },
      {
        _id: 'sub-cs604',
        subject: { _id: 'sub-cs604', name: 'Cryptography & Network Security', code: 'CS-604' },
        subjectName: 'Cryptography & Network Security',
        subjectCode: 'CS-604',
        attended: 22,
        total: 28,
        percentage: 78.6,
        isShortage: false,
        facultyName: 'Dr. Claude Shannon'
      },
      {
        _id: 'sub-cs605',
        subject: { _id: 'sub-cs605', name: 'Compiler Design', code: 'CS-605' },
        subjectName: 'Compiler Design',
        subjectCode: 'CS-605',
        attended: 10,
        total: 14,
        percentage: 71.4,
        isShortage: true,
        facultyName: 'Prof. Grace Hopper'
      }
    ],
    records: [
      {
        _id: 'rec-1',
        date: new Date().toISOString(),
        status: 'present',
        subject: { _id: 'sub-cs601', name: 'Distributed Systems & Cloud', code: 'CS-601' },
        verifiedBy: 'QR Scan'
      },
      {
        _id: 'rec-2',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'present',
        subject: { _id: 'sub-cs602', name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        verifiedBy: 'Faculty'
      },
      {
        _id: 'rec-3',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'present',
        subject: { _id: 'sub-cs603', name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        verifiedBy: 'QR Scan'
      },
      {
        _id: 'rec-4',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'absent',
        subject: { _id: 'sub-cs605', name: 'Compiler Design', code: 'CS-605' },
        verifiedBy: 'Faculty'
      },
      {
        _id: 'rec-5',
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        status: 'present',
        subject: { _id: 'sub-cs604', name: 'Cryptography & Network Security', code: 'CS-604' },
        verifiedBy: 'QR Scan'
      }
    ]
  },

  // 3. Student Grades & Transcripts
  studentGradesDetails: {
    cgpa: 8.92,
    semesterAnalytics: [
      { sem: 'Sem 1', sgpa: 8.4 },
      { sem: 'Sem 2', sgpa: 8.6 },
      { sem: 'Sem 3', sgpa: 8.5 },
      { sem: 'Sem 4', sgpa: 8.9 },
      { sem: 'Sem 5', sgpa: 8.8 },
      { sem: 'Sem 6', sgpa: 9.1 }
    ],
    grades: [
      {
        _id: 'grd-1',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601', credits: 4 },
        examType: 'Mid-Term Exam',
        score: 94,
        maxScore: 100,
        gradeLetter: 'A+'
      },
      {
        _id: 'grd-2',
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602', credits: 4 },
        examType: 'Mid-Term Exam',
        score: 89,
        maxScore: 100,
        gradeLetter: 'A'
      },
      {
        _id: 'grd-3',
        subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603', credits: 2 },
        examType: 'Practical Continuous Evaluation',
        score: 96,
        maxScore: 100,
        gradeLetter: 'O'
      },
      {
        _id: 'grd-4',
        subject: { name: 'Cryptography & Network Security', code: 'CS-604', credits: 4 },
        examType: 'Mid-Term Exam',
        score: 84,
        maxScore: 100,
        gradeLetter: 'B+'
      },
      {
        _id: 'grd-5',
        subject: { name: 'Compiler Design', code: 'CS-605', credits: 4 },
        examType: 'Mid-Term Exam',
        score: 79,
        maxScore: 100,
        gradeLetter: 'B'
      }
    ]
  },

  // 4. Timetable
  timetableData: {
    weeklySchedule: {
      Monday: [
        {
          _id: 'tt-mon-1',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          room: 'Lecture Hall 401',
          roomNumber: 'Hall 401',
          subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
          faculty: { name: 'Prof. Alan Turing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
        },
        {
          _id: 'tt-mon-2',
          startTime: '10:15 AM',
          endTime: '11:15 AM',
          room: 'Lab Complex 3B',
          roomNumber: 'Lab 3B',
          subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
          faculty: { name: 'Dr. Katherine Johnson', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' }
        },
        {
          _id: 'tt-mon-3',
          startTime: '02:00 PM',
          endTime: '04:00 PM',
          room: 'Systems Lab 102',
          roomNumber: 'Lab 102',
          subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
          faculty: { name: 'Prof. Alan Turing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
        }
      ],
      Tuesday: [
        {
          _id: 'tt-tue-1',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          room: 'Lecture Hall 402',
          roomNumber: 'Hall 402',
          subject: { name: 'Cryptography & Network Security', code: 'CS-604' },
          faculty: { name: 'Dr. Claude Shannon', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
        },
        {
          _id: 'tt-tue-2',
          startTime: '11:30 AM',
          endTime: '12:30 PM',
          room: 'Lecture Hall 301',
          roomNumber: 'Hall 301',
          subject: { name: 'Compiler Design', code: 'CS-605' },
          faculty: { name: 'Prof. Grace Hopper', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' }
        }
      ],
      Wednesday: [
        {
          _id: 'tt-wed-1',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          room: 'Lecture Hall 401',
          roomNumber: 'Hall 401',
          subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
          faculty: { name: 'Prof. Alan Turing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
        },
        {
          _id: 'tt-wed-2',
          startTime: '10:15 AM',
          endTime: '11:15 AM',
          room: 'Lab Complex 3B',
          roomNumber: 'Lab 3B',
          subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
          faculty: { name: 'Dr. Katherine Johnson', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' }
        }
      ],
      Thursday: [
        {
          _id: 'tt-thu-1',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          room: 'Lecture Hall 402',
          roomNumber: 'Hall 402',
          subject: { name: 'Cryptography & Network Security', code: 'CS-604' },
          faculty: { name: 'Dr. Claude Shannon', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
        },
        {
          _id: 'tt-thu-2',
          startTime: '02:00 PM',
          endTime: '04:00 PM',
          room: 'ML Research Lab',
          roomNumber: 'ML Lab',
          subject: { name: 'Deep Learning Practical Session', code: 'CS-602' },
          faculty: { name: 'Dr. Katherine Johnson', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' }
        }
      ],
      Friday: [
        {
          _id: 'tt-fri-1',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          room: 'Lecture Hall 301',
          roomNumber: 'Hall 301',
          subject: { name: 'Compiler Design', code: 'CS-605' },
          faculty: { name: 'Prof. Grace Hopper', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' }
        },
        {
          _id: 'tt-fri-2',
          startTime: '11:15 AM',
          endTime: '12:15 PM',
          room: 'Seminar Hall A',
          roomNumber: 'Seminar A',
          subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
          faculty: { name: 'Prof. Alan Turing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
        }
      ]
    },
    allEntries: [
      {
        _id: 'ent-1',
        dayOfWeek: 'Monday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        roomNumber: 'Hall 401',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        department: { name: 'Computer Science & Engineering' },
        faculty: { user: { name: 'Prof. Alan Turing' } }
      },
      {
        _id: 'ent-2',
        dayOfWeek: 'Monday',
        startTime: '10:15 AM',
        endTime: '11:15 AM',
        roomNumber: 'Lab 3B',
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        department: { name: 'Computer Science & Engineering' },
        faculty: { user: { name: 'Dr. Katherine Johnson' } }
      },
      {
        _id: 'ent-3',
        dayOfWeek: 'Tuesday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        roomNumber: 'Hall 402',
        subject: { name: 'Cryptography & Network Security', code: 'CS-604' },
        department: { name: 'Computer Science & Engineering' },
        faculty: { user: { name: 'Dr. Claude Shannon' } }
      },
      {
        _id: 'ent-4',
        dayOfWeek: 'Wednesday',
        startTime: '09:00 AM',
        endTime: '10:00 AM',
        roomNumber: 'Hall 401',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        department: { name: 'Computer Science & Engineering' },
        faculty: { user: { name: 'Prof. Alan Turing' } }
      }
    ]
  },

  // 5. Study Materials
  materialsData: {
    materials: [
      {
        _id: 'mat-1',
        title: 'Distributed Consensus & Fault-Tolerant Architectures',
        description: 'Comprehensive slides and mathematical proofs for Paxos, Raft, Byzantine fault tolerance, and vector clocks.',
        category: 'Lecture Notes',
        subject: { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        faculty: { name: 'Prof. Alan Turing' },
        fileSize: '4.8 MB',
        downloadsCount: 184,
        summary: 'AI Executive Summary: In-depth exploration of consensus protocols in untrusted networks, detailing leader election, heartbeats, log consistency proofs, and network partition recovery.'
      },
      {
        _id: 'mat-2',
        title: 'Deep Residual Learning and Transformer Attention Models',
        description: 'Complete guide to self-attention mechanisms, multi-head attention math, and residual skip connections in vision architectures.',
        category: 'Slide Deck',
        subject: { name: 'Machine Learning & Neural Nets', code: 'CS-602' },
        faculty: { name: 'Dr. Katherine Johnson' },
        fileSize: '6.2 MB',
        downloadsCount: 247,
        summary: 'AI Executive Summary: Detailed walkthrough of Transformer architectures, covering Scaled Dot-Product Attention, positional encodings, layer normalization, and fine-tuning techniques.'
      },
      {
        _id: 'mat-3',
        title: 'Full-Stack Microservices Design & Event-Driven Pipelines',
        description: 'Design patterns for asynchronous message queues, CQRS, Docker containerization, and Kubernetes cluster deployments.',
        category: 'Lab Manual',
        subject: { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' },
        faculty: { name: 'Prof. Alan Turing' },
        fileSize: '3.1 MB',
        downloadsCount: 152,
        summary: 'AI Executive Summary: Architectural handbook for microservice decoupling with Kafka, Redis Pub/Sub, API gateways, and distributed tracing with OpenTelemetry.'
      },
      {
        _id: 'mat-4',
        title: 'Elliptic Curve Cryptography & Post-Quantum Algorithms',
        description: 'Rigorous analysis of ECDSA, Ed25519, lattice-based cryptography, and NIST post-quantum standardization updates.',
        category: 'Question Bank',
        subject: { name: 'Cryptography & Network Security', code: 'CS-604' },
        faculty: { name: 'Dr. Claude Shannon' },
        fileSize: '2.9 MB',
        downloadsCount: 96,
        summary: 'AI Executive Summary: Overview of asymmetric cryptographic primitives, discrete logarithm hardness, and transition plans to quantum-resistant encryption.'
      }
    ]
  },

  // 6. Academic Leaves
  academicLeaves: {
    leaves: [
      {
        _id: 'al-1',
        leaveType: 'Academic Event',
        startDate: '2026-11-25',
        endDate: '2026-11-28',
        reason: 'Presenting research paper on Distributed Consensus at IEEE International Student Symposium.',
        status: 'Approved',
        reviewedBy: { name: 'Prof. Alan Turing' },
        comments: 'Permission granted. Ensure lab assignments are submitted prior to departure.'
      },
      {
        _id: 'al-2',
        leaveType: 'Medical',
        startDate: '2026-10-12',
        endDate: '2026-10-14',
        reason: 'Viral fever rest as recommended by campus medical health center doctor.',
        status: 'Approved',
        reviewedBy: { name: 'Dr. Sarah Jenkins' },
        comments: 'Medical certificate verified on campus record.'
      }
    ]
  },

  // 7. Hostel Student Dashboard
  hostelStudentDashboard: {
    allocation: {
      hostelName: 'Tagore Boys Residence Hall',
      roomNumber: '302',
      bedNumber: 1,
      blockName: 'Block A (Chanakya Block)',
      floor: 3,
      status: 'Active'
    },
    todayMeals: {
      breakfast: 'Idli Sambar & Coconut Chutney',
      lunch: 'Paneer Butter Masala, Dal Makhani, Jeera Rice, Tawa Roti',
      snacks: 'Veg Cutlet & Masala Chai',
      dinner: 'Aloo Gobhi, Dal Tadka, Steamed Basmati Rice, Gulab Jamun'
    },
    curfew: {
      time: '09:30 PM',
      status: 'In Hostel',
      gatePassValid: true
    },
    quickStats: {
      totalRoomMates: 2,
      activeComplaints: 0,
      feeDueAmount: 12000,
      messAttendancePct: 94.5
    },
    announcements: [
      {
        _id: 'hanc-1',
        title: 'Annual Inter-Hostel Badminton & Table Tennis Tournament',
        content: 'Fixtures have been published on the sports board. Matches start this Saturday 4:00 PM.',
        priority: 'Medium',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'hanc-2',
        title: 'Wi-Fi Fiber Optical Line Speed Upgrade Completed',
        content: 'Campus broadband speed has been boosted to 1 Gbps across all floors of Block A and B.',
        priority: 'High',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  },

  // 8. Hostel Room Allocation
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

  // 9. Mess Menu Weekly
  messMenu: {
    hostelName: 'Tagore Boys Residence Hall',
    weeklyMenu: [
      {
        dayOfWeek: 'Monday',
        meals: {
          breakfast: { menuItems: ['Masala Dosa', 'Coconut Chutney', 'Sambar', 'Tea / Coffee', 'Boiled Eggs / Banana'], calories: 480, timings: '07:30 AM - 09:30 AM' },
          lunch: { menuItems: ['Shahi Paneer', 'Yellow Dal Tadka', 'Jeera Rice', 'Tandoori Roti', 'Boondi Raita', 'Salad'], calories: 720, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['Samosa (2 pcs)', 'Mint Chutney', 'Special Adrak Chai / Coffee'], calories: 310, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Seasonal Mix Veg', 'Moong Dal', 'Steamed Rice', 'Phulka Roti', 'Gulab Jamun'], calories: 650, timings: '07:45 PM - 09:45 PM' }
        }
      },
      {
        dayOfWeek: 'Tuesday',
        meals: {
          breakfast: { menuItems: ['Aloo Paratha', 'Fresh Curd', 'Pickle', 'Masala Tea / Milk'], calories: 520, timings: '07:30 AM - 09:30 AM' },
          lunch: { menuItems: ['Rajma Masala', 'Kashmiri Dum Aloo', 'Steamed Basmati Rice', 'Butter Roti', 'Cucumber Raita'], calories: 740, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['Veg Sandwich', 'Tomato Ketchup', 'Filter Coffee'], calories: 290, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Kadai Paneer', 'Dal Makhani', 'Jeera Rice', 'Tawa Roti', 'Fruit Custard'], calories: 680, timings: '07:45 PM - 09:45 PM' }
        }
      },
      {
        dayOfWeek: 'Wednesday',
        meals: {
          breakfast: { menuItems: ['Poha with Peanuts', 'Sev & Lemon', 'Boiled Sprouts', 'Tea / Coffee'], calories: 420, timings: '07:30 AM - 09:30 AM' },
          lunch: { menuItems: ['Chole Bhature / Rice', 'Boondi Raita', 'Onion Salad', 'Pickle'], calories: 780, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['White Sauce Pasta', 'Garlic Bread', 'Cold Coffee'], calories: 340, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Matar Mushroom', 'Arhar Dal', 'Steamed Rice', 'Roti', 'Moong Dal Halwa'], calories: 660, timings: '07:45 PM - 09:45 PM' }
        }
      },
      {
        dayOfWeek: 'Thursday',
        meals: {
          breakfast: { menuItems: ['Idli Vada Combo', 'Sambar', 'Two Chutneys', 'Tea / Filter Coffee'], calories: 460, timings: '07:30 AM - 09:30 AM' },
          lunch: { menuItems: ['Kadhi Pakora', 'Aloo Jeera', 'Steamed Rice', 'Tawa Roti', 'Papad'], calories: 690, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['Bhel Puri', 'Tea / Lemonade'], calories: 260, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Shahi Paneer', 'Dal Makhani', 'Biryani Rice', 'Naan', 'Ice Cream'], calories: 710, timings: '07:45 PM - 09:45 PM' }
        }
      },
      {
        dayOfWeek: 'Friday',
        meals: {
          breakfast: { menuItems: ['Uttapam', 'Sambar', 'Coconut Chutney', 'Coffee / Tea'], calories: 450, timings: '07:30 AM - 09:30 AM' },
          lunch: { menuItems: ['Veg Dum Biryani', 'Mirchi Ka Salan', 'Mixed Raita', 'Gulab Jamun'], calories: 760, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['Corn Chaat', 'Filter Coffee'], calories: 250, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Bhindi Masala', 'Dal Fry', 'Steamed Rice', 'Tawa Roti', 'Gajar Halwa'], calories: 640, timings: '07:45 PM - 09:45 PM' }
        }
      },
      {
        dayOfWeek: 'Saturday',
        meals: {
          breakfast: { menuItems: ['Puri Sabzi', 'Suji Halwa', 'Tea / Milk'], calories: 540, timings: '08:00 AM - 10:00 AM' },
          lunch: { menuItems: ['Dal Baati Churma', 'Gatta Curry', 'Rice', 'Buttermilk'], calories: 790, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['Crispy Veg Patties', 'Cold Coffee'], calories: 310, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Paneer Lababdar', 'Yellow Dal', 'Jeera Rice', 'Roti', 'Rasgulla'], calories: 670, timings: '07:45 PM - 09:45 PM' }
        }
      },
      {
        dayOfWeek: 'Sunday',
        meals: {
          breakfast: { menuItems: ['Chole Kulche / Pancakes', 'Fruit Salad', 'Juice / Tea'], calories: 510, timings: '08:00 AM - 10:00 AM' },
          lunch: { menuItems: ['Special Weekend Feast', 'Paneer Tikka Masala', 'Hyderabadi Dum Biryani', 'Raita', 'Pastry'], calories: 820, timings: '12:30 PM - 02:30 PM' },
          snacks: { menuItems: ['Pav Bhaji', 'Masala Chai'], calories: 360, timings: '05:00 PM - 06:15 PM' },
          dinner: { menuItems: ['Light Dal Khichdi', 'Mixed Veg', 'Papad', 'Curd', 'Fruit Custard'], calories: 580, timings: '07:45 PM - 09:45 PM' }
        }
      }
    ]
  },

  // 10. Mess Feedback Stats
  messFeedbackStats: {
    stats: {
      avgRating: 4.8,
      avgHygiene: 4.9,
      totalReviews: 342
    }
  },

  // 11. Digital Gate Pass & Logs
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
      student: { name: 'Alex Rivera', email: 'student@campusconnect.edu', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
      movementType: 'Check-In',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      destination: 'Central Library Complex',
      leaveStatus: 'Not Required',
      isLateEntry: false,
      verifiedBy: { name: 'Dr. Marcus Vance' },
      remarks: 'Returned 2 hours before curfew'
    },
    {
      _id: 'gate-2',
      student: { name: 'Alex Rivera', email: 'student@campusconnect.edu', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100' },
      movementType: 'Check-Out',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      destination: 'Central Library Complex',
      leaveStatus: 'Not Required',
      isLateEntry: false,
      verifiedBy: { name: 'Gate Officer Rajesh Kumar' },
      remarks: 'Campus study permission'
    },
    {
      _id: 'gate-3',
      student: { name: 'Maya Patel', email: 'maya.patel@campusconnect.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      movementType: 'Check-Out',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      destination: 'Bengaluru Hackathon Finals',
      leaveStatus: 'Approved Outstation Leave',
      isLateEntry: false,
      verifiedBy: { name: 'Gate Officer Rajesh Kumar' },
      remarks: 'Outstation gate pass passId: PASS-2026-08102'
    }
  ],

  // 12. Warden Dashboard
  wardenDashboard: {
    occupiedBeds: 320,
    availableBeds: 24,
    totalCapacity: 344,
    totalRooms: 172,
    occupancyRate: 93.0,
    pendingLeaves: 3,
    studentsOnLeave: 2,
    openComplaints: 2,
    feeSummary: {
      totalCollected: 1420000,
      totalOutstanding: 180000
    },
    stats: {
      totalResidents: 320,
      availableBeds: 24,
      pendingLeaves: 3,
      openComplaints: 2,
      occupancyRate: 93.0
    },
    recentComplaints: [
      {
        _id: 'comp-1',
        ticketNumber: 'CMP-2026-0041',
        title: 'Room 204 Fan Speed Regulator Replacement',
        description: 'Ceiling fan regulator is stuck at speed 1, requires replacement with standard 5-step electronic regulator.',
        category: 'Electricity',
        priority: 'Medium',
        status: 'In Progress',
        room: { roomNumber: '204' },
        student: { name: 'Devon Lee', email: 'devon.lee@campusconnect.edu' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'comp-2',
        ticketNumber: 'CMP-2026-0038',
        title: 'Floor 3 Water Cooler Filter Cleaning',
        description: 'Water filtration system scheduled preventive maintenance and cartridge check.',
        category: 'Water Supply',
        priority: 'High',
        status: 'Submitted',
        room: { roomNumber: '302' },
        student: { name: 'Alex Rivera', email: 'student@campusconnect.edu' },
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ],
    studentsOnLeaveList: [
      {
        _id: 'leave-w1',
        student: { name: 'Maya Patel', rollNumber: '23CSE048', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        room: { roomNumber: '204' },
        departureDate: new Date(Date.now() - 86400000).toISOString(),
        expectedReturnDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        reason: 'Attending IEEE National Hackathon finals in Bengaluru',
        destination: 'Bengaluru, Karnataka',
        emergencyContact: { phone: '+91 98112 34567' },
        status: 'Approved',
        isOverdue: false
      },
      {
        _id: 'leave-w2',
        student: { name: 'Devon Lee', rollNumber: '23CSE052', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
        room: { roomNumber: '108' },
        departureDate: new Date(Date.now() + 86400000).toISOString(),
        expectedReturnDate: new Date(Date.now() + 86400000 * 4).toISOString(),
        reason: 'Sister wedding celebration ceremony in Mumbai',
        destination: 'Mumbai, Maharashtra',
        emergencyContact: { phone: '+91 98223 45678' },
        status: 'Pending',
        isOverdue: false
      }
    ],
    recentGateLogs: [
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

  // 13. Warden Leaves List
  wardenLeaves: [
    {
      _id: 'leave-w1',
      student: { name: 'Maya Patel', rollNumber: '23CSE048', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      room: { roomNumber: '204' },
      departureDate: new Date(Date.now() - 86400000).toISOString(),
      expectedReturnDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      reason: 'Attending IEEE National Hackathon finals in Bengaluru',
      destination: 'Bengaluru, Karnataka',
      emergencyContact: { phone: '+91 98112 34567' },
      status: 'Approved',
      isOverdue: false
    },
    {
      _id: 'leave-w2',
      student: { name: 'Devon Lee', rollNumber: '23CSE052', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      room: { roomNumber: '108' },
      departureDate: new Date(Date.now() + 86400000).toISOString(),
      expectedReturnDate: new Date(Date.now() + 86400000 * 4).toISOString(),
      reason: 'Family wedding celebration in Mumbai',
      destination: 'Mumbai, Maharashtra',
      emergencyContact: { phone: '+91 98223 45678' },
      status: 'Pending',
      isOverdue: false
    },
    {
      _id: 'leave-w3',
      student: { name: 'Rohit Sharma', rollNumber: '23CSE019', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      room: { roomNumber: '312' },
      departureDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      expectedReturnDate: new Date(Date.now() - 3600000 * 4).toISOString(),
      reason: 'Urgent passport renewal at Regional Passport Office',
      destination: 'New Delhi',
      emergencyContact: { phone: '+91 98334 56789' },
      status: 'Approved',
      isOverdue: true
    }
  ],

  // 14. Student Hostel Leaves
  studentHostelLeaves: [
    {
      _id: 'shl-1',
      destination: 'Home Visit (Pune)',
      reason: 'Diwali break weekend visit with family consent verified.',
      departureDate: new Date(Date.now() - 86400000 * 10).toISOString(),
      expectedReturnDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      actualReturnDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      status: 'Returned',
      approvedBy: { name: 'Dr. Marcus Vance' },
      remarks: 'Returned punctually. Gate pass scanned successfully.'
    },
    {
      _id: 'shl-2',
      destination: 'Bengaluru Tech Park',
      reason: 'On-site technical interview round for summer cloud engineering internship.',
      departureDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      expectedReturnDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      status: 'Approved',
      approvedBy: { name: 'Dr. Marcus Vance' },
      remarks: 'Interview invitation letter submitted and verified.'
    }
  ],

  // 15. Complaints
  myComplaints: [
    {
      _id: 'my-cmp-1',
      ticketNumber: 'CMP-2026-0038',
      title: 'Floor 3 Water Cooler Filter Cleaning',
      description: 'Water filtration system scheduled preventive maintenance and cartridge check.',
      category: 'Water Supply',
      priority: 'High',
      status: 'Submitted',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      _id: 'my-cmp-2',
      ticketNumber: 'CMP-2026-0012',
      title: 'Study Desk Lamp Socket Repair',
      description: 'Desk 1 power socket was sparking intermittently. Maintenance electrician replaced the switch box.',
      category: 'Electricity',
      priority: 'Medium',
      status: 'Resolved',
      createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      resolvedAt: new Date(Date.now() - 86400000 * 13).toISOString(),
      rating: { score: 5, feedback: 'Resolved swiftly within 4 hours, excellent service!' }
    }
  ],

  allComplaints: [
    {
      _id: 'comp-1',
      ticketNumber: 'CMP-2026-0041',
      title: 'Room 204 Fan Speed Regulator Replacement',
      description: 'Ceiling fan regulator is stuck at speed 1, requires replacement with standard 5-step electronic regulator.',
      category: 'Electricity',
      priority: 'Medium',
      status: 'In Progress',
      student: { name: 'Devon Lee', email: 'devon.lee@campusconnect.edu' },
      createdAt: new Date().toISOString()
    },
    {
      _id: 'comp-2',
      ticketNumber: 'CMP-2026-0038',
      title: 'Floor 3 Water Cooler Filter Cleaning',
      description: 'Water filtration system scheduled preventive maintenance and cartridge check.',
      category: 'Water Supply',
      priority: 'High',
      status: 'Submitted',
      student: { name: 'Alex Rivera', email: 'student@campusconnect.edu' },
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      _id: 'comp-3',
      ticketNumber: 'CMP-2026-0035',
      title: 'Wi-Fi Access Point 4B Reboot Required',
      description: 'Residents experiencing packet loss and high latency on the 5GHz frequency band.',
      category: 'Wi-Fi',
      priority: 'High',
      status: 'Resolved',
      student: { name: 'Maya Patel', email: 'maya.patel@campusconnect.edu' },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      resolvedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],

  // 16. Hostel Fees
  studentFees: [
    {
      _id: 'fee-1',
      feeType: 'Semester 6 Room Rent & Mess Advance',
      academicYear: '2024-2025',
      semester: 6,
      totalAmount: 48000,
      paidAmount: 36000,
      outstandingAmount: 12000,
      dueDate: new Date(Date.now() + 86400000 * 20).toISOString(),
      status: 'Partial',
      transactions: [
        {
          _id: 'tx-101',
          amount: 36000,
          paymentMethod: 'UPI',
          transactionId: 'UPI-2026-9812401',
          receiptNumber: 'REC-HSTL-9921',
          paymentDate: new Date(Date.now() - 86400000 * 30).toISOString(),
          status: 'Completed',
          remarks: 'First installment paid online'
        }
      ]
    },
    {
      _id: 'fee-2',
      feeType: 'Semester 5 Room Rent & Mess Advance',
      academicYear: '2024-2025',
      semester: 5,
      totalAmount: 48000,
      paidAmount: 48000,
      outstandingAmount: 0,
      dueDate: new Date(Date.now() - 86400000 * 180).toISOString(),
      status: 'Paid',
      transactions: [
        {
          _id: 'tx-088',
          amount: 48000,
          paymentMethod: 'NetBanking',
          transactionId: 'NB-2025-441829',
          receiptNumber: 'REC-HSTL-8120',
          paymentDate: new Date(Date.now() - 86400000 * 185).toISOString(),
          status: 'Completed',
          remarks: 'Full semester payment'
        }
      ]
    }
  ],

  // 17. Rooms Inventory
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
    }
  ],

  // 18. Hostels Catalog
  hostels: [
    {
      _id: 'hostel-1',
      name: 'Tagore Boys Residence Hall',
      code: 'TBRH',
      type: 'Boys',
      location: 'North Campus Quad B',
      capacity: 350,
      occupied: 320,
      totalRooms: 175,
      chiefWarden: { name: 'Dr. Marcus Vance' },
      blocks: [
        { _id: 'blk-1', name: 'Block A (Chanakya Block)', totalFloors: 4, roomsCount: 90 },
        { _id: 'blk-2', name: 'Block B (Aryabhata Block)', totalFloors: 4, roomsCount: 85 }
      ]
    },
    {
      _id: 'hostel-2',
      name: 'Sarojini Girls Residence Hall',
      code: 'SGRH',
      type: 'Girls',
      location: 'South Campus Green Enclave',
      capacity: 320,
      occupied: 295,
      totalRooms: 160,
      chiefWarden: { name: 'Dr. Anita Desai' },
      blocks: [
        { _id: 'blk-3', name: 'Block A (Gargi Block)', totalFloors: 4, roomsCount: 80 },
        { _id: 'blk-4', name: 'Block B (Maitreyi Block)', totalFloors: 4, roomsCount: 80 }
      ]
    }
  ],

  // 19. Admin Overview
  adminOverview: {
    kpis: {
      totalStudents: 1420,
      totalFaculty: 86,
      totalCourses: 12,
      totalDepartments: 6,
      overallAttendanceAverage: 87.2,
      totalHostelResidents: 615,
      activeComplaints: 4,
      systemUptime: '99.98%'
    },
    departmentStats: [
      { name: 'Computer Science & Engineering', code: 'CSE', studentCount: 480, facultyCount: 28 },
      { name: 'Electronics & Communication', code: 'ECE', studentCount: 340, facultyCount: 20 },
      { name: 'Mechanical Engineering', code: 'ME', studentCount: 310, facultyCount: 18 },
      { name: 'Electrical Engineering', code: 'EE', studentCount: 290, facultyCount: 20 }
    ],
    recentAuditLogs: [
      {
        _id: 'aud-1',
        action: 'USER_LOGIN',
        performedBy: { name: 'Alex Rivera', role: 'student' },
        targetResource: 'Authentication Service',
        details: { method: 'JWT Token Refresh', ip: '192.168.1.104' },
        createdAt: new Date().toISOString()
      },
      {
        _id: 'aud-2',
        action: 'RECORD_UPDATED',
        performedBy: { name: 'Dr. Marcus Vance', role: 'warden' },
        targetResource: 'Hostel Gate Movement Log',
        details: { student: 'Maya Patel', status: 'Outstation Approved' },
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  },

  // 20. Audit Logs
  auditLogs: [
    {
      _id: 'log-101',
      createdAt: new Date().toISOString(),
      action: 'USER_LOGIN',
      performedBy: { name: 'Alex Rivera', role: 'Student' },
      targetResource: 'Student Portal',
      details: { client: 'Chrome / macOS', sessionDuration: 'Active' },
      ipAddress: '192.168.1.42'
    },
    {
      _id: 'log-102',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      action: 'USER_LOGIN',
      performedBy: { name: 'Dr. Marcus Vance', role: 'Chief Warden' },
      targetResource: 'Hostel ERP Core',
      details: { action: 'Verified Gate Passes' },
      ipAddress: '192.168.1.18'
    },
    {
      _id: 'log-103',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      action: 'RECORD_UPDATED',
      performedBy: { name: 'Prof. Alan Turing', role: 'Faculty' },
      targetResource: 'Grade Ledger (CS-601)',
      details: { subject: 'Distributed Systems', exam: 'Mid-Term Exam', count: 48 },
      ipAddress: '10.0.4.15'
    },
    {
      _id: 'log-104',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      action: 'SYSTEM_INITIALIZATION',
      performedBy: { name: 'Dr. Sarah Jenkins', role: 'Administrator' },
      targetResource: 'Campus Database',
      details: { operation: 'Academic Semester 6 Sync' },
      ipAddress: '10.0.1.2'
    }
  ],

  // 21. Faculty Dashboard Overview
  facultyDashboard: {
    facultyProfile: {
      name: 'Prof. Alan Turing',
      email: 'faculty@campusconnect.edu',
      department: 'Computer Science & Engineering',
      designation: 'Professor of Distributed Systems & AI',
      employeeId: 'FAC-CSE-001'
    },
    stats: {
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
      { _id: 'sub-cs601', name: 'Distributed Systems & Cloud', code: 'CS-601', semester: 6 },
      { _id: 'sub-cs603', name: 'Full-Stack Software Architecture Lab', code: 'CS-603', semester: 6 }
    ]
  },

  // 22. Parent Dashboard
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
          course: 'B.Tech Computer Science',
          semester: 6
        },
        relationship: 'Father / Legal Guardian'
      }
    ],
    studentOverview: {
      overallAttendance: {
        percentage: 88.4,
        attendedClasses: 115,
        totalClasses: 130,
        status: 'Good Standing (>75%)'
      },
      academicPerformance: {
        cgpa: 8.92,
        currentSemesterSgpa: 9.10,
        creditsEarned: 132
      },
      recentGrades: [
        { subject: 'Distributed Systems', code: 'CS-601', grade: 'A+', score: '94/100' },
        { subject: 'Machine Learning', code: 'CS-602', grade: 'A', score: '89/100' },
        { subject: 'Software Architecture Lab', code: 'CS-603', grade: 'O', score: '96/100' }
      ],
      hostelInfo: {
        hostel: 'Tagore Boys Residence Hall',
        room: '302',
        curfewStatus: 'In Hostel (Safe)',
        lastCheckIn: '07:15 PM Today'
      }
    }
  },

  // 23. Notifications
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

  // 24. Announcements Catalog
  announcements: [
    {
      _id: 'anc-1',
      title: 'Smart Campus Annual Innovation Hackathon 2026',
      content: 'Registration is now open for the 48-hour inter-college AI & Web3 Hackathon. Cash pool prizes worth ₹3,00,000.',
      author: { name: 'Dr. Sarah Jenkins' },
      category: 'Event',
      priority: 'High',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'anc-2',
      title: 'Semester End Examination Schedule Released',
      content: 'Theory examinations for 6th and 8th semesters commence from May 15th. Check departmental notice boards for slot details.',
      author: { name: 'Dean Office' },
      category: 'Examination',
      priority: 'Medium',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      _id: 'anc-3',
      title: 'Campus Placement Drive: Top Tier Tech Companies',
      content: 'Google, Microsoft, and NVIDIA recruitment drives commence next month for final year and pre-final year internships.',
      author: { name: 'Training & Placement Cell' },
      category: 'Placement',
      priority: 'High',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    }
  ],

  // 25. Academic Catalogs (Courses, Subjects, Departments, Faculty, Students)
  coursesList: [
    {
      _id: 'crs-1',
      name: 'B.Tech Computer Science & Engineering',
      code: 'BTECH-CSE',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      durationYears: 4,
      totalSemesters: 8
    },
    {
      _id: 'crs-2',
      name: 'B.Tech Electronics & Communication',
      code: 'BTECH-ECE',
      department: { _id: 'dept-2', name: 'Electronics & Communication' },
      durationYears: 4,
      totalSemesters: 8
    },
    {
      _id: 'crs-3',
      name: 'M.Tech Artificial Intelligence & Cloud',
      code: 'MTECH-AI',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      durationYears: 2,
      totalSemesters: 4
    }
  ],

  subjectsList: [
    {
      _id: 'sub-cs601',
      name: 'Distributed Systems & Cloud',
      code: 'CS-601',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      course: { _id: 'crs-1', name: 'B.Tech Computer Science & Engineering' },
      semester: 6,
      credits: 4
    },
    {
      _id: 'sub-cs602',
      name: 'Machine Learning & Neural Nets',
      code: 'CS-602',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      course: { _id: 'crs-1', name: 'B.Tech Computer Science & Engineering' },
      semester: 6,
      credits: 4
    },
    {
      _id: 'sub-cs603',
      name: 'Full-Stack Software Architecture Lab',
      code: 'CS-603',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      course: { _id: 'crs-1', name: 'B.Tech Computer Science & Engineering' },
      semester: 6,
      credits: 2
    },
    {
      _id: 'sub-cs604',
      name: 'Cryptography & Network Security',
      code: 'CS-604',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      course: { _id: 'crs-1', name: 'B.Tech Computer Science & Engineering' },
      semester: 6,
      credits: 4
    },
    {
      _id: 'sub-cs605',
      name: 'Compiler Design',
      code: 'CS-605',
      department: { _id: 'dept-1', name: 'Computer Science & Engineering' },
      course: { _id: 'crs-1', name: 'B.Tech Computer Science & Engineering' },
      semester: 6,
      credits: 4
    }
  ],

  departmentsList: [
    {
      _id: 'dept-1',
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Hub for artificial intelligence, distributed computing, cyber security, and advanced software engineering.',
      building: 'Engineering Complex Block A',
      establishedYear: 2012,
      headOfDepartment: { user: { name: 'Prof. Alan Turing' } }
    },
    {
      _id: 'dept-2',
      name: 'Electronics & Communication',
      code: 'ECE',
      description: 'Pioneering VLSI design, signal processing, IoT sensor networks, and optical communications.',
      building: 'Engineering Complex Block B',
      establishedYear: 2014,
      headOfDepartment: { user: { name: 'Dr. Claude Shannon' } }
    },
    {
      _id: 'dept-3',
      name: 'Mechanical & Automation Engineering',
      code: 'ME',
      description: 'Robotics, thermal dynamics, additive manufacturing, and autonomous vehicle design.',
      building: 'Main Workshop Building',
      establishedYear: 2015,
      headOfDepartment: { user: { name: 'Dr. Nikola Tesla' } }
    }
  ],

  facultyList: [
    {
      _id: 'fac-1',
      user: {
        _id: '6afbdf16f2f03db2083b577f',
        name: 'Prof. Alan Turing',
        email: 'faculty@campusconnect.edu',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      },
      employeeId: 'FAC-CSE-001',
      department: { name: 'Computer Science & Engineering' },
      designation: 'Professor & Head of Department',
      assignedSubjects: [
        { name: 'Distributed Systems & Cloud', code: 'CS-601' },
        { name: 'Full-Stack Software Architecture Lab', code: 'CS-603' }
      ]
    },
    {
      _id: 'fac-2',
      user: {
        _id: '6afbdf16f2f03db2083b5780',
        name: 'Dr. Katherine Johnson',
        email: 'kjohnson@campusconnect.edu',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
      },
      employeeId: 'FAC-CSE-002',
      department: { name: 'Computer Science & Engineering' },
      designation: 'Associate Professor of Machine Learning',
      assignedSubjects: [
        { name: 'Machine Learning & Neural Nets', code: 'CS-602' }
      ]
    },
    {
      _id: 'fac-3',
      user: {
        _id: '6afbdf16f2f03db2083b5781',
        name: 'Dr. Claude Shannon',
        email: 'cshannon@campusconnect.edu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      },
      employeeId: 'FAC-CSE-003',
      department: { name: 'Computer Science & Engineering' },
      designation: 'Professor of Information Theory & Cryptography',
      assignedSubjects: [
        { name: 'Cryptography & Network Security', code: 'CS-604' }
      ]
    }
  ],

  studentsList: [
    {
      _id: '6afbdf16f2f03db2083b577e',
      name: 'Alex Rivera',
      email: 'student@campusconnect.edu',
      rollNumber: '23CSE042',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      currentSemester: 6,
      department: { name: 'Computer Science & Engineering', code: 'CSE' },
      course: { name: 'B.Tech Computer Science', code: 'BTECH-CSE' }
    },
    {
      _id: 'st-2',
      name: 'Maya Patel',
      email: 'maya.patel@campusconnect.edu',
      rollNumber: '23CSE048',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      currentSemester: 6,
      department: { name: 'Computer Science & Engineering', code: 'CSE' },
      course: { name: 'B.Tech Computer Science', code: 'BTECH-CSE' }
    },
    {
      _id: 'st-3',
      name: 'Devon Lee',
      email: 'devon.lee@campusconnect.edu',
      rollNumber: '23CSE052',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      currentSemester: 6,
      department: { name: 'Computer Science & Engineering', code: 'CSE' },
      course: { name: 'B.Tech Computer Science', code: 'BTECH-CSE' }
    }
  ]
};

// Dispatcher for Instant Demo Mode Responses (<1ms)
export const getDemoResponse = (url = '', method = 'get') => {
  const cleanUrl = (url || '').split('?')[0].toLowerCase();
  const verb = (method || 'get').toLowerCase();

  // AI Chat endpoint
  if (cleanUrl.includes('/ai/chat')) {
    return {
      success: true,
      data: {
        reply: `Hello! I'm **CampusConnect AI**. Based on live records, you have **88.4% overall attendance** across your 4 active courses (Distributed Systems: 93.3%, Machine Learning: 86.7%). Your next lecture is **Distributed Systems & Cloud** in Lecture Hall 401. How else can I assist your academic journey today?`
      }
    };
  }

  // Material Summarize endpoint
  if (cleanUrl.includes('/summarize')) {
    return {
      success: true,
      data: {
        summary: `### 🤖 CampusConnect AI Document Digest\n- **Core Topic**: Distributed Consensus & High-Availability Architecture\n- **Key Takeaways**: Explains Paxos state machines, Raft leader election, heartbeats, and network split-brain prevention.\n- **Exam Relevance**: High probability of questions on log replication invariants and quorum size calculation.`
      }
    };
  }

  // Read endpoints
  if (verb === 'get') {
    // 1. Students & Academic
    if (cleanUrl.includes('/students/dashboard/overview')) {
      return { success: true, data: DEMO_DATA.studentDashboardOverview };
    }
    if (cleanUrl.includes('/attendance/student/')) {
      return { success: true, data: DEMO_DATA.studentAttendanceDetails };
    }
    if (cleanUrl.includes('/attendance')) {
      return { success: true, data: DEMO_DATA.studentAttendanceDetails.subjectBreakdown };
    }
    if (cleanUrl.includes('/grades/student/')) {
      return { success: true, data: DEMO_DATA.studentGradesDetails };
    }
    if (cleanUrl.includes('/timetable')) {
      return { success: true, data: DEMO_DATA.timetableData };
    }
    if (cleanUrl.includes('/materials')) {
      return { success: true, data: DEMO_DATA.materialsData };
    }
    if (cleanUrl.includes('/assignments')) {
      return { success: true, data: { assignments: DEMO_DATA.studentDashboardOverview.pendingAssignments } };
    }
    if (cleanUrl.includes('/leaves/my-leaves') || cleanUrl.includes('/leaves/all')) {
      return { success: true, data: DEMO_DATA.academicLeaves };
    }

    // 2. Hostel Module
    if (cleanUrl.includes('/hostel/dashboard/student')) {
      return { success: true, data: DEMO_DATA.hostelStudentDashboard };
    }
    if (cleanUrl.includes('/hostel/my-allocation')) {
      return { success: true, data: DEMO_DATA.myAllocation };
    }
    if (cleanUrl.includes('/hostel/mess-menu')) {
      return { success: true, data: DEMO_DATA.messMenu };
    }
    if (cleanUrl.includes('/hostel/mess-feedback')) {
      return { success: true, data: DEMO_DATA.messFeedbackStats };
    }
    if (cleanUrl.includes('/hostel/gate/my-pass')) {
      return { success: true, data: DEMO_DATA.gatePass };
    }
    if (cleanUrl.includes('/hostel/gate/my-logs') || cleanUrl.includes('/hostel/gate/all-logs')) {
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
      return { success: true, data: DEMO_DATA.wardenLeaves };
    }
    if (cleanUrl.includes('/hostel/leaves/my')) {
      return { success: true, data: DEMO_DATA.studentHostelLeaves };
    }
    if (cleanUrl.includes('/hostel/complaints/all')) {
      return { success: true, data: DEMO_DATA.allComplaints };
    }
    if (cleanUrl.includes('/hostel/complaints/my')) {
      return { success: true, data: DEMO_DATA.myComplaints };
    }
    if (cleanUrl.includes('/hostel/fees/my')) {
      return {
        success: true,
        data: {
          fees: DEMO_DATA.studentFees,
          totalDue: 12000,
          totalPaid: 36000
        }
      };
    }
    if (cleanUrl.includes('/hostel/fees/all')) {
      return { success: true, data: DEMO_DATA.studentFees };
    }
    if (cleanUrl.includes('/hostel/announcements')) {
      return { success: true, data: DEMO_DATA.hostelStudentDashboard.announcements };
    }

    // 3. Faculty, Admin, Parents & Shared
    if (cleanUrl.includes('/users/admin-overview')) {
      return { success: true, data: DEMO_DATA.adminOverview };
    }
    if (cleanUrl.includes('/users/audit-logs')) {
      return { success: true, data: { logs: DEMO_DATA.auditLogs } };
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
      return { success: true, data: { announcements: DEMO_DATA.announcements } };
    }
    if (cleanUrl.includes('/students')) {
      return { success: true, data: { students: DEMO_DATA.studentsList } };
    }
    if (cleanUrl.includes('/faculty')) {
      return { success: true, data: { faculty: DEMO_DATA.facultyList } };
    }
    if (cleanUrl.includes('/courses')) {
      return { success: true, data: { courses: DEMO_DATA.coursesList } };
    }
    if (cleanUrl.includes('/subjects')) {
      return { success: true, data: { subjects: DEMO_DATA.subjectsList } };
    }
    if (cleanUrl.includes('/departments')) {
      return { success: true, data: { departments: DEMO_DATA.departmentsList } };
    }
    if (cleanUrl.includes('/auth/me')) {
      return { success: true, data: { user: DEMO_USERS.student } };
    }
  }

  // Mutating endpoints (simulated success)
  return {
    success: true,
    message: 'Action completed successfully in Live Demo Mode.',
    data: {
      _id: 'sim-' + Date.now(),
      receiptNumber: 'REC-HSTL-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Completed'
    }
  };
};
