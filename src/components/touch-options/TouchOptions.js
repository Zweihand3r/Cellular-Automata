import React, { useState, useEffect } from 'react'
import { TouchSwitch, TouchButton } from './touch-option-controls'

import './touch-options.css'

const TouchOptions = ({ 
  isOptions, altRender, 
  onShowFpsChange, onWrapChange, onAltRenderChange, onClose 
}) => {
  const [show, setShow] = useState(false)
  const [outPhase, setOutPhase] = useState(false)

  const [showFps, setShowFps] = useState(false)
  const [wrapGrid, setWrapGrid] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const animEnded = e => {
    if (e.animationName === 'slide-out-anim') {
      setShow(false)
      setOutPhase(false)
    }
  }

  const toggleFps = checked => {
    setShowFps(checked)
    onShowFpsChange(checked)
  }

  const toggleGridWrap = checked => {
    setWrapGrid(checked)
    onWrapChange(checked)
  }

  const fullscreen = () => {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const fullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false)
      }
    }  

    document.addEventListener('fullscreenchange', fullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (isOptions) {
      setShow(true)
    } else if (show) {
      setOutPhase(true)
    }
  }, [isOptions])

  if (!show) {
    return null
  }

  return (
    <div className='touch-options-root'>
      <div 
        className={`to-con ${outPhase && 'slide-out'}`}
        onAnimationEnd={animEnded}
      >
        <div className='to-title'>
          OPTIONS
        </div>
        <div className='to-items'>
          <TouchSwitch 
            name='Show FPS' 
            checked={showFps} 
            inDelay={80} 
            onCheckChange={toggleFps} 
          />

          <TouchSwitch 
            name='Wrap Grid' 
            checked={wrapGrid} 
            inDelay={120} 
            onCheckChange={toggleGridWrap} 
          />

          <TouchSwitch
            name='Faster Rendering'
            checked={altRender}
            inDelay={160}
            onCheckChange={onAltRenderChange}
          />

          <TouchButton 
            name={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} 
            inDelay={200} 
            onClick={fullscreen} 
          />

          <TouchButton 
            name='Close OPTIONS' 
            extraMargin={true} 
            inDelay={240} 
            onClick={onClose} 
          />
        </div>
      </div>
    </div>
  )
}

export default TouchOptions