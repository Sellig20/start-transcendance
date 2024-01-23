import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../contexts/WebsocketContext"


export const WebSocketPG = () => {

    const [value, setValue] = useState('');
    const socket = useContext(WebsocketContext);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected !');
        });
        socket.on('onMessage', (data) => {
            console.log('onMessage event received !');
            console.log(data);
        });

        return () => {
            console.log("Unregistering events...");  
            socket.off('connect');
            socket.off('onMessage');//not closing
        }
    }, []);

    const onSubmit = () => {
        socket.emit('newMessage', value);
        setValue('');
    }

    return (
        <div>
            <div>
                <h1>Websocket Component</h1>
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={onSubmit}>Submit</button>
            </div>
        </div>
    )
}