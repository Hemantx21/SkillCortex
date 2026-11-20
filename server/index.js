import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import interviewRoutes from './routes/interview.js';
import uploadRoutes from './routes/upload.js';
import quizRoutes from './routes/quiz.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';
import paymentRoutes from './routes/payment.js';
import User from './models/User.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware — allow any localhost/browser origin in dev, plus configured CLIENT_URL
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // non-browser clients (curl, node, postman)
  if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) return true;
  const clientUrl = process.env.CLIENT_URL;
  return !!clientUrl && origin === clientUrl;
};

app.use(cors({
  origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
  credentials: true
}));
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf.toString('utf8'); } }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);

// Socket.io for WebRTC signaling
const io = new Server(server, {
  cors: {
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected to socket:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  socket.on('call-user', (data) => {
    io.to(data.userToCall).emit('receive-call', { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on('answer-call', (data) => {
    io.to(data.to).emit('call-accepted', data.signal);
  });
});

// Basic route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SkillCortex API is running' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be configured before starting the API');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  await User.init();
  console.log('Connected to MongoDB');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('API startup failed:', err);
  process.exitCode = 1;
});
