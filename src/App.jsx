import React, { useState } from 'react';
import './App.css';
import CharacterManager from './components/CharacterManager';
import PetManager from './components/PetManager';
import AbilitySystem from './components/AbilitySystem';
import { useMobile } from './hooks/use-mobile';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 100 });
  const [activeCharacter, setActiveCharacter] = useState('sarah');
  const isMobile = useMobile();
  
  const handleStartGame = () => {
    setGameStarted(true);
  };
  
  const handleUseAbility = (ability) => {
    console.log(`Usando habilidade: ${ability.name}`);
    // Implementar efeitos de habilidades
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
          {/* Área de jogo */}
          <div className="game-area">
            {/* Sistema de gerenciamento de personagens */}
            <CharacterManager 
              onPositionChange={setPlayerPosition}
              onCharacterChange={setActiveCharacter}
            />
            
            {/* Sistema de gerenciamento de pets */}
            <PetManager playerPosition={playerPosition} />
            
            {/* Elementos do cenário */}
            {/* ... */}
          </div>
          
          {/* Interface de usuário do jogo */}
          <div className="game-ui">
            {/* Barra de habilidades */}
            <AbilitySystem 
              character={activeCharacter}
              onUseAbility={handleUseAbility}
            />
            
            {/* Botões de controle para dispositivos móveis */}
            {isMobile && (
              <div className="mobile-controls">
                {/* Joystick virtual */}
                <div className="virtual-joystick">
                  {/* Implementação do joystick */}
                </div>
                
                {/* Botões de ação */}
                <div className="action-buttons">
                  {/* Botões de ação */}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
