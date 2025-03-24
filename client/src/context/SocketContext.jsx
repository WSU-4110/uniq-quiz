import {useEffect, useContext, createContext} from 'react';
import {io} from 'socket.io-client';

const SocketContext = createContext();

const socket = io("http://localhost:3000/", {
    transports: ["websocket", "polling"], // Ensure fallback transport
    withCredentials: true
});


export function SocketProvider({ children }){
    useEffect(() => {
        socket.connect();
        return () => socket.disconnect();
      }, []);
    
      return (
        <SocketContext.Provider value={socket}>
          {children}
        </SocketContext.Provider>
      );
}

export function useSocket() {
    return useContext(SocketContext);
}