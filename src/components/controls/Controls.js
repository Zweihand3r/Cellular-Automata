import { useState, useEffect } from 'react'

import QuickAccess from '../quick-access/QuickAccess'
import MouseReceiver from '../receivers/MouseReceiver'

import './controls.css'

let hideTimeoutIndex, mouseMoveIndex

const Controls = ({ onIsPlayingChanged, onDraw, onErase }) => {
  const [qaHidden, setQaHidden] = useState(false)
  const [qaMinimised, setQaMinimised] = useState(false)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)

  const updateToggleState = (value, setter, event) => {
    setter(value)
    event(value)
  }

  const updateIsPlaying = () => updateToggleState(!isPlaying, setIsPlaying, onIsPlayingChanged)
  const updateIsDrawing = () => updateToggleState(!isDrawing, setIsDrawing, () => {})

  const mouseMove = () => {
    /* Maybe do it a different way. This just seems like cheating */
    if (qaHidden) {
      setQaHidden(false)
      hideTimeoutIndex = setTimeout(() => setQaHidden(true), 5000)
    } else {
      if (mouseMoveIndex % 20 === 0) {
        clearTimeout(hideTimeoutIndex)
        hideTimeoutIndex = setTimeout(() => setQaHidden(true), 5000)
      }
      mouseMoveIndex += 1
    }
  }

  const qaHoverChanged = (hovered) => {
    if (hovered) clearTimeout(hideTimeoutIndex)
    else hideTimeoutIndex = setTimeout(() => setQaHidden(true), 5000)
  }

  useEffect(() => {
    mouseMoveIndex = 0
  }, [])

  return (
    <div className='controls-base'>
      <MouseReceiver 
        isDrawing={isDrawing} 
        onDraw={onDraw}
        onErase={onErase}
        onMouseMove={mouseMove}
      />

      <QuickAccess
        qaHidden={qaHidden}
        isPlaying={isPlaying}
        isDrawing={isDrawing}
        onQaHoverChanged={qaHoverChanged}
        onPlayClicked={updateIsPlaying} 
        onDrawClicked={updateIsDrawing}
      />
    </div>
  )
}

export default Controls