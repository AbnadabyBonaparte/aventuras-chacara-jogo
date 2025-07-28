import React, { useState, useEffect } from 'react';
import Mel from './pets/Mel';
import Apache from './pets/Apache';
import Mingual from './pets/Mingual';
import { useKeyPress } from '../hooks/useKeyPress';
import { useMobile } from '../hooks/use-mobile';

const PetManager = ({ playerPosition }) => {
  const [activePet, setActivePet] = useState(null);
  const isMobile = useMobile();
  
  // Teclas para ativar os pets
  const key1Pressed = useKeyPress('1');
  const key2Pressed = useKeyPress('2');
  const key3Pressed = useKeyPress('3');
  
  // Ativar pets com as teclas 1, 2, 3
  useEffect(() => {
    if (key1Pressed) {
      setActivePet(prev => prev === 'mel' ? null : 'mel');
    }
  }, [key1Pressed]);
  
  useEffect(() => {
    if (key2Pressed) {
      setActivePet(prev => prev === 'apache' ? null : 'apache');
    }
  }, [key2Pressed]);
  
  useEffect(() => {
    if (key3Pressed) {
      setActivePet(prev => prev === 'mingual' ? null : 'mingual');
    }
  }, [key3Pressed]);
  
  return (
    <>
      {/* Renderizar o pet ativo */}
      {activePet === 'mel' && <Mel playerPosition={playerPosition} />}
      {activePet === 'apache' && <Apache playerPosition={playerPosition} />}
      {activePet === 'mingual' && <Mingual playerPosition={playerPosition} />}
      
      {/* Interface para controle de pets */}
      <div className="pet-controls">
        {/* Ícones para desktop */}
        <div className="pet-icons">
          <div 
            className={`pet-icon ${activePet === 'mel' ? 'active' : ''}`}
            onClick={() => setActivePet(prev => prev === 'mel' ? null : 'mel')}
          >
            <img src="/assets/ui/mel_icon.png" alt="Mel" />
            <span className="key-hint">1</span>
          </div>
          
          <div 
            className={`pet-icon ${activePet === 'apache' ? 'active' : ''}`}
            onClick={() => setActivePet(prev => prev === 'apache' ? null : 'apache')}
          >
            <img src="/assets/ui/apache_icon.png" alt="Apache" />
            <span className="key-hint">2</span>
          </div>
          
          <div 
            className={`pet-icon ${activePet === 'mingual' ? 'active' : ''}`}
            onClick={() => setActivePet(prev => prev === 'mingual' ? null : 'mingual')}
          >
            <img src="/assets/ui/mingual_icon.png" alt="Mingual" />
            <span className="key-hint">3</span>
          </div>
        </div>
        
        {/* Botões maiores para dispositivos móveis */}
        {isMobile && (
          <div className="mobile-pet-buttons">
            <button 
              className={activePet === 'mel' ? 'active' : ''}
              onClick={() => setActivePet(prev => prev === 'mel' ? null : 'mel')}
            >
              Mel
            </button>
            
            <button 
              className={activePet === 'apache' ? 'active' : ''}
              onClick={() => setActivePet(prev => prev === 'apache' ? null : 'apache')}
            >
              Apache
            </button>
            
            <button 
              className={activePet === 'mingual' ? 'active' : ''}
              onClick={() => setActivePet(prev => prev === 'mingual' ? null : 'mingual')}
            >
              Mingual
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PetManager;
