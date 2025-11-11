import { io } from 'socket.io-client';
import { addNotification } from '../store/slices/notificationSlice';

let socket = null;

export const initializeSocket = (userId, store) => {
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
  
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    socket.emit('join', userId);
  });

  socket.on('notification', (notification) => {
    console.log('New notification:', notification);
    store.dispatch(addNotification(notification));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
};


