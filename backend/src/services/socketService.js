const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

let io = null;

const initSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(); // Allow anonymous connection or handle unauthenticated
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev_prod'
      );
      socket.user = decoded;
      next();
    } catch (err) {
      console.warn(`[Socket.IO] Auth verification error: ${err.message}`);
      next();
    }
  });

  io.on('connection', (socket) => {
    if (socket.user) {
      const userRoom = `user:${socket.user.id}`;
      const roleRoom = `role:${socket.user.role}`;
      socket.join(userRoom);
      socket.join(roleRoom);
      console.log(`[Socket.IO] User connected: ${socket.user.name} (${socket.user.role}) - joined ${userRoom}`);
    } else {
      console.log(`[Socket.IO] Anonymous client connected: ${socket.id}`);
    }

    socket.on('disconnect', () => {
      // Disconnected cleanly
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const notifyUser = (userId, event, payload) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

const notifyRole = (role, event, payload) => {
  if (io) {
    io.to(`role:${role}`).emit(event, payload);
  }
};

const broadcastEvent = (event, payload) => {
  if (io) {
    io.emit(event, payload);
  }
};

module.exports = {
  initSocket,
  getIO,
  notifyUser,
  notifyRole,
  broadcastEvent
};
