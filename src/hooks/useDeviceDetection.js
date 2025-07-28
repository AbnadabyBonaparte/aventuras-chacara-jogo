import { useState, useEffect } from 'react'

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: false,
    screenSize: 'desktop',
    orientation: 'landscape',
    pixelRatio: 1,
    connectionType: 'unknown'
  })

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
      const isDesktop = !isMobile && !isTablet
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Detectar tamanho da tela
      const width = window.innerWidth
      let screenSize = 'desktop'
      if (width < 640) screenSize = 'mobile'
      else if (width < 1024) screenSize = 'tablet'
      
      // Detectar orientação
      const orientation = width > window.innerHeight ? 'landscape' : 'portrait'
      
      // Detectar pixel ratio
      const pixelRatio = window.devicePixelRatio || 1
      
      // Detectar tipo de conexão (se disponível)
      let connectionType = 'unknown'
      if (navigator.connection) {
        connectionType = navigator.connection.effectiveType || 'unknown'
      }

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        screenSize,
        orientation,
        pixelRatio,
        connectionType
      })
    }

    detectDevice()
    
    // Listeners para mudanças
    window.addEventListener('resize', detectDevice)
    window.addEventListener('orientationchange', detectDevice)
    
    // Listener para mudanças de conexão
    if (navigator.connection) {
      navigator.connection.addEventListener('change', detectDevice)
    }

    return () => {
      window.removeEventListener('resize', detectDevice)
      window.removeEventListener('orientationchange', detectDevice)
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', detectDevice)
      }
    }
  }, [])

  return deviceInfo
}

export const usePerformanceOptimization = (deviceInfo) => {
  const [performanceSettings, setPerformanceSettings] = useState({
    enableAnimations: true,
    enableParticles: true,
    enableShadows: true,
    enableBlur: true,
    maxFPS: 60,
    renderQuality: 'high'
  })

  useEffect(() => {
    const optimizeForDevice = () => {
      let settings = {
        enableAnimations: true,
        enableParticles: true,
        enableShadows: true,
        enableBlur: true,
        maxFPS: 60,
        renderQuality: 'high'
      }

      // Otimizações para mobile
      if (deviceInfo.isMobile) {
        settings = {
          ...settings,
          enableParticles: false,
          enableShadows: false,
          enableBlur: deviceInfo.pixelRatio <= 2,
          maxFPS: 30,
          renderQuality: 'medium'
        }
      }

      // Otimizações para conexão lenta
      if (deviceInfo.connectionType === 'slow-2g' || deviceInfo.connectionType === '2g') {
        settings = {
          ...settings,
          enableAnimations: false,
          enableParticles: false,
          enableShadows: false,
          enableBlur: false,
          maxFPS: 15,
          renderQuality: 'low'
        }
      }

      // Otimizações para dispositivos com baixo pixel ratio
      if (deviceInfo.pixelRatio < 1.5) {
        settings = {
          ...settings,
          renderQuality: 'medium'
        }
      }

      setPerformanceSettings(settings)
    }

    optimizeForDevice()
  }, [deviceInfo])

  return performanceSettings
}

export const useResponsiveLayout = () => {
  const [layout, setLayout] = useState({
    columns: 1,
    spacing: 'normal',
    fontSize: 'base',
    buttonSize: 'default',
    cardPadding: 'normal'
  })

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth
      
      let newLayout = {
        columns: 1,
        spacing: 'tight',
        fontSize: 'sm',
        buttonSize: 'sm',
        cardPadding: 'compact'
      }

      if (width >= 640) { // sm
        newLayout = {
          columns: 2,
          spacing: 'normal',
          fontSize: 'base',
          buttonSize: 'default',
          cardPadding: 'normal'
        }
      }

      if (width >= 1024) { // lg
        newLayout = {
          columns: 3,
          spacing: 'relaxed',
          fontSize: 'lg',
          buttonSize: 'lg',
          cardPadding: 'generous'
        }
      }

      setLayout(newLayout)
    }

    updateLayout()
    window.addEventListener('resize', updateLayout)
    
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  return layout
}

export const useBatteryOptimization = () => {
  const [batteryInfo, setBatteryInfo] = useState({
    level: 1,
    charging: true,
    lowBattery: false
  })

  useEffect(() => {
    const updateBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery()
          
          const updateBattery = () => {
            setBatteryInfo({
              level: battery.level,
              charging: battery.charging,
              lowBattery: battery.level < 0.2 && !battery.charging
            })
          }

          updateBattery()
          
          battery.addEventListener('levelchange', updateBattery)
          battery.addEventListener('chargingchange', updateBattery)
          
          return () => {
            battery.removeEventListener('levelchange', updateBattery)
            battery.removeEventListener('chargingchange', updateBattery)
          }
        } catch (error) {
          console.log('Battery API not supported')
        }
      }
    }

    updateBatteryInfo()
  }, [])

  return batteryInfo
}

