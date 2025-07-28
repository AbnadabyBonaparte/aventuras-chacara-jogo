import React, { useState } from 'react';

const AbilitySystem = ({ character, onUseAbility }) => {
  const [cooldowns, setCooldowns] = useState({});
  
  // Configurações de habilidades por personagem
  const characterAbilities = {
    sarah: [
      { name: 'Onda Artística', key: 'e', cooldown: 8000, icon: '/assets/icons/art-wave.png' },
      { name: 'Voz dos Animais', key: 'r', cooldown: 15000, icon: '/assets/icons/animal-voice.png' },
      { name: 'Escudo de Páginas', key: 'f', cooldown: 12000, icon: '/assets/icons/page-shield.png' }
    ],
    anaMaria: [
      { name: 'Rajada Veloz', key: 'e', cooldown: 5000, icon: '/assets/icons/swift-dash.png' },
      { name: 'Super Salto', key: 'r', cooldown: 10000, icon: '/assets/icons/super-jump.png' },
      { name: 'Esquiva Perfeita', key: 'f', cooldown: 15000, icon: '/assets/icons/perfect-dodge.png' }
    ]
  };
  
  const abilities = characterAbilities[character] || characterAbilities.sarah;
  
  // Usar habilidade e iniciar cooldown
  const useAbility = (ability) => {
    // Verificar se está em cooldown
    const cooldownEnd = cooldowns[ability.name] || 0;
    if (Date.now() < cooldownEnd) return;
    
    // Usar a habilidade
    onUseAbility(ability);
    
    // Iniciar cooldown
    setCooldowns(prev => ({
      ...prev,
      [ability.name]: Date.now() + ability.cooldown
    }));
  };
  
  return (
    <div className="ability-system">
      <div className="ability-bar">
        {abilities.map(ability => {
          const cooldownEnd = cooldowns[ability.name] || 0;
          const isOnCooldown = Date.now() < cooldownEnd;
          const cooldownPercent = isOnCooldown 
            ? ((cooldownEnd - Date.now()) / ability.cooldown) * 100 
            : 0;
          
          return (
            <div 
              key={ability.name}
              className={`ability-icon ${isOnCooldown ? 'on-cooldown' : ''}`}
              onClick={() => useAbility(ability)}
            >
              <img src={ability.icon} alt={ability.name} />
              
              <span className="key-hint">{ability.key.toUpperCase()}</span>
              <span className="ability-name">{ability.name}</span>
              
              {/* Overlay de cooldown */}
              {isOnCooldown && (
                <div 
                  className="cooldown-overlay" 
                  style={{ height: `${cooldownPercent}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AbilitySystem;
