import { useContext, useEffect, useState } from "react"
import { WebsocketContext } from "../../contexts/WebsocketContext"


const WebsocketQG = ({ pageId }: { pageId: "10" }) => {

    const socket = useContext(WebsocketContext);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    console.log("debug1");
    useEffect(() => {

        socket.emit('joinPage', pageId);

        console.log("debug2");
        socket.on('user-connected', ({ clientId, userArray}) => {
            console.log(`Connected on QUEUE GATE for ${clientId}`);
            // console.log('Tab add ===>', userArray);
            setConnectedUsers((prevUsers) => [...prevUsers, clientId]);
            console.log("------------------>>>>>>>>>", userArray);
            localStorage.setItem('connectedUsers', JSON.stringify(userArray));

        });
        
        socket.on('pageStatus', ({ usersOnPage }) => {
            // setConnectedUsers(usersOnPage);
            setConnectedUsers(prevUsers => Array.from(new Set([...prevUsers, usersOnPage])));
            localStorage.setItem('connectedUsers', JSON.stringify(usersOnPage));
        })

        socket.on('user-disconnected', ({ clientId, userArray}) => {
            console.log(`User disconnected: ${clientId}`);
            // console.log('Tab remove ===>', userArray);
            // setConnectedUsers((prevUsers) => prevUsers.filter((userId) => userId !== data.clientId));
            // setConnectedUsers(userArray);
        });

        const storedUsers = localStorage.getItem('connectedUsers');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            setConnectedUsers(parsedUsers);
        }

        return () => {
            socket.off();
        };

    }, [pageId]);
    console.log("debug3");
    return (
        <div>
            <h2>Connected Users on {pageId}</h2>
            <ul>
                {connectedUsers.map((usersOnPage, index) => (
                    <li key={index}>{usersOnPage}</li>
                ))}
            </ul>
        </div>
    )

}

export default WebsocketQG;


