import { useState, useEffect } from 'react';

// Hook para detectar quando uma tecla é pressionada
export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    function downHandler({ key }) {
      if (key.toLowerCase() === targetKey.toLowerCase()) {
        setKeyPressed(true);
      }
    }

    function upHandler({ key }) {
      if (key.toLowerCase() === targetKey.toLowerCase()) {
        setKeyPressed(false);
      }
    }

    // Adicionar event listeners
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // Remover event listeners ao desmontar
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}
