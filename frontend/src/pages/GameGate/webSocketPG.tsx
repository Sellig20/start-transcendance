// import { useContext, useEffect, useState } from "react"
// import { WebsocketContext } from "../../contexts/WebsocketContext"

// export const WebSocketPG = () => {

//     const socket = useContext(WebsocketContext);

    
//     useEffect(() => {

//         const handleConnect = () => {
//                 console.log('Connected in Game Gate!');
//         }

//         const handleKeyDown = (event: any) => {
//             if (event.key === 'ArrowLeft') {
//                 console.log('ARROW LEFT');
//                 socket.emit('keydown', { direction: 'left'});
//             }
//             else if (event.key === 'ArrowRight') {
//                 console.log('ARROW RIGHT');
//                 socket.emit('keydown', { direction: 'right'});
//             }
//         }

//         socket.on('connect', handleConnect);
    
//         window.addEventListener('keydown', handleKeyDown);
        
//         return () => {
//             console.log("Unregistering events...");  
//             socket.off('connect');
//             window.removeEventListener('keydown', handleKeyDown);
//         }

//     }, []);

//     return (
//         <div>
//             <div>
//                 <h1>Websocket PG</h1>
//             </div>
//         </div>
//     )
// }

// export default WebSocketPG;


import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../contexts/WebsocketContext"

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
            <div>
                <h1>Websocket Component</h1>
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

export default WebSocketPG;