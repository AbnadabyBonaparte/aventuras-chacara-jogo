import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  Heart, 
  Zap, 
  Star, 
  Gamepad2, 
  Users, 
  Map, 
  Backpack,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import TouchControls from './components/TouchControls.jsx'
import { useDeviceDetection, usePerformanceOptimization, useResponsiveLayout, useBatteryOptimization } from './hooks/useDeviceDetection.js'
import './App.css'

// Dados dos personagens
const characters = {
  sarah: {
    name: "Sarah Hadassa",
    description: "A artista criativa",
    health: 100,
    energy: 100,
    level: 1,
    experience: 0,
    abilities: [
      { name: "Onda Artística", cooldown: 0, maxCooldown: 5, icon: "🎨" },
      { name: "Voz dos Animais", cooldown: 0, maxCooldown: 8, icon: "🐾" },
      { name: "Escudo de Páginas", cooldown: 0, maxCooldown: 10, icon: "📓" }
    ],
    color: "from-pink-500 to-purple-600"
  },
  ana: {
    name: "Ana Beatriz",
    description: "A atleta determinada",
    health: 100,
    energy: 100,
    level: 1,
    experience: 0,
    abilities: [
      { name: "Rajada Veloz", cooldown: 0, maxCooldown: 4, icon: "⚡" },
      { name: "Super Salto", cooldown: 0, maxCooldown: 6, icon: "🦘" },
      { name: "Esquiva Perfeita", cooldown: 0, maxCooldown: 12, icon: "🛡️" }
    ],
    color: "from-blue-500 to-green-500"
  }
}

// Dados dos pets
const pets = {
  mel: { name: "Mel", type: "Yorkshire", ability: "Detecta itens escondidos", icon: "🐕", active: false },
  apache: { name: "Apache", type: "Pastor Alemão", ability: "Rastreia e intimida", icon: "🐕‍🦺", active: false },
  mingual: { name: "Mingual", type: "Gato", ability: "Visão noturna e escalada", icon: "🐱", active: false }
}

// Sistema de inimigos
const enemyTypes = {
  toadToxic: { name: "Sapo Tóxico", health: 50, damage: 15, icon: "🐸", color: "text-red-500" },
  metalSpider: { name: "Aranha Metálica", health: 75, damage: 20, icon: "🕷️", color: "text-purple-500" },
  mutantFish: { name: "Peixe Mutante", health: 60, damage: 18, icon: "🐟", color: "text-blue-500" },
  disoriented_bat: { name: "Morcego Desorientado", health: 40, damage: 12, icon: "🦇", color: "text-yellow-500" }
}

// Sistema de itens
const itemTypes = {
  healing: [
    { name: "Fruta Tropical", value: 20, icon: "🥭", rarity: "common" },
    { name: "Mel Puro", value: 50, icon: "🍯", rarity: "rare" },
    { name: "Água Cristalina", value: 100, icon: "💧", rarity: "epic" }
  ],
  tools: [
    { name: "Lanterna", effect: "Ilumina cavernas", icon: "🔦", rarity: "common" },
    { name: "Corda", effect: "Acesso a áreas altas", icon: "🪢", rarity: "common" },
    { name: "Detector de Metais", effect: "Encontra itens raros", icon: "🔍", rarity: "rare" }
  ],
  special: [
    { name: "Cristal de Energia", effect: "Aumenta mana máxima", icon: "💎", rarity: "epic" },
    { name: "Sementes Mágicas", effect: "Cura a natureza", icon: "🌱", rarity: "rare" },
    { name: "Chave Antiga", effect: "Abre portas secretas", icon: "🗝️", rarity: "legendary" }
  ]
}

// Áreas do jogo
const gameAreas = {
  home: { name: "Casa Principal", description: "O lar acolhedor da família", icon: "🏠", unlocked: true },
  lab: { name: "Laboratório", description: "Onde a IA AMIGO-7 foi criada", icon: "🔬", unlocked: true },
  river: { name: "Rio Murice", description: "O rio misterioso que precisa ser purificado", icon: "🌊", unlocked: true },
  cave: { name: "Caverna das Luzes", description: "Cristais bioluminescentes guardam segredos", icon: "🕳️", unlocked: false },
  forest: { name: "Mata Densa", description: "Labirinto natural cheio de desafios", icon: "🌳", unlocked: false },
  waterfall: { name: "Cachoeira Secreta", description: "Água pura que pode curar tudo", icon: "💦", unlocked: false },
  polluted: { name: "Área Poluída", description: "O epicentro da corrupção", icon: "☠️", unlocked: false }
}

