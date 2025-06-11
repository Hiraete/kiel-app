import express, { RequestHandler } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { protect } from '../middleware/auth';

const router = express.Router();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

interface Room {
  users: Set<string>;
}

const rooms = new Map<string, Room>();

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  socket.on('join-room', (roomId: string, userId: string) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set() });
    }
    rooms.get(roomId)?.users.add(userId);
    
    socket.to(roomId).emit('user-connected', userId);
  });

  socket.on('leave-room', (roomId: string, userId: string) => {
    socket.leave(roomId);
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room?.users.delete(userId);
      if (room?.users.size === 0) {
        rooms.delete(roomId);
      }
    }
    socket.to(roomId).emit('user-disconnected', userId);
  });

  socket.on('signal', (roomId: string, userId: string, signal: any) => {
    socket.to(roomId).emit('signal', userId, signal);
  });
});

httpServer.listen(3000, () => {
  console.log('Video chat sunucusu 3000 portunda çalışıyor');
});

// Video chat başlatma endpoint'i
router.post('/start', protect as RequestHandler, (req, res): void => {
  const roomId = req.body.roomId;
  if (!roomId) {
    res.status(400).json({ message: 'Oda ID gerekli' });
    return;
  }
  res.json({ roomId });
});

export default router; 