import React, { useState, useEffect } from 'react';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useMobile } from '../../hooks/use-mobile';

// Componente base para todos os personagens
const Character = ({ type, position, onMove, onUseAbility }) => {
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const isMobile = useMobile();
  
  // Teclas de movimento
  const upPressed = useKeyPress('w');
  const leftPressed = useKeyPress('a');
  const downPressed = useKeyPress('s');
  const rightPressed = useKeyPress('d');
  
  // Teclas de habilidades
  const ePressed = useKeyPress('e');
  const rPressed = useKeyPress('r');
  const fPressed = useKeyPress('f');
  
  // Dados específicos por personagem
  const characterData = {
    sarah: {
      name: 'Sarah Hadassa',
      spriteSheet: '/assets/characters/sarah_spritesheet.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCounts: { idle: 4, walk: 8 },
      abilities: [
        { name: 'Onda Artística', key: 'e', cooldown: 8000 },
        { name: 'Voz dos Animais', key: 'r', cooldown: 15000 },
        { name: 'Escudo de Páginas', key: 'f', cooldown: 12000 }
      ],
      speed: 3,
      color: '#E91E63' // Rosa vibrante
    },
    anaMaria: {
      name: 'Ana Maria',
      spriteSheet: '/assets/characters/ana_spritesheet.png',
      frameWidth: 64,
      frameHeight: 64,
      frameCounts: { idle: 4, walk: 8 },
      abilities: [
        { name: 'Rajada Veloz', key: 'e', cooldown: 5000 },
        { name: 'Super Salto', key: 'r', cooldown: 10000 },
        { name: 'Esquiva Perfeita', key: 'f', cooldown: 15000 }
      ],
      speed: 3.5,
      color: '#007BFF' // Azul cristalino
    }
  };
  
  const data = characterData[type] || characterData.sarah;
  
  // Animação do personagem
  useEffect(() => {
    if (isMoving) {
      const animInterval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % data.frameCounts.walk);
      }, 150);
      return () => clearInterval(animInterval);
    } else {
      const animInterval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % data.frameCounts.idle);
      }, 300);
      return () => clearInterval(animInterval);
    }
  }, [isMoving, data.frameCounts]);
  
  // Movimento do personagem
  useEffect(() => {
    if (!onMove) return;
    
    let newDirection = direction;
    let moving = false;
    let deltaX = 0;
    let deltaY = 0;
    
    if (upPressed) {
      newDirection = 'up';
      deltaY = -data.speed;
      moving = true;
    } else if (downPressed) {
      newDirection = 'down';
      deltaY = data.speed;
      moving = true;
    }
    
    if (leftPressed) {
      newDirection = 'left';
      deltaX = -data.speed;
      moving = true;
    } else if (rightPressed) {
      newDirection = 'right';
      deltaX = data.speed;
      moving = true;
    }
    
    if (newDirection !== direction) {
      setDirection(newDirection);
    }
    
    if (isMoving !== moving) {
      setIsMoving(moving);
    }
    
    if (moving) {
      onMove({ x: position.x + deltaX, y: position.y + deltaY });
    }
  }, [upPressed, downPressed, leftPressed, rightPressed, position, data.speed]);
  
  // Usar habilidades
  useEffect(() => {
    if (!onUseAbility) return;
    
    if (ePressed) {
      onUseAbility(data.abilities[0]);
    } else if (rPressed) {
      onUseAbility(data.abilities[1]);
    } else if (fPressed) {
      onUseAbility(data.abilities[2]);
    }
  }, [ePressed, rPressed, fPressed]);
  
  // Calcular posição do sprite na spritesheet
  const getSpritePosition = () => {
    const directionIndex = {
      down: 0,
      left: 1,
      right: 2,
      up: 3
    }[direction];
    
    const animationType = isMoving ? 'walk' : 'idle';
    const frameCount = currentFrame;
    
    return {
      backgroundImage: `url(${data.spriteSheet})`,
      backgroundPosition: `-${frameCount * data.frameWidth}px -${directionIndex * data.frameHeight}px`,
      width: `${data.frameWidth}px`,
      height: `${data.frameHeight}px`
    };
  };
  
  return (
    <div 
      className={`character ${type}`}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: Math.floor(position.y)
      }}
    >
      <div 
        className="character-sprite"
        style={getSpritePosition()}
      />
      
      {/* Nome do personagem */}
      <div className="character-name" style={{ color: data.color }}>
        {data.name}
      </div>
      
      {/* Controladores touch para dispositivos móveis */}
      {isMobile && (
        <div className="mobile-controls">
          {/* Implementação de controles touch */}
        </div>
      )}
    </div>
  );
};

export default Character;
