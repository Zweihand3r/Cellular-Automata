import { useRef, useEffect } from 'react'
import { 
  initGrid, updateGrid, drawGrid, drawShaded, drawOnGrid, eraseOnGrid,
  setShape, setRule, setShadeSeq
} from './grid.js'

import Controls from './controls/Controls'

import './world.css'

const speed = 4
const drawSpeed = speed

const World = (props) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const startTime = Date.now()
    let findex, animationFrameId, fps, fpsAvg, fLogIndex, fLogTime

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

      // logFps()
      animationFrameId = window.requestAnimationFrame(render)
    }

    const logFps = () => {
      const now = Date.now()
      fpsAvg = findex / (now - startTime) * 1000

      if (now - fLogTime < 1000) fLogIndex += 1
      else {
        fps = fLogIndex / (now - fLogTime) * 1000
        console.log(`FPS: ${fps} | FPS Avg: ${fpsAvg}`)

        fLogTime = now
        fLogIndex = 0
      }
    }

    init()
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <div className='world'>
      <canvas ref={canvasRef} {...props} onClick={() => console.log('canvas clicked')} />

      <Controls
        onIsPlayingChanged={isPlayingChanged} 
        onDraw={drawOnGrid}
        onErase={eraseOnGrid}

        onShapeSelect={setShape}
        onRuleSelect={setRule}
        onShadesSelect={shadesSelected}
      />
    </div>
  )
}

/* --- CONTROLS --- */

const isPlayingChanged = (isPlaying) => {
  update = isPlaying ? _update : () => {}
}

const shadesSelected = (shades) => {
  draw = shades.length > 1 ? fastDraw : drawGrid
  setShadeSeq(shades)
}


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
