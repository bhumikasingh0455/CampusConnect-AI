const AuditLog = require('../models/AuditLog');

const logAction = async ({
  action,
  performedBy = null,
  targetResource = '',
  resourceId = '',
  details = {},
  req = null
}) => {
  try {
    let ipAddress = '';
    let userAgent = '';

    if (req) {
      ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || '';
      userAgent = req.headers['user-agent'] || '';
    }

    await AuditLog.create({
      action,
      performedBy,
      targetResource,
      resourceId: String(resourceId || ''),
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error(`[AuditService] Failed to record audit log: ${error.message}`);
  }
};

module.exports = {
  logAction
};
