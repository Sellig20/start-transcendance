import { useEffect, useState } from 'react';
import React from 'react';

import io, { Socket } from 'socket.io-client';

    const PGame = () => {
    
        return (
            <nav>
                <div>Je suis le composant et japparais</div>
            </nav>
        )
}

export default PGame












// const sendMessage = () => {
//     if (newSocket) {
//         newSocket.emit('message', 'Hello from client!');
//     }
//     else
//     {
//         console.log("pas de web sockets ma beeeelleeee");
//     }
// };

// const handleInputChange = (event: any) => {
//     setMessage(event.target.value);
// };
{/* <input type="text" id="messageInput" value={message} onChange={handleInputChange} /> */}

{/* <button onClick={sendMessage}>Envoyer le message</button> */}
