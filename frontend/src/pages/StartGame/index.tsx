import React, { useContext, useEffect, useState } from 'react';
import './index.css';

interface PaddleProps {
  position: number;
}

const Paddle: React.FC<PaddleProps> = ({ position }) => (
  <div className="paddle" style={{ left:position }}>
    Paddle
  </div>
)

interface StartGameProps {
  size: number;
}

const StartGame: React.FC<StartGameProps> = ({ size }) => {

  return (
      <nav>
          <h1>StartGame JEUUUUUUUU</h1>
      </nav>
  )
}

export default StartGame;
