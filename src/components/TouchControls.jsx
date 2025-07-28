import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'

const TouchControls = ({ onAction, gameState, inCombat }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [joystickActive, setJoystickActive] = useState(false)
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Detectar se é dispositivo móvel
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(isMobileDevice || isTouchDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handlers para joystick virtual
  const handleJoystickStart = (e) => {
    e.preventDefault()
    setJoystickActive(true)
    const touch = e.touches ? e.touches[0] : e
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    setJoystickPosition({
      x: touch.clientX - centerX,
      y: touch.clientY - centerY
    })
  }

  const handleJoystickMove = (e) => {
    if (!joystickActive) return
    e.preventDefault()
    
    const touch = e.touches ? e.touches[0] : e
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = touch.clientX - centerX
    const deltaY = touch.clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const maxDistance = 40
    
    if (distance <= maxDistance) {
      setJoystickPosition({ x: deltaX, y: deltaY })
    } else {
      const angle = Math.atan2(deltaY, deltaX)
      setJoystickPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance
      })
    }
    
    // Emitir evento de movimento
    if (onAction) {
      const normalizedX = joystickPosition.x / maxDistance
      const normalizedY = joystickPosition.y / maxDistance
      onAction('move', { x: normalizedX, y: normalizedY })
    }
  }

  const handleJoystickEnd = (e) => {
    e.preventDefault()
    setJoystickActive(false)
    setJoystickPosition({ x: 0, y: 0 })
    if (onAction) {
      onAction('move', { x: 0, y: 0 })
    }
  }

  if (!isMobile) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Joystick Virtual */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div
          className="relative w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center"
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onMouseDown={handleJoystickStart}
          onMouseMove={handleJoystickMove}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
        >
          <div
            className="w-8 h-8 bg-white/80 rounded-full transition-transform duration-100"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs font-medium">
            🕹️
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <div className="flex flex-col space-y-2">
          {inCombat ? (
            // Botões de combate
            <>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border-2 border-white/50"
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onAction && onAction('attack')}
              >
                ⚔️
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-purple-500/80 hover:bg-purple-600/80 backdrop-blur-sm border-2 border-white/50"
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onAction && onAction('special1')}
              >
                🎨
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border-2 border-white/50"
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onAction && onAction('special2')}
              >
                🐾
              </Button>
            </>
          ) : (
            // Botões de exploração
            <>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border-2 border-white/50"
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onAction && onAction('interact')}
              >
                🔍
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm border-2 border-white/50"
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onAction && onAction('jump')}
              >
                ⬆️
              </Button>
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-yellow-500/80 hover:bg-yellow-600/80 backdrop-blur-sm border-2 border-white/50"
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onAction && onAction('run')}
              >
                💨
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Botões de Pet (canto superior direito) */}
      <div className="absolute top-20 right-4 pointer-events-auto">
        <div className="flex space-x-2">
          <Button
            size="sm"
            className="w-12 h-12 rounded-full bg-orange-500/80 hover:bg-orange-600/80 backdrop-blur-sm border-2 border-white/50"
            onTouchStart={(e) => e.preventDefault()}
            onClick={() => onAction && onAction('pet1')}
          >
            🐕
          </Button>
          <Button
            size="sm"
            className="w-12 h-12 rounded-full bg-brown-500/80 hover:bg-brown-600/80 backdrop-blur-sm border-2 border-white/50"
            onTouchStart={(e) => e.preventDefault()}
            onClick={() => onAction && onAction('pet2')}
          >
            🐕‍🦺
          </Button>
          <Button
            size="sm"
            className="w-12 h-12 rounded-full bg-gray-500/80 hover:bg-gray-600/80 backdrop-blur-sm border-2 border-white/50"
            onTouchStart={(e) => e.preventDefault()}
            onClick={() => onAction && onAction('pet3')}
          >
            🐱
          </Button>
        </div>
      </div>

      {/* Botão de Menu (canto superior esquerdo) */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <Button
          size="sm"
          className="w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-900/80 backdrop-blur-sm border-2 border-white/50"
          onTouchStart={(e) => e.preventDefault()}
          onClick={() => onAction && onAction('menu')}
        >
          ☰
        </Button>
      </div>

      {/* Indicador de toque */}
      {joystickActive && (
        <div className="absolute bottom-28 left-4 pointer-events-none">
          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
            Movimento: {Math.round(joystickPosition.x)}, {Math.round(joystickPosition.y)}
          </div>
        </div>
      )}
    </div>
  )
}

export default TouchControls

