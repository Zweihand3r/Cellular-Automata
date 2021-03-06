import { useState, useEffect } from 'react'

import QuickAccess from '../quick-access/QuickAccess'
import MouseReceiver from '../receivers/MouseReceiver'

import './controls.css'

let qaEnabled = true, isTempPause = false
let hideTimeoutIndex, mouseMoveIndex

const Controls = ({ 
  onIsPlayingChanged, onBrushDownChanged, onDraw, onErase, onPaint, onPreview,
  onPreviewStart, onPreviewEnd, onFillSelect, onRuleSelect, onWrapChanged, onShadesSelect,
  onBrushChanged, onSizeChanged, onSpeedChanged
}) => {
  const [qaState, setQaState] = useState({
    prev: 'out', next: 'in', hide: false, exp: false, slide: false, min: false
  })

  const [isPlaying, setIsPlaying] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isPainting, setIsPainting] = useState(false)

  const updateQaHidden = (qaHidden) => {
    const inState = qaState.min ? 'min' : 'in'
    if (qaHidden) {
      setQaState({ ...qaState, prev: inState, next: 'out', hide: true })
    } else {
      setQaState({ ...qaState, prev: 'out', next: inState, hide: false })
    }
  }

  const updateQaExpanded = (qaExpanded) => {
    if (qaExpanded) {
      setQaState({ ...qaState, prev: 'in', next: 'ex', exp: true })
    } else {
      setQaState({ ...qaState, prev: 'ex', next: 'in', exp: false })
    }
  }

  const updateQaSlider = (qaSlider) => {
    if (qaSlider) {
      if (qaState.exp) {
        setQaState({ ...qaState, prev: 'ex', next: 'sl', exp: false, slide: true })
      } else {
        setQaState({ ...qaState, prev: 'in', next: 'sl', slide: true })
      }
    } else {
      setQaState({ ...qaState, prev: 'sl', next: 'in', slide: false })
    }
  }

  const updateQaMinimised = (qaMinimised) => {
    if (qaMinimised) {
      const inState = qaState.exp ? 'ex' : 'in'
      setQaState({ ...qaState, prev: inState, next: 'min', min: true, exp: false })
    } else {
      setQaState({ ...qaState, prev: 'min', next: 'in', min: false })
      endPreviewIfIsPainting()
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
    if (!(qaState.exp || qaState.slide)) {
      if (qaState.hide) {
        if (qaEnabled) {
          updateQaHidden(false)
          hideTimeoutIndex = setTimeout(() => updateQaHidden(true), 5000)
        }
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
    else if (!(qaState.exp || qaState.slide)) {
      if (qaEnabled) {
        hideTimeoutIndex = setTimeout(() => updateQaHidden(true), 5000)
      }
    }
  }

  const hideQa = () => {
    updateQaHidden(true)
    qaEnabled = false
    setTimeout(() => qaEnabled = true, 1000)
  }

  /* Hooking brushDownChanged to trigger draw-on-every-update when sliding filler modifiers */
  const tempPause = (pause) => {
    if (isPlaying) {
      updateIsPlaying()
      onBrushDownChanged(true)
      isTempPause = true 
    } else {
      if (isTempPause) {
        updateIsPlaying()
        onBrushDownChanged(false)
        isTempPause = false
      }
    }
  }

  const shapeSelected = shape => {
    setIsPainting(true)
    updateQaMinimised(true)
    onPreviewStart(shape)
  }

  const endPreviewIfIsPainting = () => {
    if (isPainting) {
      setIsPainting(false)
      onPreviewEnd()
    }
  }

  useEffect(() => {
    mouseMoveIndex = 0
  }, [])

  const { prev, next, hide, exp, slide, min } = qaState

  return (
    <div className='controls-base'>
      <MouseReceiver 
        isDrawing={isDrawing} 
        isPainting={isPainting}
        onBrushDown={() => onBrushDownChanged(true)}
        onBrushUp={() => onBrushDownChanged(false)}
        onDraw={onDraw}
        onErase={onErase}
        onPaint={onPaint}
        onPreview={onPreview}
        onMouseMove={mouseMove}
      />

      <QuickAccess
        animId={`${prev}2${next}`}
        qaHidden={hide}
        qaExpanded={exp}
        qaMinimised={min}
        qaSlider={slide}
        isPlaying={isPlaying}
        isDrawing={isDrawing}
        onQaHoverChanged={qaHoverChanged}
        onQaExpanded={updateQaExpanded}
        onQaMinimised={updateQaMinimised}
        onQaSlider={updateQaSlider}
        onPlayClicked={updateIsPlaying} 
        onDrawClicked={updateIsDrawing}
        onQaClose={hideQa}
        onTempPause={tempPause}
        onShapeSelect={shapeSelected}
        onFillSelect={onFillSelect}
        onRuleSelect={onRuleSelect}
        onWrapChanged={onWrapChanged}
        onShadesSelect={onShadesSelect}
        onBrushChanged={onBrushChanged}
        onSizeChanged={onSizeChanged}
        onSpeedChanged={onSpeedChanged}
      />
    </div>
  )
}

export default Controls