import './style.css'
import React, { useEffect } from 'react';
import PGame from '../../components/PGame/index';
import { Link, useNavigate } from 'react-router-dom';

interface MyComponentProps {
    isImportant: boolean;
    isLarge: boolean;
  }
  
   

const GameGate: React.FC = () => {

    const navigate = useNavigate();

    const handleRedirectToQueueGate = () => {
        navigate('../QueueGate');
    }

    const handleRedirectToHome = () => {
        navigate('../');
    }

    return (
        <div>
            <div className="header">
                    <h1>Welcome in the Pong Game !</h1>
            </div>
            <div className="cloud-container">
                <div className="cloud"></div>
            </div>
                  <div className="content">
                    <button onClick={handleRedirectToQueueGate}>Enter in queue</button>
                    <button onClick={handleRedirectToHome}>Go back</button>
                    <br></br>
                </div>
        </div>
    )
}

export default GameGate;