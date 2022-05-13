import { useState, useEffect, useCallback, useContext } from 'react'

import { NotificationContext } from '../../context/NotificationContext'
import { NotificationWithBody } from '../notifications/notification-templates'
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
  const { showNotification } = useContext(NotificationContext)

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

  const toggleIsPlaying = useCallback(() => {
    const _isPlaying = !isPlaying
    setIsPlaying(_isPlaying)
    onIsPlayingChanged(_isPlaying)
  }, [isPlaying, onIsPlayingChanged]);

  const toggleIsDrawing = () => {
    const _isDrawing = !isDrawing
    if (_isDrawing) {
      showNotification(
        <NotificationWithBody
          title='Brush Enabled'
          body='Press left mouse button to draw and right mouse button to erase on the grid.'
        />
      )
    } else {
      showNotification("Brush Disabled")
    }
    setIsDrawing(_isDrawing)
  }

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

  const tempPause = (pause) => {
    if (isPlaying) {
      toggleIsPlaying()
      isTempPause = true
    } else {
      if (isTempPause) {
        toggleIsPlaying()
        isTempPause = false
      }
    }
  }

  const shapeSelected = shape => {
    setIsPainting(true)
    updateQaMinimised(true)
    onPreviewStart(shape)
    showNotification(
      (<span>
        Left click to place pattern on grid. For best results clear the grid (shortcut: C)<br/>
        Click on the small circle at the bottom or press Esc to go back to pattern list
      </span>), 10
    )
  }

  useEffect(() => {
    mouseMoveIndex = 0

    const keyListener = e => {
      console.log(`keydown with code ${e.keyCode}`)
      switch (e.keyCode) {
        case 27:
          if (qaState.min) {
            updateQaMinimised()
          }
          break
        case 32: toggleIsPlaying(); break
        case 67:
          onClear()
          showNotification('Grid cleared')
          break
        case 70: document.body.requestFullscreen(); break
        case 73:
          onFillSelect('invert')
          showNotification('Grid inverted')
          break
        case 80: toggleIsDrawing(); break
        default: break
      }
    }

    document.body.addEventListener("keydown", keyListener)

    return () => {
      document.body.removeEventListener("keydown", keyListener)
    }
  }, [onClear, qaState.min, showNotification, toggleIsPlaying, toggleIsDrawing, updateQaMinimised])

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
        onPlayClicked={toggleIsPlaying}
        onDrawClicked={toggleIsDrawing}
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