import './style.css'
import React, { useEffect } from 'react';
import PGame from '../../components/PGame/index';
import { Link } from 'react-router-dom';

const GameGate: React.FC = () => {

    return (
        <div id="gameGate">
            <h1>PONG GAME</h1>
            <PGame />
            <Link to="/StartGame">Jouer au jeu zozo = faire la queue</Link>
            <br></br>
            <Link to="/">Quitter le gaaaame</Link>
        </div>
    )
}

export default GameGate;