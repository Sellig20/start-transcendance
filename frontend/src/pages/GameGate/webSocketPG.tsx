import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../contexts/WebsocketContext"
import React from 'react';


export const WebSocketPG = () => {

    const [value, setValue] = useState('');
    const socket = useContext(WebsocketContext);

    useEffect(() => {
        if (socket.connected)
        {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
        }

        const handleConnect = () => {
                console.log('Connected in GAME GATE!');
        }

        socket.on('connect', handleConnect);
        
        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
        }

    }, [socket]);

    return (
        <div>
            
        </div>
    )
}

export default WebSocketPG;