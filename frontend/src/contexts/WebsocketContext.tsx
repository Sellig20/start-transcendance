import { createContext, useContext } from "react";
import { io, Socket } from 'socket.io-client';
import React from 'react';


export const socket = io('http://localhost:3001', {
    withCredentials: true,
});

export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;

