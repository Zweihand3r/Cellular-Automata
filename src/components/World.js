import Controls from './controls/Controls'
import MouseReceiver from './receivers/MouseReceiver'

import { useRef, useEffect } from 'react'
import { initGrid, updateGrid, drawGrid, drawOnGrid, eraseOnGrid } from './grid.js'

import './world.css'

const speed = 4

const World = (props) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const startTime = Date.now()
    let findex, animationFrameId, fps

    const init = () => {
      findex = 0

      canvas.setAttribute('width', window.innerWidth)
      canvas.setAttribute('height', window.innerHeight)
    }

    const render = () => {
      findex += 1

      update(findex)
      draw(context)

      fps = findex / (Date.now() - startTime) * 1000
      animationFrameId = window.requestAnimationFrame(render)
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
      />
    </div>
  )
}

/* --- CONTROLS --- */

const isPlayingChanged = (isPlaying) => {
  update = isPlaying ? _update : () => {}
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

let update = _update

const draw = (ctx) => {
  drawGrid(ctx)
}


initExt()

export default World
