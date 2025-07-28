import React, { useState, useEffect } from 'react';
import Sarah from './characters/Sarah';
import AnaMaria from './characters/AnaMaria';
import PetManager from './PetManager';
import AbilitySystem from './AbilitySystem';
import { useKeyPress } from '../hooks/useKeyPress';
import { useMobile } from '../hooks/use-mobile';

const CharacterManager = () => {
  const [activeCharacter, setActiveCharacter] = useState('sarah');
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [health, setHealth] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [experience, setExperience] = useState({ level: 1, points: 0, percent: 0 });
  
  const isMobile = useMobile();
  const qPressed = useKeyPress('q');
  
  // Troca de personagens com a tecla Q
  useEffect(() => {
    if (qPressed) {
      setActiveCharacter(prev => prev === 'sarah' ? 'anaMaria' : 'sarah');
    }
  }, [qPressed]);
  
  // Gerenciar movimento do personagem
  const handleMove = (newPosition) => {
    setPosition(newPosition);
  };
  
  // Gerenciar uso de habilidades
  const handleUseAbility = (ability) => {
    console.log(`Usando habilidade: ${ability.name}`);
    
    // Reduzir energia ao usar habilidades
    setEnergy(prev => Math.max(0, prev - 10));
    
    // Ganhar experiência ao usar habilidades
    addExperience(5);
  };
  
  // Sistema de experiência
  const addExperience = (points) => {
    const newPoints = experience.points + points;
    const pointsToNextLevel = experience.level * 100;
    
    if (newPoints >= pointsToNextLevel) {
      // Level up!
      setExperience({
        level: experience.level + 1,
        points: newPoints - pointsToNextLevel,
        percent: ((newPoints - pointsToNextLevel) / ((experience.level + 1) * 100)) * 100
      });
      
      // Benefícios de subir de nível
      setHealth(100);
      setEnergy(100);
    } else {
      setExperience({
        ...experience,
        points: newPoints,
        percent: (newPoints / pointsToNextLevel) * 100
      });
    }
  };
  
  return (
    <div className="character-system">
      {/* Personagem ativo */}
      {activeCharacter === 'sarah' ? (
        <Sarah 
          position={position}
          onMove={handleMove}
          onUseAbility={handleUseAbility}
        />
      ) : (
        <AnaMaria 
          position={position}
          onMove={handleMove}
          onUseAbility={handleUseAbility}
        />
      )}
      
      {/* Sistema de pets */}
      <PetManager playerPosition={position} />
      
      {/* Sistema de habilidades */}
      <AbilitySystem 
        character={activeCharacter}
        onUseAbility={handleUseAbility}
      />
      
      {/* Interface do usuário */}
      <div className="character-ui">
        {/* Status do personagem */}
        <div className="character-status">
          <div className="health-bar">
            <div 
              className="health-fill" 
              style={{ 
                width: `${health}%`,
                backgroundColor: activeCharacter === 'sarah' ? '#E91E63' : '#007BFF'
              }}
            />
            <span>❤️ {health}%</span>
          </div>
          
          <div className="energy-bar">
            <div 
              className="energy-fill" 
              style={{ 
                width: `${energy}%`,
                backgroundColor: '#FFD700'
              }}
            />
            <span>⚡ {energy}%</span>
          </div>
          
          <div className="experience-bar">
            <div 
              className="experience-fill" 
              style={{ 
                width: `${experience.percent}%`,
                backgroundColor: '#00C851'
              }}
            />
            <span>✨ Nível {experience.level}</span>
          </div>
        </div>
        
        {/* Botão para troca de personagem em dispositivos móveis */}
        {isMobile && (
          <button 
            className="character-switch-button"
            onClick={() => setActiveCharacter(prev => prev === 'sarah' ? 'anaMaria' : 'sarah')}
          >
            Trocar Personagem (Q)
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterManager;
