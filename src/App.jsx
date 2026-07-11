import React, { useState } from 'react';
import './App.css';
import CharacterManager from './components/CharacterManager';
import { useMobile } from './hooks/use-mobile';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const isMobile = useMobile();
  
  const handleStartGame = () => {
    setGameStarted(true);
  };
  
  return (
    <div className="aventuras-chacara-app">
      {!gameStarted ? (
        // Tela inicial
        <div className="start-screen">
          <h1>🌟 Aventuras na Chácara</h1>
          <h2>O Mistério do Rio Murice</h2>
          
          <button className="start-button" onClick={handleStartGame}>
            Iniciar Aventura
          </button>
          
          <button className="settings-button">
            Configurações
          </button>
          
          <div className="game-info">
            <p>🎮 Compatível com Web e Mobile</p>
            <p>👨‍👩‍👧‍👦 Diversão para toda a família</p>
            <p>Modo: medium • FPS: 60</p>
          </div>
        </div>
      ) : (
        // Tela do jogo
        <div className="game-screen">
          {/* Sistema de gerenciamento de personagens */}
          <CharacterManager />
        </div>
      )}
    </div>
  );
}

export default App;
