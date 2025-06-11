import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupVideoChat = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const rooms: { [key: string]: string[] } = {};

  io.on('connection', (socket) => {
    console.log('Yeni kullanıcı bağlandı:', socket.id);

    socket.on('join-room', (roomId: string) => {
      console.log(`${socket.id} kullanıcısı ${roomId} odasına katıldı`);
      
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      
      rooms[roomId].push(socket.id);
      socket.join(roomId);

      // Odadaki diğer kullanıcılara yeni kullanıcıyı bildir
      socket.to(roomId).emit('user-joined', socket.id);
    });

    // Sohbet mesajlarını işle
    socket.on('chat-message', (data: { text: string; sender: string; roomId: string }) => {
      socket.to(data.roomId).emit('chat-message', {
        text: data.text,
        sender: data.sender,
      });
    });

    socket.on('offer', (data: { offer: any; roomId: string }) => {
      socket.to(data.roomId).emit('offer', {
        offer: data.offer,
        from: socket.id,
      });
    });

    socket.on('answer', (data: { answer: any; roomId: string }) => {
      socket.to(data.roomId).emit('answer', {
        answer: data.answer,
        from: socket.id,
      });
    });

    socket.on('ice-candidate', (data: { candidate: any; roomId: string }) => {
      socket.to(data.roomId).emit('ice-candidate', {
        candidate: data.candidate,
        from: socket.id,
      });
    });

    socket.on('disconnect', () => {
      console.log('Kullanıcı ayrıldı:', socket.id);
      
      // Kullanıcıyı tüm odalardan çıkar
      Object.keys(rooms).forEach((roomId) => {
        if (rooms[roomId].includes(socket.id)) {
          rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
          socket.to(roomId).emit('user-left', socket.id);
          
          // Oda boşsa, odayı sil
          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
          }
        }
      });
    });
  });

  return io;
}; 