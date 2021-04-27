import { useState, useEffect } from 'react'

import QuickAccess from '../quick-access/QuickAccess'
import MouseReceiver from '../receivers/MouseReceiver'

import './controls.css'

let hideTimeoutIndex, mouseMoveIndex

const Controls = ({ 
  onIsPlayingChanged, onDraw, onErase,
  onShapeSelect, onRuleSelect, onShadesSelect
}) => {
  const [qaState, setQaState] = useState({
    prev: 'out', next: 'in', hide: false, exp: false
  })

  const [isPlaying, setIsPlaying] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)

  const updateQaHidden = (qaHidden) => {
    if (qaHidden) {
      setQaState({ ...qaState, prev: 'in', next: 'out', hide: true })
    } else {
      setQaState({ ...qaState, prev: 'out', next: 'in', hide: false })
    }
  }

  const updateQaExpanded = (qaExpanded) => {
    if (qaExpanded) {
      setQaState({ ...qaState, prev: 'in', next: 'ex', exp: true })
    } else {
      setQaState({ ...qaState, prev: 'ex', next: 'in', exp: false })
    }
  }

  const updateToggleState = (value, setter, event) => {
    setter(value)
    event(value)
  }

  const updateIsPlaying = () => updateToggleState(!isPlaying, setIsPlaying, onIsPlayingChanged)
  const updateIsDrawing = () => updateToggleState(!isDrawing, setIsDrawing, () => {})

  const mouseMove = () => {
    /* Maybe do it a different way. This just seems like cheating */
    if (!qaState.exp) {
      if (qaState.hide) {
        updateQaHidden(false)
        hideTimeoutIndex = setTimeout(() => updateQaHidden(true), 5000)
      } else {
        if (mouseMoveIndex % 20 === 0) {
          clearTimeout(hideTimeoutIndex)
          hideTimeoutIndex = setTimeout(() => updateQaHidden(true), 5000)
        }
        mouseMoveIndex += 1
      }
    }
  }

  const qaHoverChanged = (hovered) => {
    if (hovered) clearTimeout(hideTimeoutIndex)
    else if (!qaState.exp) {
      hideTimeoutIndex = setTimeout(() => updateQaHidden(true), 5000)
    }
  }

  useEffect(() => {
    mouseMoveIndex = 0
  }, [])
  
  /* qaState Log. TBR */
  console.log(qaState)

  const { prev, next, hide, exp } = qaState

  return (
    <div className='controls-base'>
      <MouseReceiver 
        isDrawing={isDrawing} 
        onDraw={onDraw}
        onErase={onErase}
        onMouseMove={mouseMove}
      />

      <QuickAccess
        animId={`${prev}2${next}`}
        qaHidden={hide}
        qaExpanded={exp}
        isPlaying={isPlaying}
        isDrawing={isDrawing}
        onQaHoverChanged={qaHoverChanged}
        onQaExpanded={updateQaExpanded}
        onPlayClicked={updateIsPlaying} 
        onDrawClicked={updateIsDrawing}
        onShapeSelect={onShapeSelect}
        onRuleSelect={onRuleSelect}
        onShadesSelect={onShadesSelect}
      />
    </div>
  )
}

export default Controls