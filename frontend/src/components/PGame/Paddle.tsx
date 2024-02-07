import React from 'react';

export interface PaddleType {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
}


interface PaddleProps {
  paddle: PaddleType; // Utilisez l'interface Paddle comme type pour la propriété paddle
}

const Paddle: React.FC<PaddleProps> = ({ paddle }) => {
  const { x, y, width, height, velocityY } = paddle;

  return (
      <div>
        <h1>coucoupoupoiu</h1>
      </div>
  )
};

export default Paddle;