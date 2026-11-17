const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

beforeAll(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Authentication & RBAC Tests', () => {
  test('Health check route returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('healthy');
  });

  test('Valid student login returns JWT token and student role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@campusconnect.edu',
        password: 'Student@123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toEqual('student');
  });

  test('Invalid credentials returns 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@campusconnect.edu',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  test('Student cannot access admin routes (RBAC check)', async () => {
    // 1. Login as student
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@campusconnect.edu',
        password: 'Student@123'
      });

    const studentToken = loginRes.body.data.token;

    // 2. Try to access admin-only overview route
    const res = await request(app)
      .get('/api/users/admin-overview')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.success).toBe(false);
  });

  test('Admin can access admin overview', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@campusconnect.edu',
        password: 'Admin@123'
      });

    const adminToken = loginRes.body.data.token;

    const res = await request(app)
      .get('/api/users/admin-overview')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics).toBeDefined();
  });
});
