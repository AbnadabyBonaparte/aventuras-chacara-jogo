import React from 'react';
import Character from './Character';

const Sarah = ({ position, onMove, onUseAbility }) => {
  return (
    <Character 
      type="sarah"
      position={position}
      onMove={onMove}
      onUseAbility={onUseAbility}
    />
  );
};

export default Sarah;
