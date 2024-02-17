import React, { useEffect, useRef } from 'react';
import './indexi.css';

const SecondGame: React.FC = () => {

  return (
      <nav>
          <h1>PONG GAME 2</h1>
      </nav>
  )
}

// const canvasRef = useRef<HTMLCanvasElement | null>(null);

// useEffect(() => {
//   const canvas = canvasRef.current;
//   const context = canvas?.getContext('2d');

//     if (!canvas || !context) {
//       return;
//     }
    
//     // Set canvas size
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
    
//     const waveColors = ['#ff6347', '#6495ed', '#6495ed', '#6495ed', '#32cd32'];
//     let time = 0;

//     const drawWaves = () => {
//       for (let i = 0; i < waveColors.length; i++) {
//         const offset = i * 20;
//         context.fillStyle = waveColors[i];
//         context.beginPath();

//         for (let x = 0; x < canvas.width; x += 10) {
//           const y = Math.sin((x + time + offset) * 0.01) * 50 + canvas.height / 2;
//           context.lineTo(x, y);
//         }
        
//         context.lineTo(canvas.width, canvas.height);
//         context.lineTo(0, canvas.height);
//         context.closePath();
//         context.fill();
//       }
//     };
    
//     const gameLoop = () => {
//       context.clearRect(0, 0, canvas.width, canvas.height);
//       drawWaves();
//       time += 0.5;
//       requestAnimationFrame(gameLoop);
//     };
    
    // gameLoop();
  // }, []);
  
  // return (
  //   <div>
  // <canvas ref={canvasRef} style={{ 
  //   display: 'block', 
  //   margin: 0, 
  //   overflow: 'hidden' }} />;
  // </div>
  // )
// };

export default SecondGame;
