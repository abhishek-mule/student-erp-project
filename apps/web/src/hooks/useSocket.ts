"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';

export const useSocket = (tenantId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { userId, getToken } = useAuth();

    useEffect(() => {
        if (!tenantId || !userId) return;

        let newSocket: Socket;

        const connectSocket = async () => {
            const token = await getToken();
            newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
                auth: {
                    token,
                    tenantId,
                    userId,
                },
            });

            newSocket.on('connect', () => {
                console.log('Connected to realtime server');
            });

            setSocket(newSocket);
        };

        connectSocket();

        return () => {
            if (newSocket) newSocket.close();
        };
    }, [tenantId, userId]);

    return socket;
};
