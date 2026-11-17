const crypto = require('crypto');
const QRCode = require('qrcode');

const QR_SECRET = process.env.JWT_SECRET || 'campusconnect_qr_attendance_key_2026';
const QR_VALIDITY_SECONDS = 90; // 90 seconds window

/**
 * Generate a cryptographically signed QR Attendance token for a subject & faculty
 */
const generateAttendanceQR = async ({ subjectId, facultyId, date }) => {
  const timestamp = Date.now();
  const salt = crypto.randomBytes(8).toString('hex');
  const payloadStr = `${subjectId}:${facultyId}:${date}:${timestamp}:${salt}`;
  
  const hmac = crypto.createHmac('sha256', QR_SECRET);
  hmac.update(payloadStr);
  const signature = hmac.digest('hex');

  const tokenData = {
    subjectId,
    facultyId,
    date,
    timestamp,
    salt,
    sig: signature
  };

  const rawToken = Buffer.from(JSON.stringify(tokenData)).toString('base64');
  const qrDataUrl = await QRCode.toDataURL(rawToken, {
    width: 320,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    }
  });

  return {
    rawToken,
    qrDataUrl,
    validUntil: timestamp + QR_VALIDITY_SECONDS * 1000,
    validitySeconds: QR_VALIDITY_SECONDS
  };
};

/**
 * Verifies a student-submitted QR token
 */
const verifyAttendanceQR = (rawToken) => {
  try {
    const jsonStr = Buffer.from(rawToken, 'base64').toString('utf-8');
    const tokenData = JSON.parse(jsonStr);

    const { subjectId, facultyId, date, timestamp, salt, sig } = tokenData;

    if (!subjectId || !facultyId || !date || !timestamp || !salt || !sig) {
      return { isValid: false, message: 'Malformed QR attendance code.' };
    }

    // Verify expiration
    const now = Date.now();
    const ageSeconds = (now - timestamp) / 1000;
    if (ageSeconds > QR_VALIDITY_SECONDS) {
      return { isValid: false, message: 'This QR code has expired. Please ask your faculty for a fresh code.' };
    }

    if (ageSeconds < -10) {
      return { isValid: false, message: 'Invalid device timestamp detected.' };
    }

    // Verify cryptographic signature
    const payloadStr = `${subjectId}:${facultyId}:${date}:${timestamp}:${salt}`;
    const hmac = crypto.createHmac('sha256', QR_SECRET);
    hmac.update(payloadStr);
    const expectedSig = hmac.digest('hex');

    if (sig !== expectedSig) {
      return { isValid: false, message: 'Invalid signature on QR code. Verification failed.' };
    }

    return {
      isValid: true,
      subjectId,
      facultyId,
      date,
      timestamp
    };
  } catch (err) {
    return { isValid: false, message: `Failed to decode QR code: ${err.message}` };
  }
};

module.exports = {
  generateAttendanceQR,
  verifyAttendanceQR
};
