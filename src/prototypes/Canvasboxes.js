import { useRef, useEffect } from 'react'
import './prototypes.css'

let RENDER = 0
const RUN_ONCE = 0

const gw = 100
const gh = 100

const size = 10
const stepSize = .05

const grid = []
let pop = []

window.updateCellAt = (x, y, v) => {
  pop[y][x] = v
}

window.randomisePop = () => {
  for (let yi in grid) {
    for (let xi in grid[yi]) {
      pop[yi][xi] = Math.random() > .5 ? 1 : 0
    } 
  }
}

const aliveAt = (x, y) => {
  if (x > -1 && y > -1 && x < gw && y < gh) {
    return pop[y][x]
  } else return 0
}

window.aliveAt = aliveAt

window.getLiveNeighbours = (x, y) => {
  const neighbours = [
    aliveAt(x - 1, y), aliveAt(x - 1, y - 1), aliveAt(x, y - 1), aliveAt(x + 1, y - 1),
    aliveAt(x + 1, y), aliveAt(x + 1, y + 1), aliveAt(x, y + 1), aliveAt(x - 1, y + 1)
  ]
  
  return neighbours.reduce((i, c) => i + c)
}

window.updateNeighbour = (x, y, d, v) => {
  switch (d) {
    case 'l':   pop[  y  ][x - 1] = v; break
    case 'lt':  pop[y - 1][x - 1] = v; break
    case 't':   pop[y - 1][  x  ] = v; break
    case 'tr':  pop[y - 1][x + 1] = v; break
    case 'r':   pop[  y  ][x + 1] = v; break
    case 'rb':  pop[y + 1][x + 1] = v; break
    case 'b':   pop[y + 1][  x  ] = v; break
    case 'bl':  pop[y + 1][x - 1] = v; break
  }
}

const Canvasboxes = (props) => {

  const canvasRef = useRef(null)

  const update = (timeElasped, frameCount) => {
    for (let yi in grid) {
      for (let xi in grid[yi]) {
        let g = grid[yi][xi]
        const p = pop[yi][xi]

        if (g < p) {
          g = Math.min(g + stepSize, 1)
        } else if (g > p) {
          g = Math.max(g - stepSize, 0)
        }

        grid[yi][xi] = g
      } 
    }

    if (frameCount % 20 === 0) {
      // fillPop(() => Math.random() > .5 ? 1 : 0)
      const _pop = []
      for (let yi = 0; yi < pop.length; yi++) {
        const row = []
        for (let xi = 0; xi < pop[yi].length; xi++) {
          try {
            const aliveNeighbours = getLiveNeighbours(xi, yi)

            if (pop[yi][xi]) {
              row.push(aliveNeighbours < 2 || aliveNeighbours > 3 ? 0 : 1)
            } else {
              row.push(aliveNeighbours === 3 ? 1 : 0)
            }
          } catch (e) {
            throw(`${typeof xi}, ${typeof yi}: ${e}`)
          }
        }

        _pop.push(row)
      }

      pop = _pop
    }
  }

  const draw = (ctx, frameCount) => {
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.font = "30px Arial";

    for (let yi in grid) {
      const row = grid[yi]
      for (let xi in row) {
        const g = row[xi]
        const sz = g * size
        const sc_mod = (size - sz) / 2

        ctx.fillStyle = `rgb(${g * 255}, ${g * 255}, ${g * 255})`
        // ctx.fillStyle = `white`
        ctx.fillRect(xi * size + sc_mod, yi * size + sc_mod, sz, sz)

        // ctx.fillStyle = 'red'
        // ctx.fillText(`${xi}, ${yi}`, xi * size + 20, yi * size + 30)
      }
    }
  }

  const fillPop = (fillRule) => {
    for (let yi in pop) {
      for (let xi in pop[yi]) {
        pop[yi][xi] = fillRule(xi, yi)
      } 
    }
  }

  const aliveAt = (x, y) => {
    try {
      if (x > -1 && y > -1 && x < gw && y < gh) {
        return pop[y][x]
      } else return 0
    } catch {
      throw(`Invalid coords? ${x}, ${y} :: ${typeof x}, ${typeof y}`)
    }
  }

  const getLiveNeighbours = (x, y) => {
    const neighbours = [
      aliveAt(x - 1, y), aliveAt(x - 1, y - 1), aliveAt(x, y - 1), aliveAt(x + 1, y - 1),
      aliveAt(x + 1, y), aliveAt(x + 1, y + 1), aliveAt(x, y + 1), aliveAt(x - 1, y + 1)
    ]
    
    return neighbours.reduce((i, c) => i + c)
  }

  const draw_medium = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20 * Math.sin(frameCount * .05) ** 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const startTime = Date.now()

    let timeElasped = 0

    let frameCount = 0
    let animationFrameId

    const init = () => {
      for (let y = 0; y < gh; y++) {
        const rowG = []
        const rowP = []
        for (let x = 0; x < gw; x++) {
          const rando = Math.random() > .5 ? 1 : 0
          rowG.push(rando)
          rowP.push(rando)
        }
        grid.push(rowG)
        pop.push(rowP)
      }

      canvas.setAttribute('width', window.innerWidth)
      canvas.setAttribute('height', window.innerHeight)
    }

    const render = () => {
      updateFrames()

      update(timeElasped, frameCount)
      draw(context, frameCount)

      animationFrameId = window.requestAnimationFrame(render)
    }

    const updateFrames = () => {
      frameCount += 1

      const now = Date.now()
      timeElasped = now - startTime
      // console.log(`frame: ${frameCount}, timeElasped: ${timeElasped}ms, FPS: ${frameCount / (timeElasped / 1000)}`)
    }

    init()
    if (RENDER) {
      render()

      if (RUN_ONCE) {
        RENDER = 0
      }
    }
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return <canvas ref={canvasRef} {...props} />
}

export default Canvasboxes
