import React from 'react';
import Character from './Character';

const AnaMaria = ({ position, onMove, onUseAbility }) => {
  return (
    <Character 
      type="anaMaria"
      position={position}
      onMove={onMove}
      onUseAbility={onUseAbility}
    />
  );
};

export default AnaMaria;
