require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const FacultyProfile = require('../models/FacultyProfile');
const ParentStudentLink = require('../models/ParentStudentLink');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Grade = require('../models/Grade');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const LeaveRequest = require('../models/LeaveRequest');
const StudyMaterial = require('../models/StudyMaterial');
const AuditLog = require('../models/AuditLog');
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

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';
    await mongoose.connect(uri);
    console.log('[Seed] Connected to database for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      StudentProfile.deleteMany({}),
      FacultyProfile.deleteMany({}),
      ParentStudentLink.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Subject.deleteMany({}),
      Timetable.deleteMany({}),
      Attendance.deleteMany({}),
      Assignment.deleteMany({}),
      Submission.deleteMany({}),
      Grade.deleteMany({}),
      Announcement.deleteMany({}),
      Notification.deleteMany({}),
      LeaveRequest.deleteMany({}),
      StudyMaterial.deleteMany({}),
      AuditLog.deleteMany({}),
      Hostel.deleteMany({}),
      HostelBlock.deleteMany({}),
      HostelRoom.deleteMany({}),
      RoomAllocation.deleteMany({}),
      HostelLeaveRequest.deleteMany({}),
      HostelComplaint.deleteMany({}),
      HostelFee.deleteMany({}),
      MessMenu.deleteMany({}),
      MessFeedback.deleteMany({}),
      HostelGateLog.deleteMany({}),
      HostelAnnouncement.deleteMany({})
    ]);

    console.log('[Seed] Database cleaned.');

    // 1. Create Core Users
    console.log('[Seed] Creating core demo users...');
    const adminUser = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'admin@campusconnect.edu',
      password: 'Admin@123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    const facultyUser1 = await User.create({
      name: 'Prof. Alan Turing',
      email: 'faculty@campusconnect.edu',
      password: 'Faculty@123',
      role: 'faculty',
      phone: '+1 (555) 018-9943',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });

    const facultyUser2 = await User.create({
      name: 'Dr. Katherine Johnson',
      email: 'kjohnson@campusconnect.edu',
      password: 'Faculty@123',
      role: 'faculty',
      phone: '+1 (555) 018-4412',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    });

    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'student@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 017-3829',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    });

    const studentUser2 = await User.create({
      name: 'Maya Patel',
      email: 'maya.patel@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 017-9182',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });

    const parentUser = await User.create({
      name: 'Robert Rivera',
      email: 'parent@campusconnect.edu',
      password: 'Parent@123',
      role: 'parent',
      phone: '+1 (555) 016-5521',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });

    const wardenUser = await User.create({
      name: 'Dr. Marcus Vance',
      email: 'warden@campusconnect.edu',
      password: 'Warden@123',
      role: 'warden',
      phone: '+1 (555) 019-7711',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    });

    const studentUser3 = await User.create({
      name: 'Devon Lee',
      email: 'devon.lee@campusconnect.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+1 (555) 017-4491',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    });

    // 2. Create Departments
    console.log('[Seed] Creating academic departments...');
    const deptCSE = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE',
      description: 'Department of Computing, Artificial Intelligence & Software Systems',
      headOfDepartment: facultyUser1._id,
      building: 'Alan Turing Engineering Tower',
      establishedYear: 2004
    });

    const deptECE = await Department.create({
      name: 'Electronics & Communication',
      code: 'ECE',
      description: 'VLSI, Embedded Systems, Signal Processing & Telecommunication',
      headOfDepartment: facultyUser2._id,
      building: 'Nikola Tesla Hall',
      establishedYear: 2006
    });

    const deptME = await Department.create({
      name: 'Mechanical Engineering',
      code: 'ME',
      description: 'Robotics, Thermal Engineering & Advanced Manufacturing',
      building: 'Watt Mechanics Wing',
      establishedYear: 2008
    });

    // 3. Create Courses
    console.log('[Seed] Creating degree courses...');
    const courseBTechCSE = await Course.create({
      name: 'B.Tech in Computer Science & Engineering',
      code: 'BTECH-CSE',
      department: deptCSE._id,
      durationYears: 4,
      totalSemesters: 8,
      degreeType: 'Undergraduate',
      description: 'Four-year comprehensive undergraduate engineering program in computing'
    });

    const courseBTechECE = await Course.create({
      name: 'B.Tech in Electronics & Communication',
      code: 'BTECH-ECE',
      department: deptECE._id,
      durationYears: 4,
      totalSemesters: 8,
      degreeType: 'Undergraduate'
    });

    // 4. Create Subjects
    console.log('[Seed] Creating curriculum subjects...');
    const sub1 = await Subject.create({
      name: 'Distributed Systems & Cloud Computing',
      code: 'CS601',
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 6,
      credits: 4,
      faculty: facultyUser1._id,
      syllabus: 'Consensus protocols, CAP theorem, MapReduce, Docker, Kubernetes, Microservices'
    });

    const sub2 = await Subject.create({
      name: 'Artificial Intelligence & Machine Learning',
      code: 'CS602',
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 6,
      credits: 4,
      faculty: facultyUser1._id,
      syllabus: 'Supervised Learning, Deep Neural Networks, Transformer Architectures, NLP'
    });

    const sub3 = await Subject.create({
      name: 'Full Stack Web Development',
      code: 'CS603',
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 6,
      credits: 4,
      faculty: facultyUser2._id,
      syllabus: 'React, Node.js, Express, MongoDB, RESTful APIs, WebSockets, Security'
    });

    const sub4 = await Subject.create({
      name: 'Computer Networks & Cybersecurity',
      code: 'CS604',
      department: deptCSE._id,
      course: courseBTechCSE._id,
      semester: 6,
      credits: 3,
      faculty: facultyUser2._id,
      syllabus: 'TCP/IP, Routing Protocols, Public Key Cryptography, Firewalls, Threat Analysis'
    });

    // 5. Create Profiles
    console.log('[Seed] Creating faculty & student profiles...');
    await FacultyProfile.create({
      user: facultyUser1._id,
      employeeId: 'EMP-CSE-001',
      department: deptCSE._id,
      designation: 'Professor',
      qualification: 'Ph.D. in Distributed Computing (MIT)',
      specialization: 'Distributed Systems, Cloud & AI',
      officeRoom: 'Faculty Wing A-402',
      assignedSubjects: [sub1._id, sub2._id]
    });

    await FacultyProfile.create({
      user: facultyUser2._id,
      employeeId: 'EMP-CSE-002',
      department: deptCSE._id,
      designation: 'Associate Professor',
      qualification: 'Ph.D. in Computer Science (Stanford)',
      specialization: 'Full Stack Systems & Network Security',
      officeRoom: 'Faculty Wing A-408',
      assignedSubjects: [sub3._id, sub4._id]
    });

    const alexProfile = await StudentProfile.create({
      user: studentUser._id,
      enrollmentNumber: 'EN2023CSE042',
      rollNumber: '23CSE042',
      department: deptCSE._id,
      course: courseBTechCSE._id,
      currentSemester: 6,
      section: 'A',
      batchYear: '2023-2027',
      gender: 'Male',
      address: {
        street: '742 Evergreen Campus Avenue',
        city: 'Metropolis',
        state: 'California',
        zipCode: '90210'
      },
      guardianContact: {
        name: 'Robert Rivera',
        relationship: 'Father',
        phone: '+1 (555) 016-5521',
        email: 'parent@campusconnect.edu'
      }
    });

    await StudentProfile.create({
      user: studentUser2._id,
      enrollmentNumber: 'EN2023CSE045',
      rollNumber: '23CSE045',
      department: deptCSE._id,
      course: courseBTechCSE._id,
      currentSemester: 6,
      section: 'A',
      batchYear: '2023-2027',
      gender: 'Female'
    });

    // Link Parent to Alex Rivera
    console.log('[Seed] Linking parent to student account...');
    await ParentStudentLink.create({
      parent: parentUser._id,
      student: studentUser._id,
      relationship: 'Father',
      verified: true
    });

    // 6. Timetable
    console.log('[Seed] Creating timetable...');
    const scheduleItems = [
      { day: 'Monday', start: '09:00', end: '10:00', sub: sub1, fac: facultyUser1, room: 'Room 301' },
      { day: 'Monday', start: '10:15', end: '11:15', sub: sub2, fac: facultyUser1, room: 'AI Lab 2' },
      { day: 'Monday', start: '11:30', end: '12:30', sub: sub3, fac: facultyUser2, room: 'Room 301' },
      { day: 'Tuesday', start: '09:00', end: '10:00', sub: sub4, fac: facultyUser2, room: 'Room 302' },
      { day: 'Tuesday', start: '10:15', end: '11:15', sub: sub1, fac: facultyUser1, room: 'Room 301' },
      { day: 'Wednesday', start: '09:00', end: '11:00', sub: sub3, fac: facultyUser2, room: 'Web Dev Lab' },
      { day: 'Wednesday', start: '11:30', end: '12:30', sub: sub2, fac: facultyUser1, room: 'AI Lab 2' },
      { day: 'Thursday', start: '10:00', end: '11:00', sub: sub1, fac: facultyUser1, room: 'Room 301' },
      { day: 'Thursday', start: '11:15', end: '12:15', sub: sub4, fac: facultyUser2, room: 'Room 302' },
      { day: 'Friday', start: '09:30', end: '10:30', sub: sub2, fac: facultyUser1, room: 'Room 301' },
      { day: 'Friday', start: '10:45', end: '11:45', sub: sub3, fac: facultyUser2, room: 'Room 301' }
    ];

    for (const item of scheduleItems) {
      await Timetable.create({
        department: deptCSE._id,
        course: courseBTechCSE._id,
        semester: 6,
        section: 'A',
        dayOfWeek: item.day,
        startTime: item.start,
        endTime: item.end,
        subject: item.sub._id,
        faculty: item.fac._id,
        roomNumber: item.room
      });
    }

    // 7. Attendance Records (Last 30 days)
    console.log('[Seed] Populating realistic attendance history...');
    const subjectsList = [
      { sub: sub1, targetRate: 0.92 }, // 92% attendance
      { sub: sub2, targetRate: 0.85 }, // 85% attendance
      { sub: sub3, targetRate: 0.90 }, // 90% attendance
      { sub: sub4, targetRate: 0.68 }  // 68% attendance (Triggers Low Attendance Warning!)
    ];

    for (const subItem of subjectsList) {
      for (let i = 25; i >= 1; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const isPresent = Math.random() < subItem.targetRate;
        const status = isPresent ? 'present' : (Math.random() < 0.2 ? 'leave' : 'absent');

        await Attendance.create({
          student: studentUser._id,
          subject: subItem.sub._id,
          faculty: subItem.sub.faculty,
          date: d,
          status,
          verifiedVia: i % 4 === 0 ? 'qr' : 'manual'
        });

        // Also add attendance for Maya Patel
        await Attendance.create({
          student: studentUser2._id,
          subject: subItem.sub._id,
          faculty: subItem.sub.faculty,
          date: d,
          status: 'present',
          verifiedVia: 'manual'
        });
      }
    }

    // 8. Assignments
    console.log('[Seed] Creating assignments...');
    const now = new Date();

    const asg1 = await Assignment.create({
      title: 'Consensus Algorithms: Implementing Raft State Machine',
      description: 'Implement leader election and log replication using the Raft consensus model in Node.js or Go. Include unit tests demonstrating cluster failover.',
      subject: sub1._id,
      faculty: facultyUser1._id,
      department: deptCSE._id,
      semester: 6,
      dueDate: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // Due in 6 days
      maxMarks: 100,
      attachment: {
        url: '/uploads/Raft_Specification_Guide.pdf',
        fileName: 'Raft_Specification_Guide.pdf'
      },
      status: 'published'
    });

    const asg2 = await Assignment.create({
      title: 'Deep Learning: Image Classification with CNNs',
      description: 'Train a Convolutional Neural Network on the CIFAR-10 dataset using PyTorch or TensorFlow. Achieve at least 85% validation accuracy.',
      subject: sub2._id,
      faculty: facultyUser1._id,
      department: deptCSE._id,
      semester: 6,
      dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Submitted past due
      maxMarks: 100,
      attachment: {
        url: '/uploads/CNN_Lab_Exercise.pdf',
        fileName: 'CNN_Lab_Exercise.pdf'
      },
      status: 'published'
    });

    const asg3 = await Assignment.create({
      title: 'Enterprise Architecture: RESTful Microservices & WebSockets',
      description: 'Architect a real-time collaborative dashboard using React, Tailwind CSS, Express, and Socket.IO. Provide full swagger documentation.',
      subject: sub3._id,
      faculty: facultyUser2._id,
      department: deptCSE._id,
      semester: 6,
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
      maxMarks: 50,
      status: 'published'
    });

    // 9. Submissions
    console.log('[Seed] Creating assignment submissions & grades...');
    await Submission.create({
      assignment: asg2._id,
      student: studentUser._id,
      submissionDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      fileUrl: '/uploads/AlexRivera_CNN_Report.pdf',
      fileName: 'AlexRivera_CNN_Report.pdf',
      content: 'Implemented ResNet-18 variant with data augmentation achieving 89.4% accuracy.',
      isLate: false,
      marksObtained: 94,
      feedback: 'Outstanding experimental analysis, hyperparameter ablation, and clean confusion matrix visualizations!',
      gradedBy: facultyUser1._id,
      gradedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      status: 'graded'
    });

    // 10. Semester Grades
    console.log('[Seed] Recording semester internal and midterm grades...');
    await Grade.create({
      student: studentUser._id,
      subject: sub1._id,
      semester: 6,
      academicYear: '2024-2025',
      examType: 'Midterm',
      marksObtained: 92,
      maxMarks: 100,
      gradeLetter: 'O',
      gradePoint: 10,
      remarks: 'Top 3 in class performance on distributed consensus problem',
      recordedBy: facultyUser1._id
    });

    await Grade.create({
      student: studentUser._id,
      subject: sub2._id,
      semester: 6,
      academicYear: '2024-2025',
      examType: 'Midterm',
      marksObtained: 88,
      maxMarks: 100,
      gradeLetter: 'A+',
      gradePoint: 9,
      remarks: 'Strong conceptual clarity in neural network backpropagation',
      recordedBy: facultyUser1._id
    });

    await Grade.create({
      student: studentUser._id,
      subject: sub3._id,
      semester: 6,
      academicYear: '2024-2025',
      examType: 'Internal 1',
      marksObtained: 46,
      maxMarks: 50,
      gradeLetter: 'O',
      gradePoint: 10,
      remarks: 'Exceptional component modularity and API contracts',
      recordedBy: facultyUser2._id
    });

    await Grade.create({
      student: studentUser._id,
      subject: sub4._id,
      semester: 6,
      academicYear: '2024-2025',
      examType: 'Internal 1',
      marksObtained: 38,
      maxMarks: 50,
      gradeLetter: 'A',
      gradePoint: 8,
      remarks: 'Good network packet analysis work',
      recordedBy: facultyUser2._id
    });

    // 11. Study Materials
    console.log('[Seed] Creating study materials...');
    await StudyMaterial.create({
      title: 'Distributed Systems & Cloud Computing Comprehensive Lecture Notes',
      description: 'Covers logical clocks (Lamport, Vector), Byzantine Fault Tolerance, and Cloud virtualization architectures.',
      subject: sub1._id,
      faculty: facultyUser1._id,
      department: deptCSE._id,
      semester: 6,
      category: 'Lecture Notes',
      fileUrl: '/uploads/CS601_Distributed_Systems_Notes.pdf',
      fileName: 'CS601_Distributed_Systems_Notes.pdf',
      fileSize: '4.8 MB',
      summary: 'Comprehensive review of distributed consensus algorithms including Paxos and Raft, vector clocks for causal ordering, and CAP theorem trade-offs in cloud databases.',
      downloadsCount: 142
    });

    await StudyMaterial.create({
      title: 'Modern Deep Learning & Computer Vision Slide Deck',
      description: 'Detailed slides with architectures: AlexNet, VGG, ResNet, and Vision Transformers.',
      subject: sub2._id,
      faculty: facultyUser1._id,
      department: deptCSE._id,
      semester: 6,
      category: 'Presentation',
      fileUrl: '/uploads/CS602_Deep_Learning_Slides.pdf',
      fileName: 'CS602_Deep_Learning_Slides.pdf',
      fileSize: '8.2 MB',
      summary: 'High-yield slides illustrating convolution, pooling, batch normalization, residual connections, and transfer learning workflows for image recognition.',
      downloadsCount: 189
    });

    await StudyMaterial.create({
      title: 'Full Stack MERN Production Handbook & REST API Guide',
      description: 'Industry-standard guidelines on JWT security, input sanitization, indexing strategies, and WebSocket scalability.',
      subject: sub3._id,
      faculty: facultyUser2._id,
      department: deptCSE._id,
      semester: 6,
      category: 'Lab Manual',
      fileUrl: '/uploads/CS603_MERN_Production_Guide.pdf',
      fileName: 'CS603_MERN_Production_Guide.pdf',
      fileSize: '3.1 MB',
      summary: 'Practical guide to building scalable full stack apps: MongoDB index optimization, bcrypt password hashing, JWT refresh tokens, and Socket.IO cluster setup.',
      downloadsCount: 220
    });

    // 12. College Announcements
    console.log('[Seed] Creating official campus announcements...');
    await Announcement.create({
      title: 'End-Semester Examination Schedule Announced (Spring 2026)',
      content: 'The official timetable for End-Semester Examinations has been finalized. Theory examinations will commence on May 12, 2026. Hall tickets will be issued through the CampusConnect student portal starting next Monday. Students with attendance below 75% must contact their respective department HODs immediately.',
      author: adminUser._id,
      targetAudience: ['all'],
      priority: 'high',
      category: 'Examination',
      isPinned: true
    });

    await Announcement.create({
      title: 'Global Campus Placement Drive 2026 - Tier 1 Tech Recruiters',
      content: 'CampusConnect placement cell is delighted to announce recruitment drives with leading tech leaders including Google, Microsoft, and Amazon. Eligible 6th and 8th semester students with CGPA >= 7.5 are invited to submit their verified resumes on the portal before Friday.',
      author: adminUser._id,
      targetAudience: ['student', 'faculty'],
      priority: 'urgent',
      category: 'Placement',
      isPinned: true
    });

    await Announcement.create({
      title: 'Annual International Tech Symposium - HackCampus 2026',
      content: 'Join us for a 48-hour national hackathon focused on Generative AI, Sustainable Tech, and Decentralized Systems. Cash prize pool of $25,000. Registrations close this weekend.',
      author: facultyUser1._id,
      targetAudience: ['student'],
      priority: 'normal',
      category: 'Event',
      isPinned: false
    });

    // 13. Notifications
    console.log('[Seed] Creating user notifications...');
    await Notification.create({
      recipient: studentUser._id,
      title: '⚠️ Low Attendance Warning',
      message: 'Your attendance in Computer Networks & Cybersecurity (CS604) has dropped to 68%. Attend the next 5 lectures to regain academic examination eligibility.',
      type: 'attendance',
      link: '/student/attendance',
      isRead: false
    });

    await Notification.create({
      recipient: studentUser._id,
      title: '🎯 Grade Released: CNN Report',
      message: 'Prof. Alan Turing graded your Deep Learning Assignment: 94/100 (Grade O).',
      type: 'grade',
      link: '/student/assignments',
      isRead: false
    });

    await Notification.create({
      recipient: studentUser._id,
      title: '⏰ Assignment Deadline Approaching',
      message: 'RESTful Microservices & WebSockets is due in 3 days. Complete and submit on time.',
      type: 'deadline',
      link: '/student/assignments',
      isRead: true
    });

    await Notification.create({
      recipient: facultyUser1._id,
      title: '📥 Student Submissions Pending',
      message: '14 new submissions received for Consensus Algorithms: Raft State Machine.',
      type: 'assignment',
      link: '/faculty/assignments',
      isRead: false
    });

    await Notification.create({
      recipient: parentUser._id,
      title: '📊 Student Monthly Academic Summary',
      message: 'Alex Rivera maintains an overall CGPA of 8.92 with 83.8% cumulative campus attendance.',
      type: 'system',
      link: '/parent/dashboard',
      isRead: false
    });

    // 14. Hostel System Seed Data
    console.log('[Seed] Seeding Hostels, Blocks, and Rooms...');
    const boysHostel = await Hostel.create({
      name: 'Aryabhata Boys Residence Hall',
      code: 'BH-1',
      type: 'Boys',
      description: 'Premier air-conditioned residential facility for engineering and computing students.',
      location: 'North Campus, Sector 4',
      contactNumber: '+1 (555) 019-8800',
      wardens: [wardenUser._id],
      chiefWarden: wardenUser._id,
      totalRooms: 60,
      totalCapacity: 120,
      isActive: true
    });

    const girlsHostel = await Hostel.create({
      name: 'Kalpana Chawla Girls Residence Hall',
      code: 'GH-1',
      type: 'Girls',
      description: 'Secure, modern residential complex with gym, study halls, and high-speed Wi-Fi.',
      location: 'South Campus, Sector 2',
      contactNumber: '+1 (555) 019-8822',
      wardens: [wardenUser._id],
      chiefWarden: wardenUser._id,
      totalRooms: 50,
      totalCapacity: 100,
      isActive: true
    });

    const blockA = await HostelBlock.create({
      hostel: boysHostel._id,
      name: 'Block A (Arya)',
      code: 'BLK-A',
      blockName: 'Block A (Arya)',
      totalFloors: 4,
      description: 'Senior B.Tech & Research Scholars Wing'
    });

    const blockB = await HostelBlock.create({
      hostel: boysHostel._id,
      name: 'Block B (Bhaskara)',
      code: 'BLK-B',
      blockName: 'Block B (Bhaskara)',
      totalFloors: 4,
      description: 'Junior Undergraduate Wing'
    });

    const blockGirlsA = await HostelBlock.create({
      hostel: girlsHostel._id,
      name: 'Block A (Maitreyi)',
      code: 'BLK-GA',
      blockName: 'Block A (Maitreyi)',
      totalFloors: 4,
      description: 'Undergraduate & Postgraduate Wing'
    });

    // Rooms for Block A
    const room204 = await HostelRoom.create({
      hostel: boysHostel._id,
      block: blockA._id,
      roomNumber: '204',
      floor: 2,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 2,
      monthlyRent: 4800,
      amenities: ['High-speed Wi-Fi', 'Attached Washroom', 'Air Conditioner', 'Study Desk', 'Ergonomic Chair', 'Wardrobe', 'Balcony'],
      status: 'Full'
    });

    const room205 = await HostelRoom.create({
      hostel: boysHostel._id,
      block: blockA._id,
      roomNumber: '205',
      floor: 2,
      roomType: 'Single',
      capacity: 1,
      occupiedBeds: 0,
      monthlyRent: 6500,
      amenities: ['High-speed Wi-Fi', 'Attached Washroom', 'Air Conditioner', 'Study Desk', 'Ergonomic Chair', 'Mini Fridge'],
      status: 'Available'
    });

    const room206 = await HostelRoom.create({
      hostel: boysHostel._id,
      block: blockA._id,
      roomNumber: '206',
      floor: 2,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 1,
      monthlyRent: 4800,
      amenities: ['High-speed Wi-Fi', 'Attached Washroom', 'Study Desk', 'Ergonomic Chair'],
      status: 'Available'
    });

    const room301 = await HostelRoom.create({
      hostel: boysHostel._id,
      block: blockA._id,
      roomNumber: '301',
      floor: 3,
      roomType: 'Triple',
      capacity: 3,
      occupiedBeds: 0,
      monthlyRent: 3800,
      amenities: ['High-speed Wi-Fi', 'Attached Washroom', 'Study Desks', 'Wardrobes'],
      status: 'Available'
    });

    // Girls room
    await HostelRoom.create({
      hostel: girlsHostel._id,
      block: blockGirlsA._id,
      roomNumber: '102',
      floor: 1,
      roomType: 'Double',
      capacity: 2,
      occupiedBeds: 1,
      monthlyRent: 4800,
      amenities: ['High-speed Wi-Fi', 'Attached Washroom', 'Air Conditioner', 'Study Desk'],
      status: 'Available'
    });

    // 15. Room Allocations
    console.log('[Seed] Allocating rooms (Alex Rivera & Devon Lee as roommates in Room 204)...');
    const alexAllocation = await RoomAllocation.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      block: blockA._id,
      room: room204._id,
      bedNumber: 1,
      academicYear: '2024-2025',
      allocatedBy: wardenUser._id,
      status: 'Active',
      remarks: 'Primary merit allocation'
    });

    const devonAllocation = await RoomAllocation.create({
      student: studentUser3._id,
      hostel: boysHostel._id,
      block: blockA._id,
      room: room204._id,
      bedNumber: 2,
      academicYear: '2024-2025',
      allocatedBy: wardenUser._id,
      status: 'Active',
      remarks: 'Allocated to Room 204 Bed 2'
    });

    // 16. Weekly Mess Menu
    console.log('[Seed] Seeding 7-Day nutritious mess menu...');
    const days = [
      {
        dayOfWeek: 'Monday',
        breakfast: { items: ['Masala Dosa with Sambar & Coconut Chutney', 'Boiled Eggs / Sprouts', 'Tea / Fresh Coffee', 'Seasonal Fresh Fruits'], timing: '07:30 AM - 09:30 AM' },
        lunch: { items: ['Paneer Butter Masala', 'Yellow Dal Tadka', 'Jeera Rice', 'Butter Roti', 'Cucumber Salad & Mint Raita'], timing: '12:30 PM - 02:30 PM' },
        snacks: { items: ['Crispy Samosa with Mint Chutney', 'Hot Masala Chai'], timing: '05:00 PM - 06:15 PM' },
        dinner: { items: ['Kadai Chicken / Malai Kofta', 'Dal Makhani', 'Steamed Basmati Rice', 'Tandoori Roti', 'Gulab Jamun'], timing: '07:45 PM - 09:45 PM' }
      },
      {
        dayOfWeek: 'Tuesday',
        breakfast: { items: ['Poha with Roasted Peanuts', 'Upma', 'Boiled Eggs', 'Milk / Tea / Coffee', 'Bananas'], timing: '07:30 AM - 09:30 AM' },
        lunch: { items: ['Aloo Gobi Adraki', 'Rajma Masala', 'Steamed Rice', 'Tawa Chapati', 'Kachumber Salad'], timing: '12:30 PM - 02:30 PM' },
        snacks: { items: ['Veg Grilled Sandwich', 'Lemon Iced Tea'], timing: '05:00 PM - 06:15 PM' },
        dinner: { items: ['Mixed Veg Handi', 'Chana Dal Fry', 'Jeera Rice', 'Phulka', 'Fruit Custard'], timing: '07:45 PM - 09:45 PM' }
      },
      {
        dayOfWeek: 'Wednesday',
        breakfast: { items: ['Aloo Paratha with Curd & Pickle', 'Poha', 'Boiled Eggs', 'Tea / Coffee', 'Apples'], timing: '07:30 AM - 09:30 AM' },
        lunch: { items: ['Palak Paneer', 'Moong Dal Fry', 'Curd Rice', 'Steamed Rice', 'Chapati', 'Papad'], timing: '12:30 PM - 02:30 PM' },
        snacks: { items: ['White Sauce Pasta with Herbs', 'Filter Coffee'], timing: '05:00 PM - 06:15 PM' },
        dinner: { items: ['Butter Chicken / Shahi Paneer', 'Dal Tadka', 'Peas Pulao', 'Butter Naan', 'Rasgulla'], timing: '07:45 PM - 09:45 PM' }
      },
      {
        dayOfWeek: 'Thursday',
        breakfast: { items: ['Idli Sambar with Tomato & Coconut Chutney', 'Vada', 'Sprouts Salad', 'Tea / Coffee'], timing: '07:30 AM - 09:30 AM' },
        lunch: { items: ['Chole Bhature with Pickled Onions', 'Jeera Rice', 'Boondi Raita', 'Green Salad'], timing: '12:30 PM - 02:30 PM' },
        snacks: { items: ['Pani Puri & Bhel Puri Live Counter', 'Cardamom Tea'], timing: '05:00 PM - 06:15 PM' },
        dinner: { items: ['Bhindi Do Pyaza', 'Panchmel Dal', 'Steamed Rice', 'Roti', 'Moong Dal Halwa'], timing: '07:45 PM - 09:45 PM' }
      },
      {
        dayOfWeek: 'Friday',
        breakfast: { items: ['Methi Thepla with Chunda', 'Oatmeal Porridge', 'Boiled Eggs', 'Fresh Orange Juice / Tea'], timing: '07:30 AM - 09:30 AM' },
        lunch: { items: ['Mushroom Matar Masala', 'Dal Palak', 'Kashmiri Pulao', 'Tandoori Roti', 'Onion Salad'], timing: '12:30 PM - 02:30 PM' },
        snacks: { items: ['French Fries with Peri-Peri Dip', 'Cold Coffee'], timing: '05:00 PM - 06:15 PM' },
        dinner: { items: ['Egg Curry / Paneer Tikka Masala', 'Dal Fry', 'Steamed Rice', 'Butter Roti', 'Ice Cream Sundae'], timing: '07:45 PM - 09:45 PM' }
      },
      {
        dayOfWeek: 'Saturday',
        breakfast: { items: ['Puri Bhaji with Halwa', 'Cornflakes with Warm Milk', 'Tea / Coffee'], timing: '07:30 AM - 09:30 AM' },
        lunch: { items: ['Hyderabadi Dum Biryani (Chicken/Veg)', 'Mirchi Ka Salan', 'Burani Raita', 'Roasted Papad'], timing: '12:30 PM - 02:30 PM' },
        snacks: { items: ['Veg Cutlets with Mint Mayo', 'Ginger Tea'], timing: '05:00 PM - 06:15 PM' },
        dinner: { items: ['Baingan Bharta', 'Yellow Dal Double Tadka', 'Steamed Rice', 'Chapati', 'Kheer'], timing: '07:45 PM - 09:45 PM' }
      },
      {
        dayOfWeek: 'Sunday',
        isSpecial: true,
        specialNote: 'Special Sunday Grand Feast with Live Counters & Desserts',
        breakfast: { items: ['Continental Spread: Pancakes with Maple Syrup, Hash Browns, Scrambled Eggs, Croissants, Fresh Watermelon Juice'], timing: '08:00 AM - 10:30 AM' },
        lunch: { items: ['Special Sunday Thali: Dal Makhani, Paneer Lababdar, Dum Aloo, Jeera Rice, Garlic Butter Naan, Gulab Jamun, Paan'], timing: '12:30 PM - 03:00 PM' },
        snacks: { items: ['Chaat Counter: Dahi Puri, Sev Puri, Masala Chai'], timing: '05:00 PM - 06:30 PM' },
        dinner: { items: ['Mutton Rogan Josh / Paneer Pasanda', 'Dal Bukhara', 'Saffron Pulao', 'Rumali Roti', 'Warm Brownie with Vanilla Ice Cream'], timing: '07:45 PM - 10:00 PM' }
      }
    ];

    for (const menuData of days) {
      await MessMenu.create({
        hostel: boysHostel._id,
        ...menuData,
        updatedBy: wardenUser._id
      });
    }

    // Mess Feedback
    await MessFeedback.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      mealType: 'Breakfast',
      rating: 5,
      hygieneRating: 5,
      foodQualityRating: 5,
      comments: 'The Sunday pancakes and South Indian dosas are outstanding! Keep it up.'
    });

    await MessFeedback.create({
      student: studentUser3._id,
      hostel: boysHostel._id,
      mealType: 'Lunch',
      rating: 4,
      hygieneRating: 4,
      foodQualityRating: 4,
      comments: 'Paneer butter masala and dal makhani tasted rich and hygienic.'
    });

    // 17. Hostel Leave Requests
    console.log('[Seed] Generating sample hostel leave applications...');
    const depDate = new Date();
    depDate.setDate(depDate.getDate() + 2);
    const retDate = new Date();
    retDate.setDate(retDate.getDate() + 5);

    await HostelLeaveRequest.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      room: room204._id,
      departureDate: depDate,
      expectedReturnDate: retDate,
      destination: 'San Francisco, CA - ACM Inter-University Hackathon 2026',
      reason: 'Representing university in National Collegiate Hackathon finals',
      emergencyContact: {
        name: 'Robert Rivera',
        phone: '+1 (555) 016-5521',
        relationship: 'Father'
      },
      parentConsentConfirmed: true,
      status: 'Approved',
      reviewedBy: wardenUser._id,
      reviewRemarks: 'Approved. Best of luck for the Hackathon finals!',
      reviewedAt: new Date()
    });

    const depDate2 = new Date();
    depDate2.setDate(depDate2.getDate() + 1);
    const retDate2 = new Date();
    retDate2.setDate(retDate2.getDate() + 3);

    await HostelLeaveRequest.create({
      student: studentUser3._id,
      hostel: boysHostel._id,
      room: room204._id,
      departureDate: depDate2,
      expectedReturnDate: retDate2,
      destination: 'San Diego, CA - Family Weekend',
      reason: 'Attending sibling graduation ceremony',
      emergencyContact: {
        name: 'Helen Lee',
        phone: '+1 (555) 016-7788',
        relationship: 'Mother'
      },
      parentConsentConfirmed: true,
      status: 'Pending'
    });

    // 18. Hostel Complaints & Maintenance
    console.log('[Seed] Seeding hostel maintenance requests...');
    await HostelComplaint.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      room: room204._id,
      category: 'Wi-Fi',
      title: 'Intermittent 5GHz Wi-Fi dropouts on Floor 2',
      description: 'The access point in Corridor 2A disconnects during peak evening hours (08:00 PM - 10:00 PM).',
      priority: 'High',
      status: 'In Progress',
      assignedStaff: {
        name: 'Rajesh Sharma (Senior Network Engineer)',
        phone: '+1 (555) 012-4499',
        assignedAt: new Date()
      },
      resolutionNotes: 'Technician dispatched to replace the PoE switch and optimize channel frequency.'
    });

    await HostelComplaint.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      room: room204._id,
      category: 'Plumbing',
      title: 'Washroom water tap aerator replacement',
      description: 'Minor drip in the attached washroom washbasin faucet.',
      priority: 'Low',
      status: 'Resolved',
      assignedStaff: {
        name: 'Carlos Mendoza (Hostel Plumber)',
        phone: '+1 (555) 012-3321',
        assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      resolutionNotes: 'New ceramic cartridge and aerator fitted. Tested leak-free.',
      resolvedBy: wardenUser._id,
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      studentRating: 5,
      studentFeedback: 'Fixed promptly within 2 hours. Very polite technician!'
    });

    // 19. Hostel Fee Records
    console.log('[Seed] Seeding hostel fee balances & receipts...');
    await HostelFee.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      roomAllocation: alexAllocation._id,
      academicYear: '2024-2025',
      term: 'Semester 1',
      roomCharges: 24000,
      messCharges: 18000,
      securityDeposit: 5000,
      maintenanceCharges: 2000,
      totalAmount: 49000,
      paidAmount: 25000,
      outstandingAmount: 24000,
      status: 'Partially Paid',
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      payments: [
        {
          transactionId: 'TXN-HOSTEL-908124',
          amount: 25000,
          paymentMethod: 'UPI',
          paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          receiptNumber: 'REC-HST-004921',
          isVerified: true
        }
      ]
    });

    // 20. Hostel Gate Movement Audit Logs
    console.log('[Seed] Seeding student gate movement history...');
    await HostelGateLog.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      room: room204._id,
      movementType: 'Check-Out',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      destination: 'Central University Library & Innovation Hub',
      reason: 'Capstone Project Team Research',
      isLateEntry: false,
      hasApprovedLeave: false,
      verifiedBy: wardenUser._id,
      remarks: 'Student left with laptop and student ID card.'
    });

    await HostelGateLog.create({
      student: studentUser._id,
      hostel: boysHostel._id,
      room: room204._id,
      movementType: 'Check-In',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      destination: 'Hostel Main Gate',
      reason: 'Returned from Library',
      isLateEntry: false,
      hasApprovedLeave: false,
      verifiedBy: wardenUser._id,
      remarks: 'Timely return before evening roll call.'
    });

    // 21. Hostel Announcements
    console.log('[Seed] Broadcasting official hostel notices...');
    await HostelAnnouncement.create({
      title: '⚡ Scheduled High-Speed Fiber Backbone Maintenance',
      content: 'Campus IT will be performing an optical fiber upgrade between 02:00 AM and 04:00 AM on Thursday. Internet service will experience brief disruptions.',
      hostel: boysHostel._id,
      author: wardenUser._id,
      priority: 'normal',
      category: 'Maintenance',
      isPinned: true
    });

    await HostelAnnouncement.create({
      title: '🍲 Grand Sunday Festive Feast & Extended Mess Hours',
      content: 'Join us this Sunday for our monthly celebratory dinner featuring Live Chaat Counter, Biryani, and Italian Gelato. Mess timing extended until 10:30 PM.',
      hostel: null, // Broadcast to all hostels
      author: wardenUser._id,
      priority: 'normal',
      category: 'Mess',
      isPinned: true
    });

    await HostelAnnouncement.create({
      title: '🚨 Digital QR Gate Pass Enforcement Starting Monday',
      content: 'All residents must present their digital QR pass from the CampusConnect mobile portal during evening entry past 08:30 PM. Ensure your identity profile is active.',
      hostel: null,
      author: wardenUser._id,
      priority: 'urgent',
      category: 'Rules',
      isPinned: true
    });

    // 22. Audit Logs
    console.log('[Seed] Generating initial system audit logs...');
    await AuditLog.create({
      action: 'SYSTEM_INITIALIZATION',
      performedBy: adminUser._id,
      targetResource: 'System',
      details: { environment: 'production-ready', seededRecords: 'complete' }
    });

    await AuditLog.create({
      action: 'CURRICULUM_SEEDED',
      performedBy: adminUser._id,
      targetResource: 'Department & Course',
      details: { department: 'CSE', courses: 2, subjects: 4 }
    });

    await AuditLog.create({
      action: 'HOSTEL_MODULE_INITIALIZED',
      performedBy: adminUser._id,
      targetResource: 'Hostel System',
      details: { hostels: 2, blocks: 3, rooms: 5, chiefWarden: 'Dr. Marcus Vance' }
    });

    console.log('===========================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('===========================================================');
    console.log('🔑 DEMO CREDENTIALS FOR TESTING & EVALUATION:');
    console.log('-----------------------------------------------------------');
    console.log('1. Admin:   admin@campusconnect.edu    | Password: Admin@123');
    console.log('2. Faculty: faculty@campusconnect.edu  | Password: Faculty@123');
    console.log('3. Student: student@campusconnect.edu  | Password: Student@123');
    console.log('4. Parent:  parent@campusconnect.edu   | Password: Parent@123');
    console.log('5. Warden:  warden@campusconnect.edu   | Password: Warden@123');
    console.log('===========================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
