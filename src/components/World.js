import { useRef, useState, useEffect, useContext } from 'react'
import { 
  initGrid, updateGrid, drawGrid, drawInverse, drawShaded, drawShapes, drawOnGrid, eraseOnGrid, paint, preview,
  setBrushSize, setSize, setupPreview, setFill, setRule, setGridWrap, setShadeSeq, setInverseBg, setTrails, reInitGrid
} from './grid.js'

import Controls from './controls/Controls'
import { DataContext } from '../context/DataContext'
import Resizer from './resizer/Resizer.js'
import TouchControls from './controls/TouchControls.js'
import Splash from './splash/Splash.js'

const IS_MOBILE = document.body.clientWidth <= 768

let ctx
let ctxbg, background, gradientStops
let animationFrameId, findex, initialised = false

let speed = 4, drawSpeed = speed
let isBrushDown = false, isInverseDraw = false, isAgeShades = false, isInverseImage = false, isShapeShades = false

const World = (props) => {
  const [fps, setFps] = useState(0)
  const [showFps, setShowFps] = useState(false)
  const [bgImgSrc, setBgImgSrc] = useState('')
  const [isResizing, setIsResizing] = useState(false)
  const [isSplash, setIsSplash] = useState(true)

  const canvasRef = useRef(null)
  const canvasbgRef = useRef(null)
  
  const { setDimensions } = useContext(DataContext)

  const sizeChanged = size => {
    const { gridW, gridH } = setSize(size)
    setDimensions(gridW, gridH)
  }

  const setBgImage = src => {
    if (src) {
      isInverseImage = true
      setBgImgSrc(src)
      setupImageBackground()
    }
  }

  const windowResized = (_isResizing) => {
    if (_isResizing !== isResizing) {
      setIsResizing(_isResizing)
      if (!isSplash) {
        isPlayingChanged(!_isResizing)
      }

      if (!_isResizing) {
        /* Resizing finished */
        
        updateCanvasSize()
        resizeBgRedraw()
        
        const { gridW, gridH } = reInitGrid()
        setDimensions(gridW, gridH)
      }
    }
  }

  const updateCanvasSize = () => {
    const canvas = canvasRef.current
    const canvasBg = canvasbgRef.current

    canvas.setAttribute('width', window.innerWidth)
    canvas.setAttribute('height', window.innerHeight)
    canvasBg.setAttribute('width', window.innerWidth)
    canvasBg.setAttribute('height', window.innerHeight)
  }

  const toggleFps = v => {
    setShowFps(v)
    if (!v) {
      setFps(0)
    }
  }

  const removeSplash = () => {
    setIsSplash(false)
    isPlayingChanged(true)
  }

  useEffect(() => {
    const context = canvasRef.current.getContext('2d')
    const contextBg = canvasbgRef.current.getContext('2d')

    const startTime = Date.now()
    let fLogIndex, fLogTime

    const init = () => {
      findex = 0

      ctx = context
      ctxbg = contextBg

      updateCanvasSize()
      setBackground('#000000')

      initialised = true
    }
    
    const initFps = () => {
      fLogIndex = 0
      fLogTime = startTime
    }

    const render = () => {
      findex += 1

      update(findex)
      draw(context, findex)

      logFps()
      animationFrameId = window.requestAnimationFrame(render)
    }

    const logFps = () => {
      if (showFps) {
        const now = Date.now()
        if (now - fLogTime < 1000) {
          fLogIndex += 1
        } else {
          setFps(Math.floor(fLogIndex / (now - fLogTime) * 1000))
          fLogTime = now
          fLogIndex = 0
        }
      }
    }

    if (!initialised) {
      init()
    }
    if (showFps) {
      initFps()
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [showFps])

  return (
    <div className='world'>
      <img className='bg-img' src={bgImgSrc} alt="Background" />

      <canvas ref={canvasbgRef} {...props} />
      <canvas ref={canvasRef} {...props} />

      {showFps && (
        <div className='fpsCounter'>
          {fps ? fps : 'Calculating...'}
        </div>
      )}

      {isSplash ? (
        <Splash 
          isMobile={IS_MOBILE}
          onDismiss={removeSplash}
        />
      ) : (
        IS_MOBILE ? (
          <TouchControls 
            onIsPlayingChanged={isPlayingChanged}
            onDraw={drawOnGrid}
            onErase={eraseOnGrid}
            onClear={clear}
            onBrushDownChange={brushDownChanged}
            onRuleSelect={setRule}
            onShadesSelect={shadesSelected}
            onFillSelect={setFill}
  
            onShowFpsChange={toggleFps}
            onWrapChange={setGridWrap}
          />
        ) : (
          <Controls
            onIsPlayingChanged={isPlayingChanged} 
            onBrushDownChanged={brushDownChanged}
            onDraw={drawOnGrid}
            onErase={eraseOnGrid}
            onPaint={paint}
            onPreview={preview}
  
            onPreviewStart={startPreview}
            onPreviewEnd={endPreview}
            onFillSelect={setFill}
            onClear={clear}
            onRuleSelect={setRule}
            onWrapChanged={setGridWrap}
            onBgSelect={setBackground}
            onShadesSelect={shadesSelected}
            onGradSelect={setGradient}
            onImageSelect={setBgImage}
            onTrailsChanged={setTrails}
  
            onSizeChanged={sizeChanged}
            onSpeedChanged={speedChanged}
            onBrushChanged={setBrushSize}
          />
        )
      )}

      <Resizer isResizing={isResizing} onResizing={windowResized} />
    </div>
  )
}

/* --- CONTROLS --- */

const isPlayingChanged = (isPlaying) => {
  update = isPlaying ? _update : () => {}
}

const brushDownChanged = (_isBrushDown) => {
  isBrushDown = _isBrushDown
  reconfigureDraw()
}

const shadesSelected = ({ shades, isLoop }) => {
  if (isInverseDraw) {
    isInverseDraw = false
    updateBackground()
  }

  isAgeShades = shades.length > 1
  setShadeSeq({ shades, isLoop })
  reconfigureDraw()
  triggerDraw()
}

const speedChanged = (spd) => {
  speed = 101 - spd
  drawSpeed = speed
  reconfigureDraw()
}

const startPreview = shape => {
  setupPreview(shape)
  previewConfig({ isStart: true })
}

const endPreview = () => {
  previewConfig({ isStart: false })
}

const previewConfig = ({ isStart }) => {
  isBrushDown = isStart
  isShapeShades = isStart
  reconfigureDraw()
}

const clear = () => {
  /* Will clear both canvas and grid */
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  setFill('clear')
}

/* --- BACKGROUND LAYER --- */

const setBackground = bg => {
  background = bg
  setInverseBg(bg)
  
  if (!isInverseDraw) {
    updateBackground()
  }
}

const setGradient = stops => {
  isInverseImage = false
  gradientStops = stops
  initInverseDraw()
  applyGradient()
}

const setupImageBackground = () => {
  initInverseDraw()
  ctxbg.clearRect(0, 0, ctxbg.canvas.width, ctxbg.canvas.height)
}

const updateBackground = () => {
  ctxbg.fillStyle = background
  ctxbg.fillRect(0, 0, ctxbg.canvas.width, ctxbg.canvas.height)
}

const applyGradient = () => {
  const grad = ctxbg.createLinearGradient(0, 0, ctxbg.canvas.width, 0)
  grad.addColorStop(0, gradientStops[0])
  grad.addColorStop(1, gradientStops[1])

  ctxbg.fillStyle = grad
  ctxbg.fillRect(0, 0, ctxbg.canvas.width, ctxbg.canvas.height)
}

const initInverseDraw = () => {
  if (!isInverseDraw) {
    isInverseDraw = true
    isAgeShades = false
    reconfigureDraw()
    triggerDraw()
  }
}

const resizeBgRedraw = () => {
  if (isInverseDraw) {
    if (isInverseImage) {
      setupImageBackground()
    } else applyGradient()
  } else {
    updateBackground()
  }
}


/* --- EXT FUNCTIONS --- */

const initExt = () => {
  initGrid()
}

const triggerDraw = () => draw(ctx, drawSpeed)

/* - UPDATE - */

let update = () => {}

const _update = (findex) => {
  if (findex % speed === 0) {
    /* All updates go here */

    updateGrid(findex)
  }
}

/* - DRAW - */

const reconfigureDraw = () => {
  if (isShapeShades) _draw = drawShapes
  else if (isInverseDraw) _draw = drawInverse
  else if (isAgeShades) _draw = drawShaded
  else _draw = drawGrid

  draw = isBrushDown || drawSpeed === 1 ? _draw : _fdraw
}

/*
 * Changed draw implemention to only use draw-on-each-render (not fast) for:
 * 1. When in brush mode and mouse is held down
 * 2. When previewing a shape for placement
 * 3. When previewing the filler modifiers
 */

let _draw = drawGrid

const _fdraw = (ctx, findex) => {
  if (findex % drawSpeed === 0) {
    _draw(ctx)
  }
}

let draw = _fdraw

initExt()

export default World
