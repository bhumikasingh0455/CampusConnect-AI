require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket } = require('./src/services/socketService');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 CampusConnect AI API is live on port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 Socket.IO Real-Time Engine: Active`);
      console.log(`🤖 Gemini AI Assistant: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Offline / Intelligent Fallback'}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error(`Failed to launch server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
