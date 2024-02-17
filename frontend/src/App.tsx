import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/index'
import Survey from './pages/SecondGame/index'
import Error from './components/Error/index'
import GameGate from './pages/GameGate/index'
import StartGame from './pages/StartGame/index'
import SecondGame from './pages/SecondGame/index'
import { socket, WebsocketProvider } from './contexts/WebsocketContext';
import { WebSocketPG } from './pages/GameGate/webSocketPG';
import { WebsocketSG } from './pages/StartGame/websocketSG';
import { WebsocketSecondG } from './pages/SecondGame/websocketSecondG';
import QueueGate from './pages/QueueGate/index'
import React from 'react';

  const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/GameGate" 
          element={
            <WebsocketProvider value={socket}>
              <div>
                <GameGate />
                <WebSocketPG />
              </div>
            </WebsocketProvider>
          }
        />
        <Route path="/QueueGate" 
          element={
            <WebsocketProvider value={socket}>
              <div>
                <QueueGate />
              </div>
            </WebsocketProvider>
          }
        />
        <Route path="/StartGame" 
          element={
            <WebsocketProvider value ={socket}>
              <div>
                <StartGame />
                <WebsocketSG />
              </div>
            </WebsocketProvider>
          } />
          <Route path="/SecondGame" 
          element={
            <WebsocketProvider value ={socket}>
              <div>
                <SecondGame />
                <WebsocketSecondG />
              </div>
            </WebsocketProvider>
          } />
        
        <Route path="*" element={<Error />} />
        {/*toutes celles qui ne sont pas declarees juste au dessus sont en error  */}
      </Routes>
    </Router>
  );
};

export default App;
