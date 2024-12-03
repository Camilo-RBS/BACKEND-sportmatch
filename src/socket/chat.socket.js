export const setupSocketHandlers = (io) => {
  const users = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('setup', (userData) => {
      socket.join(userData._id);
      users.set(userData._id, socket.id);
      socket.emit('connected');
    });

    socket.on('join chat', (room) => {
      socket.join(room);
    });

    socket.on('new message', (newMessageReceived) => {
      if (!newMessageReceived.isGlobal) {
        const receiverSocket = users.get(newMessageReceived.receiver);
        if (receiverSocket) {
          socket.to(receiverSocket).emit('message received', newMessageReceived);
        }
      } else {
        socket.broadcast.emit('message received', newMessageReceived);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from users map
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          break;
        }
      }
    });
  });
};