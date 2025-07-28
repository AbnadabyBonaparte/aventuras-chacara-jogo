import React, { useState, useEffect } from 'react';

const Pet = ({ type, playerPosition }) => {
  const [position, setPosition] = useState({ ...playerPosition });
  const [animation, setAnimation] = useState('idle');
  
  // Dados específicos para cada pet
  const petData = {
    mel: {
      name: 'Mel',
      spriteSheet: '/assets/pets/mel_spritesheet.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCounts: { idle: 4, active: 6 },
      followDistance: 60,
      followSpeed: 1.2,
      ability: 'Detecção de Itens',
      color: '#FFD700' // Amarelo
    },
    apache: {
      name: 'Apache',
      spriteSheet: '/assets/pets/apache_spritesheet.png',
      frameWidth: 40,
      frameHeight: 40,
      frameCounts: { idle: 4, active: 6 },
      followDistance: 50,
      followSpeed: 1.5,
      ability: 'Rastreamento',
      color: '#8BC34A' // Verde
    },
    mingual: {
      name: 'Mingual',
      spriteSheet: '/assets/pets/mingual_spritesheet.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCounts: { idle: 4, active: 6 },
      followDistance: 70,
      followSpeed: 1.8,
      ability: 'Visão Noturna',
      color: '#9C27B0' // Roxo
    }
  };
  
  const data = petData[type] || petData.mel;
  
  // Seguir o jogador
  useEffect(() => {
    const dx = playerPosition.x - position.x;
    const dy = playerPosition.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > data.followDistance) {
      // Pet está longe, precisa seguir
      const vx = (dx / distance) * data.followSpeed;
      const vy = (dy / distance) * data.followSpeed;
      
      setPosition(prev => ({
        x: prev.x + vx,
        y: prev.y + vy
      }));
      
      setAnimation('active');
    } else {
      // Pet está perto o suficiente
      setAnimation('idle');
    }
  }, [playerPosition]);
  
  // Animação do pet
  const [currentFrame, setCurrentFrame] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => 
        (prev + 1) % data.frameCounts[animation]
      );
    }, animation === 'idle' ? 300 : 150);
    
    return () => clearInterval(interval);
  }, [animation, data.frameCounts]);
  
  // Calcular posição do sprite na spritesheet
  const getSpritePosition = () => {
    const animationIndex = animation === 'idle' ? 0 : 1;
    
    return {
      backgroundImage: `url(${data.spriteSheet})`,
      backgroundPosition: `-${currentFrame * data.frameWidth}px -${animationIndex * data.frameHeight}px`,
      width: `${data.frameWidth}px`,
      height: `${data.frameHeight}px`
    };
  };
  
  return (
    <div 
      className={`pet ${type}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: Math.floor(position.y - 1)
      }}
    >
      <div 
        className="pet-sprite"
        style={getSpritePosition()}
      />
      
      <div className="pet-name" style={{ color: data.color }}>
        {data.name}
      </div>
    </div>
  );
};

export default Pet;
