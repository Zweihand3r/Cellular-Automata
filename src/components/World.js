import { useRef, useState, useEffect, useContext } from 'react'
import { 
  initGrid, updateGrid, drawGrid, drawShaded, drawOnGrid, eraseOnGrid,
  setBrushSize, setSize, setFill, setRule, setShadeSeq
} from './grid.js'

import Controls from './controls/Controls'
import { Context } from '../context/Context'

let speed = 4
const drawSpeed = speed

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
        onDraw={drawOnGrid}
        onErase={eraseOnGrid}

        onShapeSelect={() => {}}
        onFillSelect={setFill}
        onRuleSelect={setRule}
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

const shadesSelected = ({ shades, isLoop }) => {
  draw = shades.length > 1 ? fastDraw : drawGrid
  setShadeSeq({ shades, isLoop })
}

const speedChanged = (spd) => speed = 101 - spd
/*const sizeChanged = (size) => setSize(size)*/


/* --- EXT FUNCTIONS --- */

const initExt = () => {
  initGrid()
}

const _update = (findex) => {
  if (findex % speed === 0) {
    /* All updates go here */

    updateGrid(findex)
  }
}

const fastDraw = (ctx, findex) => {
  if (findex % drawSpeed === 0) {
    drawShaded(ctx)
  }
}

let update = _update
let draw = drawGrid

initExt()

export default World
