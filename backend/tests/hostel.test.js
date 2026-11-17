const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const HostelRoom = require('../src/models/HostelRoom');

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Hostel Management System API Tests', () => {
  let studentToken = null;
  let wardenToken = null;
  let adminToken = null;

  beforeAll(async () => {
    // 1. Get student token
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@campusconnect.edu', password: 'Student@123' });
    studentToken = studentLogin.body.data.token;

    // 2. Get warden token
    const wardenLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'warden@campusconnect.edu', password: 'Warden@123' });
    wardenToken = wardenLogin.body.data.token;

    // 3. Get admin token
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@campusconnect.edu', password: 'Admin@123' });
    adminToken = adminLogin.body.data.token;
  });

  test('1. Warden can authenticate and receive warden role', async () => {
    expect(wardenToken).toBeDefined();
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${wardenToken}`);

    expect(meRes.statusCode).toEqual(200);
    expect(meRes.body.data.user.role).toEqual('warden');
  });

  test('2. Student can fetch active room allocation and roommates', async () => {
    const res = await request(app)
      .get('/api/hostel/my-allocation')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hasAllocation).toBe(true);
    expect(res.body.data.allocation.room.roomNumber).toEqual('204');
    expect(res.body.data.roommates.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.roommates[0].name).toEqual('Devon Lee');
  });

  test('3. Room overallocation protection prevents assigning student to a full room', async () => {
    // Find room 204 which is full (capacity 2, occupied 2)
    const room204 = await HostelRoom.findOne({ roomNumber: '204' });
    expect(room204).toBeDefined();
    expect(room204.occupiedBeds).toBeGreaterThanOrEqual(room204.capacity);

    // Find Maya Patel
    const maya = await User.findOne({ email: 'maya.patel@campusconnect.edu' });
    expect(maya).toBeDefined();

    // Warden tries to allocate Maya to Room 204
    const res = await request(app)
      .post('/api/hostel/allocate')
      .set('Authorization', `Bearer ${wardenToken}`)
      .send({
        studentId: maya._id,
        roomId: room204._id,
        bedNumber: 3
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/full|capacity/i);
  });

  test('4. Student can retrieve 7-day mess menu and today meals', async () => {
    const res = await request(app)
      .get('/api/hostel/mess-menu')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.weeklyMenu.length).toBeGreaterThanOrEqual(7);
    expect(res.body.data.todayMenu).toBeDefined();
    expect(res.body.data.todayMenu.breakfast.items.length).toBeGreaterThan(0);
  });

  test('5. Student can fetch consolidated hostel dashboard snapshot', async () => {
    const res = await request(app)
      .get('/api/hostel/dashboard/student')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hasAllocation).toBe(true);
    expect(res.body.data.allocation.room.roomNumber).toEqual('204');
    expect(res.body.data.announcements.length).toBeGreaterThan(0);
  });

  test('6. Warden can fetch real-time hostel occupancy & analytics', async () => {
    const res = await request(app)
      .get('/api/hostel/dashboard/warden')
      .set('Authorization', `Bearer ${wardenToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalCapacity).toBeGreaterThan(0);
    expect(res.body.data.occupiedBeds).toBeGreaterThan(0);
    expect(res.body.data.occupancyRate).toBeGreaterThan(0);
  });

  test('7. Student can generate verified digital QR gate pass', async () => {
    const res = await request(app)
      .get('/api/hostel/gate/my-pass')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.passId).toBeDefined();
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.studentName).toEqual('Alex Rivera');
    expect(res.body.data.roomNumber).toEqual('204');
  });

  test('8. Student can fetch fee summary and view transaction history', async () => {
    const res = await request(app)
      .get('/api/hostel/fees/my')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.fees.length).toBeGreaterThan(0);
    expect(res.body.data.totalPaid).toBeGreaterThan(0);
  });
});
