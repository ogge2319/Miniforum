// SocketContext.jsx - Real-time Socket.IO connection
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        // Endast connecta om användaren är inloggad
        if (user) {
            const newSocket = io('http://localhost:4000', {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('✅ Socket connected:', newSocket.id);
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
                setIsConnected(false);
            });

            // Lyssna på real-time events
            newSocket.on('newPost', (post) => {
                console.log('📢 New post received:', post);
            });

            newSocket.on('postUpdated', (post) => {
                console.log('📝 Post updated:', post);
            });

            newSocket.on('postDeleted', (postId) => {
                console.log('🗑️ Post deleted:', postId);
            });

            setSocket(newSocket);

            // Cleanup vid unmount eller user blir null
            return () => {
                newSocket.close();
                setSocket(null);
                setIsConnected(false);
            };
        } else {
            // Disconnecta socket om användaren loggar ut eller tas bort
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const value = {
        socket,
        isConnected
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};
