import { useState, useEffect, useCallback } from 'react'

import QuickAccess from '../quick-access/QuickAccess'
import MouseReceiver from '../receivers/MouseReceiver'

import './controls.css'

let qaEnabled = true, isTempPause = false
let hideTimeoutIndex, mouseMoveIndex

const Controls = ({ 
  onIsPlayingChanged, onBrushDownChanged, onDraw, onErase, onPaint, onPreview,

  onPreviewStart, onPreviewEnd, onFillSelect, onClear, onRuleSelect, onWrapChanged, 
  onBgSelect, onShadesSelect, onGradSelect, onImageSelect, onTrailsChanged,

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

  const updateQaMinimised = useCallback((qaMinimised) => {
    if (qaMinimised) {
      const inState = qaState.exp ? 'ex' : 'in'
      setQaState({ ...qaState, prev: inState, next: 'min', min: true, exp: false })
    } else {
      const outState = isPainting ? 'ex' : 'in'
      setQaState({ ...qaState, prev: 'min', next: outState, min: false, exp: isPainting })
      
      // End preview if Painting
      if (isPainting) {
        setIsPainting(false)
        onPreviewEnd()
      }
    }
  }, [isPainting, onPreviewEnd, qaState])

  const updateToggleState = (value, setter, event) => {
    setter(value)
    event(value)
  }

  const updateIsPlaying = useCallback(
    () => updateToggleState(!isPlaying, setIsPlaying, onIsPlayingChanged), 
    [isPlaying, onIsPlayingChanged]
  )

  const updateIsDrawing = () => updateToggleState(!isDrawing, setIsDrawing, () => {})

  const mouseMove = () => {
    /* 
     * Maybe do it a different way. This just seems like cheating 
     * qaState.min is always true when isPainting is true so no need to add it as a condition
     */
    if (!(qaState.exp || qaState.slide || isPainting)) {
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
    else if (!(qaState.exp || qaState.slide || isPainting)) {
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

  useEffect(() => {
    mouseMoveIndex = 0

    const escPressed = () => {
      if (qaState.min) {
        updateQaMinimised()
      } 
    }

    const keyListener = e => {
      console.log(e.keyCode)
      switch (e.keyCode) {
        case 27: escPressed(); break
        case 32: updateIsPlaying(); break
        case 67: onClear(); break
        case 70: document.body.requestFullscreen(); break
        default: break
      }
    }

    document.body.addEventListener("keydown", keyListener)

    return () => {
      document.body.removeEventListener("keydown", keyListener)
    }
  }, [onClear, qaState.min, updateIsPlaying, updateQaMinimised])

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
        animId={`${qaState.prev}2${qaState.next}`}
        qaHidden={qaState.hide}
        qaExpanded={qaState.exp}
        qaMinimised={qaState.min}
        qaSlider={qaState.slide}
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
        onClear={onClear}
        onRuleSelect={onRuleSelect}
        onWrapChanged={onWrapChanged}
        onBgSelect={onBgSelect}
        onShadesSelect={onShadesSelect}
        onGradSelect={onGradSelect}
        onImageSelect={onImageSelect}
        onTrailsChanged={onTrailsChanged}
        onBrushChanged={onBrushChanged}
        onSizeChanged={onSizeChanged}
        onSpeedChanged={onSpeedChanged}
      />
    </div>
  )
}

export default Controls