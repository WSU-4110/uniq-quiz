import {useEffect, useContext, createContext} from 'react';
import {io} from 'socket.io-client';

const SocketContext = createContext();

const socket = io("http://68.43.32.87", {
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