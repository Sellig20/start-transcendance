import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
// import React, { useEffect } from 'react';
import Home from './pages/Home/index'
import Survey from './pages/Survey/index'
// import Header from './components/Header'
import Error from './components/Error/index'
import LoginPage from './pages/LoginPage/index'
import GameGate from './pages/GameGate/index'
import StartGame from './pages/StartGame/index'
// import io from 'socket.io-client';
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { WebSocketPG } from './pages/StartGame/webSocketPG';
import QueueGate from './pages/QueueGate/index'
import WebsocketQG from './pages/QueueGate/websocketQG'

  const App = () => {
    // useEffect(() => {
    //   const socket = io('http://localhost:3000');
    //   socket.on('message', (data) => {
    //     console.log('Message from server:', data);
    //   });

    //   return () => {
    //     socket.disconnect();
    //   };
    // }, []);
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/GameGate" 
            element={
              <WebsocketProvider value={socket}>
                <div>
                  <WebSocketPG />
                  <GameGate />
                </div>
              </WebsocketProvider>
            }
          />
          <Route path="/StartGame" element={<StartGame />} />
          <Route path="/QueueGate" 
            element={
              <WebsocketProvider value={socket}>
                <div>
                  <WebsocketQG pageId={"10"}/>
                  <QueueGate />
                </div>
              </WebsocketProvider>
            }
          />
          <Route path="*" element={<Error />} />
          {/*toutes celles qui ne sont pas declarees juste au dessus sont en error  */}
        </Routes>
      </Router>
  );
};

export default App