function App() {
  // Hooks de otimização para dispositivos
  const deviceInfo = useDeviceDetection()
  const performanceSettings = usePerformanceOptimization(deviceInfo)
  const layout = useResponsiveLayout()
  const batteryInfo = useBatteryOptimization()
  
  // Estados do jogo
  const [currentCharacter, setCurrentCharacter] = useState('sarah')
  const [gameState, setGameState] = useState('menu') // menu, playing, paused, inventory, settings
  const [currentArea, setCurrentArea] = useState('home')
  const [gameData, setGameData] = useState({
    characters: { ...characters },
    pets: { ...pets },
    inventory: [],
    areas: { ...gameAreas },
    score: 0,
    playtime: 0,
    achievements: [],
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'normal',
      performanceMode: deviceInfo.isMobile ? 'optimized' : 'quality'
    }
  })
  
  // Estados de combate
  const [inCombat, setInCombat] = useState(false)
  const [currentEnemy, setCurrentEnemy] = useState(null)
  const [combatLog, setCombatLog] = useState([])
  
  // Estados de UI
  const [showNotification, setShowNotification] = useState(null)
  const [activeQuest, setActiveQuest] = useState(null)
  
  // Refs para animações
  const gameLoopRef = useRef()
  const playtimeRef = useRef()

  // Sistema de progressão e experiência
  const gainExperience = (amount) => {
    setGameData(prev => {
      const newData = { ...prev }
      const char = newData.characters[currentCharacter]
      char.experience += amount
      
      // Level up check
      const expNeeded = char.level * 100
      if (char.experience >= expNeeded) {
        char.level += 1
        char.experience -= expNeeded
        char.health = 100 // Restaura vida no level up
        char.energy = 100 // Restaura energia no level up
        
        showNotificationMessage(`${char.name} subiu para o nível ${char.level}!`, 'success')
        
        // Desbloquear áreas baseado no nível
        if (char.level >= 2 && !newData.areas.cave.unlocked) {
          newData.areas.cave.unlocked = true
          showNotificationMessage("Nova área desbloqueada: Caverna das Luzes!", 'info')
        }
        if (char.level >= 3 && !newData.areas.forest.unlocked) {
          newData.areas.forest.unlocked = true
          showNotificationMessage("Nova área desbloqueada: Mata Densa!", 'info')
        }
      }
      
      return newData
    })
  }

  // Sistema de combate
  const startCombat = (enemyType) => {
    const enemy = {
      ...enemyTypes[enemyType],
      currentHealth: enemyTypes[enemyType].health,
      id: Date.now()
    }
    setCurrentEnemy(enemy)
    setInCombat(true)
    setCombatLog([`Um ${enemy.name} apareceu!`])
  }

  const playerAttack = (abilityIndex = null) => {
    if (!currentEnemy || !inCombat) return
    
    const char = gameData.characters[currentCharacter]
    let damage = 25
    let abilityUsed = null
    
    if (abilityIndex !== null && char.abilities[abilityIndex].cooldown === 0) {
      const ability = char.abilities[abilityIndex]
      damage = 35 + (abilityIndex * 10) // Habilidades fazem mais dano
      abilityUsed = ability.name
      
      // Ativar cooldown
      setGameData(prev => {
        const newData = { ...prev }
        newData.characters[currentCharacter].abilities[abilityIndex].cooldown = ability.maxCooldown
        return newData
      })
    }
    
    const newEnemyHealth = Math.max(0, currentEnemy.currentHealth - damage)
    setCurrentEnemy(prev => ({ ...prev, currentHealth: newEnemyHealth }))
    
    const attackMessage = abilityUsed 
      ? `${char.name} usou ${abilityUsed} e causou ${damage} de dano!`
      : `${char.name} atacou e causou ${damage} de dano!`
    
    setCombatLog(prev => [...prev, attackMessage])
    
    if (newEnemyHealth <= 0) {
      // Inimigo derrotado
      setTimeout(() => {
        setCombatLog(prev => [...prev, `${currentEnemy.name} foi derrotado!`])
        gainExperience(50)
        setGameData(prev => ({ ...prev, score: prev.score + 100 }))
        
        // Chance de drop de item
        if (Math.random() < 0.3) {
          const randomCategory = Object.keys(itemTypes)[Math.floor(Math.random() * Object.keys(itemTypes).length)]
          const randomItem = itemTypes[randomCategory][Math.floor(Math.random() * itemTypes[randomCategory].length)]
          addToInventory(randomItem)
        }
        
        setTimeout(() => {
          setInCombat(false)
          setCurrentEnemy(null)
          setCombatLog([])
        }, 2000)
      }, 1000)
    } else {
      // Inimigo contra-ataca
      setTimeout(() => {
        const enemyDamage = currentEnemy.damage
        setGameData(prev => {
          const newData = { ...prev }
          const char = newData.characters[currentCharacter]
          char.health = Math.max(0, char.health - enemyDamage)
          
          if (char.health <= 0) {
            // Game over ou respawn
            char.health = 50 // Respawn com metade da vida
            showNotificationMessage("Você foi derrotado! Respawnando...", 'warning')
          }
          
          return newData
        })
        
        setCombatLog(prev => [...prev, `${currentEnemy.name} atacou e causou ${enemyDamage} de dano!`])
      }, 1500)
    }
  }

  // Sistema de inventário
  const addToInventory = (item) => {
    setGameData(prev => {
      const newInventory = [...prev.inventory]
      const existingItem = newInventory.find(i => i.name === item.name)
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1
      } else {
        newInventory.push({ ...item, quantity: 1 })
      }
      
      showNotificationMessage(`${item.icon} ${item.name} adicionado ao inventário!`, 'success')
      return { ...prev, inventory: newInventory }
    })
  }

  const useItem = (itemIndex) => {
    const item = gameData.inventory[itemIndex]
    if (!item) return
    
    setGameData(prev => {
      const newData = { ...prev }
      const char = newData.characters[currentCharacter]
      
      // Aplicar efeito do item
      if (item.value) {
        char.health = Math.min(100, char.health + item.value)
        showNotificationMessage(`${item.icon} ${item.name} usado! +${item.value} HP`, 'success')
      }
      
      // Remover item do inventário
      const newInventory = [...newData.inventory]
      if (item.quantity > 1) {
        newInventory[itemIndex].quantity -= 1
      } else {
        newInventory.splice(itemIndex, 1)
      }
      newData.inventory = newInventory
      
      return newData
    })
  }

  // Sistema de pets
  const togglePet = (petKey) => {
    setGameData(prev => {
      const newData = { ...prev }
      // Desativar todos os pets primeiro
      Object.keys(newData.pets).forEach(key => {
        newData.pets[key].active = false
      })
      // Ativar o pet selecionado
      newData.pets[petKey].active = true
      
      showNotificationMessage(`${newData.pets[petKey].icon} ${newData.pets[petKey].name} está te acompanhando!`, 'info')
      return newData
    })
  }

  // Sistema de notificações
  const showNotificationMessage = (message, type = 'info') => {
    setShowNotification({ message, type })
    setTimeout(() => setShowNotification(null), 3000)
  }

  // Handler para controles touch
  const handleTouchAction = (action, data = null) => {
    switch (action) {
      case 'move':
        // Implementar movimento do personagem
        if (data && (Math.abs(data.x) > 0.3 || Math.abs(data.y) > 0.3)) {
          // Simular movimento baseado na direção do joystick
          console.log(`Movendo personagem: x=${data.x.toFixed(2)}, y=${data.y.toFixed(2)}`)
        }
        break
      case 'attack':
        if (inCombat) {
          playerAttack()
        }
        break
      case 'special1':
        if (inCombat) {
          playerAttack(0) // Primeira habilidade especial
        }
        break
      case 'special2':
        if (inCombat) {
          playerAttack(1) // Segunda habilidade especial
        }
        break
      case 'interact':
        if (!inCombat) {
          // Simular exploração
          const randomItem = itemTypes.healing[Math.floor(Math.random() * itemTypes.healing.length)]
          addToInventory(randomItem)
        }
        break
      case 'jump':
        // Implementar pulo/esquiva
        showNotificationMessage("💨 Pulo realizado!", 'info')
        break
      case 'run':
        // Implementar corrida
        showNotificationMessage("🏃‍♀️ Correndo!", 'info')
        break
      case 'pet1':
        togglePet('mel')
        break
      case 'pet2':
        togglePet('apache')
        break
      case 'pet3':
        togglePet('mingual')
        break
      case 'menu':
        setGameState('paused')
        break
      default:
        console.log(`Ação não reconhecida: ${action}`)
    }
  }

  // Game loop para cooldowns e tempo
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        setGameData(prev => {
          const newData = { ...prev }
          
          // Reduzir cooldowns das habilidades
          Object.keys(newData.characters).forEach(charKey => {
            newData.characters[charKey].abilities.forEach(ability => {
              if (ability.cooldown > 0) {
                ability.cooldown -= 1
              }
            })
          })
          
          // Regeneração lenta de energia
          const char = newData.characters[currentCharacter]
          if (char.energy < 100) {
            char.energy = Math.min(100, char.energy + 1)
          }
          
          return newData
        })
      }, 1000)
      
      // Timer de tempo de jogo
      playtimeRef.current = setInterval(() => {
        setGameData(prev => ({ ...prev, playtime: prev.playtime + 1 }))
      }, 1000)
    }
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      if (playtimeRef.current) clearInterval(playtimeRef.current)
    }
  }, [gameState, currentCharacter])

  // Formatação de tempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Componente de Menu Principal
  const MainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            🌟 Aventuras na Chácara
          </CardTitle>
          <p className="text-lg text-gray-600">O Mistério do Rio Murice</p>
          <p className="text-sm text-gray-500">Versão Moderna - Todas as Idades</p>
          
          {/* Informações do dispositivo */}
          <div className="flex items-center justify-center space-x-2 mt-2">
            {deviceInfo.isMobile && <Smartphone className="w-4 h-4 text-blue-500" />}
            {deviceInfo.isTablet && <Tablet className="w-4 h-4 text-green-500" />}
            {deviceInfo.isDesktop && <Monitor className="w-4 h-4 text-purple-500" />}
            <span className="text-xs text-gray-500">
              {deviceInfo.screenSize} • {deviceInfo.orientation}
            </span>
          </div>
          
          {/* Indicador de bateria baixa */}
          {batteryInfo.lowBattery && (
            <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
              <p className="text-xs text-red-600">
                🔋 Bateria baixa - Modo economia ativado
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => setGameState('playing')} 
            className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Play className="mr-2" /> Iniciar Aventura
          </Button>
          <Button 
            onClick={() => setGameState('settings')} 
            variant="outline" 
            className="w-full"
          >
            <Settings className="mr-2" /> Configurações
          </Button>
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>🎮 Compatível com Web e Mobile</p>
            <p>👨‍👩‍👧‍👦 Diversão para toda a família</p>
            {deviceInfo.isTouchDevice && (
              <p>📱 Controles touch otimizados</p>
            )}
            <p className="text-xs">
              Modo: {performanceSettings.renderQuality} • 
              FPS: {performanceSettings.maxFPS}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Componente de Interface de Jogo
  const GameInterface = () => {
    const char = gameData.characters[currentCharacter]
    const activePet = Object.entries(gameData.pets).find(([key, pet]) => pet.active)?.[1]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
        {/* Header com informações do personagem */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${char.color} flex items-center justify-center text-white font-bold text-xl`}>
                {char.name[0]}
              </div>
              <div>
                <h2 className="font-bold text-lg">{char.name}</h2>
                <p className="text-sm text-gray-600">Nível {char.level} • {gameAreas[currentArea].name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGameState('inventory')}
              >
                <Backpack className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGameState('paused')}
              >
                <Pause className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Barras de status */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Vida</span>
              </div>
              <Progress value={char.health} className="h-2" />
              <span className="text-xs text-gray-500">{char.health}/100</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Energia</span>
              </div>
              <Progress value={char.energy} className="h-2" />
              <span className="text-xs text-gray-500">{char.energy}/100</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">EXP</span>
              </div>
              <Progress value={(char.experience / (char.level * 100)) * 100} className="h-2" />
              <span className="text-xs text-gray-500">{char.experience}/{char.level * 100}</span>
            </div>
          </div>
          
          {/* Pet ativo */}
          {activePet && (
            <div className="flex items-center space-x-2 text-sm">
              <span>{activePet.icon}</span>
              <span className="font-medium">{activePet.name}</span>
              <span className="text-gray-500">• {activePet.ability}</span>
            </div>
          )}
        </div>

        {/* Área de jogo principal */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-4 shadow-lg min-h-96">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{gameAreas[currentArea].icon} {gameAreas[currentArea].name}</h3>
            <p className="text-gray-600">{gameAreas[currentArea].description}</p>
          </div>
          
          {inCombat ? (
            // Interface de combate
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2">
                  {currentEnemy.icon} {currentEnemy.name}
                </h4>
                <Progress 
                  value={(currentEnemy.currentHealth / currentEnemy.health) * 100} 
                  className="h-4 mb-2" 
                />
                <span className="text-sm">{currentEnemy.currentHealth}/{currentEnemy.health} HP</span>
              </div>
              
              {/* Habilidades de combate */}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => playerAttack()} className="py-3">
                  ⚔️ Ataque Básico
                </Button>
                {char.abilities.map((ability, index) => (
                  <Button
                    key={index}
                    onClick={() => playerAttack(index)}
                    disabled={ability.cooldown > 0}
                    variant={ability.cooldown > 0 ? "outline" : "default"}
                    className="py-3"
                  >
                    {ability.icon} {ability.name}
                    {ability.cooldown > 0 && (
                      <span className="ml-2 text-xs">({ability.cooldown}s)</span>
                    )}
                  </Button>
                ))}
              </div>
              
              {/* Log de combate */}
              <div className="bg-gray-100 rounded p-3 h-32 overflow-y-auto">
                {combatLog.map((log, index) => (
                  <p key={index} className="text-sm mb-1">{log}</p>
                ))}
              </div>
            </div>
          ) : (
            // Interface de exploração
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => startCombat('toadToxic')}
                  className="py-6 bg-red-500 hover:bg-red-600"
                >
                  🐸 Encontrar Inimigos
                </Button>
                <Button
                  onClick={() => {
                    const randomItem = itemTypes.healing[Math.floor(Math.random() * itemTypes.healing.length)]
                    addToInventory(randomItem)
                  }}
                  className="py-6 bg-green-500 hover:bg-green-600"
                >
                  🔍 Explorar Área
                </Button>
                <Button
                  onClick={() => gainExperience(25)}
                  className="py-6 bg-blue-500 hover:bg-blue-600"
                >
                  📚 Resolver Puzzle
                </Button>
                <Button
                  onClick={() => setGameState('areas')}
                  className="py-6 bg-purple-500 hover:bg-purple-600"
                >
                  🗺️ Mudar Área
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controles inferiores */}
        <div className="grid grid-cols-2 gap-4">
          {/* Troca de personagem */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Personagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(gameData.characters).map(([key, character]) => (
                <Button
                  key={key}
                  onClick={() => setCurrentCharacter(key)}
                  variant={currentCharacter === key ? "default" : "outline"}
                  className="w-full justify-start"
                  size="sm"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${character.color} mr-2`}></div>
                  {character.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Pets */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(gameData.pets).map(([key, pet]) => (
                <Button
                  key={key}
                  onClick={() => togglePet(key)}
                  variant={pet.active ? "default" : "outline"}
                  className="w-full justify-start"
                  size="sm"
                >
                  {pet.icon} {pet.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notificação */}
        {showNotification && (
          <div className="fixed top-4 right-4 z-50">
            <div className={`p-4 rounded-lg shadow-lg ${
              showNotification.type === 'success' ? 'bg-green-500' :
              showNotification.type === 'warning' ? 'bg-yellow-500' :
              showNotification.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white`}>
              {showNotification.message}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Componente de Inventário
  const InventoryScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Backpack className="mr-2" /> Inventário
            </CardTitle>
            <Button onClick={() => setGameState('playing')} variant="outline">
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {gameData.inventory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Inventário vazio</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gameData.inventory.map((item, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    {item.quantity > 1 && (
                      <Badge variant="secondary" className="mt-1">
                        x{item.quantity}
                      </Badge>
                    )}
                    {item.value && (
                      <Button
                        onClick={() => useItem(index)}
                        size="sm"
                        className="mt-2 w-full"
                      >
                        Usar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Componente de Seleção de Áreas
  const AreasScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Map className="mr-2" /> Áreas Disponíveis
            </CardTitle>
            <Button onClick={() => setGameState('playing')} variant="outline">
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(gameData.areas).map(([key, area]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all ${
                  area.unlocked 
                    ? 'hover:shadow-lg hover:scale-105' 
                    : 'opacity-50 cursor-not-allowed'
                } ${currentArea === key ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => {
                  if (area.unlocked) {
                    setCurrentArea(key)
                    setGameState('playing')
                  }
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{area.icon}</div>
                  <h4 className="font-bold">{area.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                  {!area.unlocked && (
                    <Badge variant="secondary" className="mt-2">
                      Bloqueada
                    </Badge>
                  )}
                  {currentArea === key && (
                    <Badge className="mt-2">
                      Atual
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Componente de Configurações
  const SettingsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="mr-2" /> Configurações
            </CardTitle>
            <Button onClick={() => setGameState('menu')} variant="outline">
              Voltar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Som</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGameData(prev => ({
                ...prev,
                settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled }
              }))}
            >
              {gameData.settings.soundEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span>Música</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGameData(prev => ({
                ...prev,
                settings: { ...prev.settings, musicEnabled: !prev.settings.musicEnabled }
              }))}
            >
              {gameData.settings.musicEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
          </div>
          <div className="space-y-2">
            <span>Dificuldade</span>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'normal', 'hard'].map(diff => (
                <Button
                  key={diff}
                  variant={gameData.settings.difficulty === diff ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGameData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, difficulty: diff }
                  }))}
                >
                  {diff === 'easy' ? 'Fácil' : diff === 'normal' ? 'Normal' : 'Difícil'}
                </Button>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600 space-y-1">
              <p>Tempo de jogo: {formatTime(gameData.playtime)}</p>
              <p>Pontuação: {gameData.score}</p>
              <p>Nível: {gameData.characters[currentCharacter].level}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (confirm('Tem certeza que deseja reiniciar o jogo?')) {
                setGameData({
                  characters: { ...characters },
                  pets: { ...pets },
                  inventory: [],
                  areas: { ...gameAreas },
                  score: 0,
                  playtime: 0,
                  achievements: [],
                  settings: gameData.settings
                })
                setCurrentCharacter('sarah')
                setCurrentArea('home')
                setGameState('menu')
              }
            }}
            variant="destructive"
            className="w-full"
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Reiniciar Jogo
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // Renderização principal
  return (
    <div className="font-sans">
      {gameState === 'menu' && <MainMenu />}
      {gameState === 'playing' && (
        <>
          <GameInterface />
          <TouchControls 
            onAction={handleTouchAction}
            gameState={gameState}
            inCombat={inCombat}
          />
        </>
      )}
      {gameState === 'inventory' && <InventoryScreen />}
      {gameState === 'areas' && <AreasScreen />}
      {gameState === 'settings' && <SettingsScreen />}
      {gameState === 'paused' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card>
            <CardHeader>
              <CardTitle>Jogo Pausado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setGameState('playing')} className="w-full">
                <Play className="mr-2" /> Continuar
              </Button>
              <Button onClick={() => setGameState('settings')} variant="outline" className="w-full">
                <Settings className="mr-2" /> Configurações
              </Button>
              <Button onClick={() => setGameState('menu')} variant="outline" className="w-full">
                Voltar ao Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default App

