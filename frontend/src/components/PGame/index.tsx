import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

    const PGame = () => {
        const [message, setMessage] = useState('');
        const [newSocket, setSocket] = useState<Socket | null>(null)

        useEffect(() => {
            const socket = io('http://localhost:3000/ponggame'); // Remplacez l'URL par votre URL de serveur NestJS
            
            // Gérer les événements du côté client, par exemple :
            socket.on('message', (data) => {
                console.log('Message from server:', data);
            });

            setSocket(socket);
            
            return () => {
                // Déconnexion du WebSocket lorsque le composant est démonté
                socket.disconnect();
            };
        }, []);
    
        const sendMessage = () => {
            if (newSocket) {
                newSocket.emit('message', 'Hello from client!');
            }
            else
            {
                console.log("pas de web sockets ma beeeelleeee");
            }
        };

        const handleInputChange = (event: any) => {
            setMessage(event.target.value);
        };
    
        return (
            <nav>
                <input type="text" id="messageInput" value={message} onChange={handleInputChange} />
                <div>Je suis le composant et japparais</div>
                <button onClick={sendMessage}>Envoyer le message</button>
            </nav>
        )
}

export default PGame