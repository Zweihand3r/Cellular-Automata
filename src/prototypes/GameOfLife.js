import { useRef, useEffect } from 'react'

import './prototypes.css'

const gw = 144 * 2
const gh = 73 * 2

const cw = gw - 1
const ch = gh - 1

const size = 5

let grid = []

window.neighbourStatus = (x, y) => {
  return {
    top: top(x, y),
    topRt: topRt(x, y),
    right: right(x, y),
    botRt: botRt(x, y),
    bottom: bottom(x, y),
    botLt: botLt(x, y),
    left: left(x, y),
    topLt: topLt(x, y)
  }
}

window.aliveAt = (x, y) => {
  return grid[y][x]
}

const top = (x, y) => y > 0 ? grid[y - 1][x] : 0
const topRt = (x, y) => x < cw && y > 0 ? grid[y - 1][x + 1] : 0
const right = (x, y) => x < cw ? grid[y][x + 1] : 0
const botRt = (x, y) => x < cw && y < ch ? grid[y + 1][x + 1] : 0
const bottom = (x, y) => y < ch ? grid[y + 1][x] : 0
const botLt = (x, y) => x > 0 && y < ch ? grid[y + 1][x - 1] : 0
const left = (x, y) => x > 0 ? grid[y][x - 1] : 0
const topLt = (x, y) => x > 0 && y > 0 ? grid[y - 1][x - 1] : 0

const neighbours = [top, topRt, right, botRt, bottom, botLt, left, topLt]

const update = (findex) => {
  if (findex % 4 === 0) {
    console.time('update_4')
    const pop = []

    for (let yi = 0; yi < grid.length; yi++) {
      const row = []
      for (let xi = 0; xi < grid[yi].length; xi++) {
        let alive = 0
        for (let n of neighbours) {
          alive += n(xi, yi)
        }

        // if (grid[yi][xi]) {
        //   row.push(alive < 2 || alive > 3 ? 0 : 1)
        // } else {
        //   row.push(alive === 3 ? 1 : 0)
        // }

        if (grid[yi][xi]) {
          row.push([3, 4].indexOf(alive) > -1)
        } else {
          row.push([3, 4].indexOf(alive) > -1)
        }
      }

      pop.push(row)
    }

    grid = pop
    console.timeEnd('update_4')
  }
}

const draw = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#ffffff'
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.fillRect(xi * size, yi * size, size, size)
      }
    }
  }
}

const GameOfLife = (props) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const startTime = Date.now()

    let findex = 0, animationFrameId

    const init = () => {
      fillRandom(.1)
      // fillHStripes()
      // fillVStripes()
      // fillCheckered()

      canvas.setAttribute('width', window.innerWidth)
      canvas.setAttribute('height', window.innerHeight)
    }

    const fill = (fillRule) => {
      const mat = []
      for (let y = 0; y < gh; y++) {
        mat[y] = []
        for (let x = 0; x < gw; x++) {
          mat[y][x] = fillRule(x, y)
        }
      }
      grid = mat
    }

    const fillRandom = (selector = .5) => fill(() => Math.random() > (1 - selector) ? 1 : 0)
    const fillHStripes = () => fill((x, y) => y % 2)
    const fillVStripes = () => fill((x) => x % 2)

    const fillCheckered = () => {
      let isChecked = false
      const mat = []
      for (let y = 0; y < gh; y++) {
        mat[y] = []
        for (let x = 0; x < gw; x++) {
          isChecked = y > 0 && x === 0 ? !mat[y - 1][0] : !isChecked
          mat[y][x] = isChecked
        }
      }
      grid = mat
    }

    const render = () => {
      findex += 1
      update(findex)
      draw(context)
      // console.log("FPS: " + (findex / (Date.now() - startTime) * 1000))
      animationFrameId = window.requestAnimationFrame(render)
    }

    init()
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return <canvas ref={canvasRef} {...props} />
}

export default GameOfLife