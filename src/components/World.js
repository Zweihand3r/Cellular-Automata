import { useRef, useState, useEffect, useContext } from 'react'
import { 
  initGrid, updateGrid, drawGrid, drawShaded, drawShapes, drawOnGrid, eraseOnGrid, paint, preview,
  setBrushSize, setSize, setupPreview, setFill, setRule, setGridWrap, setShadeSeq
} from './grid.js'

import Controls from './controls/Controls'
import { Context } from '../context/Context'

let speed = 4, drawSpeed = speed
let isBrushDown = false, isAgeShades = false, isShapeShades = false

const World = (props) => {
  const [fps, setFps] = useState(0)
  const [showFps, setShowFps] = useState(false)
  const canvasRef = useRef(null)
  
  const { setDimensions } = useContext(Context)

  const sizeChanged = size => {
    const { gridW, gridH } = setSize(size)
    setDimensions(gridW, gridH)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const startTime = Date.now()
    let findex, animationFrameId, fLogIndex, fLogTime

    const init = () => {
      findex = 0
      fLogIndex = 0
      fLogTime = startTime

      canvas.setAttribute('width', window.innerWidth)
      canvas.setAttribute('height', window.innerHeight)
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

    init()
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className='world'>
      <canvas ref={canvasRef} {...props} />
      {showFps ? <div className='fpsCounter'>{fps}</div> : <div />}

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
        onRuleSelect={setRule}
        onWrapChanged={setGridWrap}
        onShadesSelect={shadesSelected}

        onSizeChanged={sizeChanged}
        onSpeedChanged={speedChanged}
        onBrushChanged={setBrushSize}
      />
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
  isAgeShades = shades.length > 1
  setShadeSeq({ shades, isLoop })
  reconfigureDraw()
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


/* --- EXT FUNCTIONS --- */

const initExt = () => {
  initGrid()
}

/* - UPDATE - */

const _update = (findex) => {
  if (findex % speed === 0) {
    /* All updates go here */

    updateGrid(findex)
  }
}

let update = _update

const reconfigureDraw = () => {
  if (isShapeShades) _draw = drawShapes
  else if (isAgeShades) _draw = drawShaded
  else _draw = drawGrid

  draw = isBrushDown || drawSpeed === 1 ? _draw : _fdraw
}

/* - DRAW - */
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
