const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { calculateAttendanceMetrics } = require('../src/utils/predictor');

describe('Smart Attendance Logic & API Tests', () => {
  test('Attendance predictor calculates 75% shortage and classes needed accurately', () => {
    // Student attended 10 out of 20 classes (50%)
    // Needs (3*20 - 4*10) = 60 - 40 = 20 classes consecutively to reach 75%
    // Let's verify: (10 + 20) / (20 + 20) = 30 / 40 = 75%
    const result = calculateAttendanceMetrics(10, 20);
    expect(result.percentage).toEqual(50);
    expect(result.isLowAttendance).toBe(true);
    expect(result.classesNeededFor75).toEqual(20);
  });

  test('Attendance predictor calculates safe miss count for students above 75%', () => {
    // Student attended 18 out of 20 classes (90%)
    // Safe miss: floor((4*18 - 3*20) / 3) = floor((72 - 60) / 3) = floor(12/3) = 4 classes
    // If student misses 4 classes: 18 / (20 + 4) = 18 / 24 = 75%
    const result = calculateAttendanceMetrics(18, 20);
    expect(result.percentage).toEqual(90);
    expect(result.isLowAttendance).toBe(false);
    expect(result.classesCanMissBeforeLow).toEqual(4);
  });
});
