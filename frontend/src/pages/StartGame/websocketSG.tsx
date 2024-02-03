import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../contexts/WebsocketContext"

export const WebsocketSG = () => {

    const initialPaddle1Pos = 0;
    const initialPaddle2Pos = 0;

    const [serverMessage, setServerMessage] = useState('');
    const [serverAMessage, setAServerMessage] = useState('');

    const socket = useContext(WebsocketContext);
    // const [userId, setUserId] = useState<number | null>(null);
    const [paddle1Pos, setPaddle1Pos] = useState(initialPaddle1Pos);
    const [paddle2Pos, setPaddle2Pos] = useState(initialPaddle2Pos);

    useEffect(() => {

        const handleConnect = () => {
            console.log('Connected in START GAME!');
        }
        
        socket.on('connect', handleConnect);

        if (socket.connected)
        {
            console.log(`je suis ${socket.id} dans game gate .tsx`);
            // const user2 = socket.id
        }

        const userId = 1;

        const handleKeyDown = (event: any) => {
            const paddleSpeed = 1;

            if (event.key === 'ArrowUp') {
                if (userId === 1) {
                    setPaddle1Pos((prev) => Math.max(prev - paddleSpeed, 0));
                } else if (userId === 2) {
                    setPaddle2Pos((prev) => Math.max(prev - paddleSpeed, 0));
                }
                console.log(`Arrow UP by ${userId}`);
                socket.emit('keydown', { direction: 'up'});
            }
            else if (event.key === 'ArrowDown') {
                if (userId === 1) {
                    setPaddle1Pos((prev) => Math.min(prev - paddleSpeed, 9));
                } else if (userId === 2) {
                    setPaddle2Pos((prev) => Math.min(prev - paddleSpeed, 9));
                }
                console.log(`Arrow DOWN by ${userId}`);
                socket.emit('keydown', { direction: 'down'});
            }
        };

        const handleUpdatePosition = (data: any) => {

            console.log("--- Position mise a jour : ", data);
            setPaddle1Pos(data.paddle1Pos);
            setPaddle2Pos(data.paddle2Pos);
            socket.emit('PositionUpdatedInServer', { m: 'boujoubajabou' });
        }

        const handleUpdatedResponse = (data: any) => {
            console.log("Reponse du serveur :", data.message)
            setServerMessage(data.message);
        }

        //ecoute du serveur
        const handleKeyPressedResponse = (data: any) => {
            console.log("Reponse du serveur lolo : ", data.message);
            setAServerMessage(data.message);
        }

        window.addEventListener('keydown', handleKeyDown);
        socket.on('keyPressedResponse', handleKeyPressedResponse);
        socket.on('updatePosition', handleUpdatePosition);
        socket.on('PositionUpdatedInServer', handleUpdatedResponse);

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            window.removeEventListener('keydown', handleKeyDown);
            socket.off("updatePosition", handleUpdatePosition);
            socket.on('keyPressedResponse',handleKeyPressedResponse);
            socket.on('PositionUpdatedInServer', handleUpdatedResponse);
        }

    }, [socket, setPaddle1Pos, setPaddle2Pos]);

    return (
        <div className="game-container">
            <div className="game-board">
                {Array.from({ length: 10 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {Array.from({ length: 10 }).map((_, colIndex) => (
                            <div key={colIndex} className="cell"></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="paddle" style={{ top: `${paddle1Pos * 10}%`, left: 0}}>
                Paddle 1
            </div>
            <div className="paddle" style={{ bottom: `${paddle2Pos * 10}%`, right: 0}}>
                Paddle 2
            </div>
        </div>
    )
}

export default WebsocketSG;