import { createHelpers } from './helpers'
import { setBounds, createGrid } from './shapes'
import { setRule, checkSurvival, checkBirth } from './rules'
import { monoShade, getShade, setShades, resetAges, updateAge } from './shades'

let gridW, gridH, size
let grid, neighbours


/* --- Exports --- */

const initGrid = () => {
  size = 5
  calculateDimensions()

  grid = createGrid({ shape: 'random', grid })
  setShades({ shadeSeq: ['#ffffff'], grid })

  generateNeighbours(gridW, gridH)
}

const updateGrid = () => {
  const pop = []
  // const nGrid = []
  for (let yi = 0; yi < grid.length; yi++) {
    const row = []
    // const nRow = []
    for (let xi = 0; xi < grid[yi].length; xi++) {
      let alive = 0, isAlive
      for (let n of neighbours[yi][xi]) {
        alive += n(xi, yi)
        // console.log(xi, yi, n.toString(), n(xi, yi))
      }

      // nRow.push(alive)

      if (grid[yi][xi]) {
        isAlive = checkSurvival(alive, xi, yi)
      } else {
        isAlive = checkBirth(alive, xi, yi)
      }

      row.push(isAlive)
      updateAge(isAlive, xi, yi)
    }
    // nGrid.push(nRow)
    pop.push(row)
  }
  grid = pop

  // print2dArray(nGrid)
  // print2dArray(grid)
}

const drawGrid = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = monoShade
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.fillRect(xi * size, yi * size, size, size)
      }
    }
  }
}

const drawShaded = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.fillStyle = getShade(xi, yi)
        ctx.fillRect(xi * size, yi * size, size, size)
      }
    }
  }
}

const drawOnGrid = (x, y) => {
  const gX = Math.min(Math.floor(x / size), gridW - 1)
  const gY = Math.min(Math.floor(y / size), gridH - 1)
  grid[gY][gX] = 1
}

const eraseOnGrid = (x, y) => {
  const gX = Math.min(Math.floor(x / size), gridW - 1)
  const gY = Math.min(Math.floor(y / size), gridH - 1)
  grid[gY][gX] = 0
}

const setShape = (shape) => {
  grid = createGrid({ shape, grid })
  resetAges()
}

const setShadeSeq = (shadeSeq) => {
  setShades({ shadeSeq, grid })
}

/* --- End Exports --- */

const setDimensions = (_gridW, _gridH) => {
  gridW = _gridW
  gridH = _gridH

  setBounds(gridW, gridH)
}

const calculateDimensions = () => {
  setDimensions(
    Math.floor(window.innerWidth / size),
    Math.floor(window.innerHeight / size)
  )

  console.log(`Calculated gridW: ${gridW}, gridH: ${gridH}`)
}

const generateNeighbours = (bX, bY) => {
  const cX = bX - 1
  const cY = bY - 1
  const nei = []
  for (let y = 0; y < bY; y++) {
    nei[y] = []
    for (let x = 0; x < bX; x++) {
      if (x === 0 && y === 0) nei[y][x] = n_topLt
      else if (x === cX && y === 0) nei[y][x] = n_topRt
      else if (x === cX && y === cY) nei[y][x] = n_botRt
      else if (x === 0 && y === cY) nei[y][x] = n_botLt
      else if (y === 0) nei[y][x] = n_top
      else if (x === cX) nei[y][x] = n_right
      else if (y === cY) nei[y][x] = n_bottom
      else if (x === 0) nei[y][x] = n_left
      else nei[y][x] = n_center
    }
  }
  neighbours = nei
}

const top = (x, y) => grid[y - 1][x]
const topRt = (x, y) => grid[y - 1][x + 1]
const right = (x, y) => grid[y][x + 1]
const botRt = (x, y) => grid[y + 1][x + 1]
const bottom = (x, y) => grid[y + 1][x]
const botLt = (x, y) => grid[y + 1][x - 1]
const left = (x, y) => grid[y][x - 1]
const topLt = (x, y) => grid[y - 1][x - 1]

const n_top = [right, botRt, bottom, botLt, left]
const n_topRt = [bottom, botLt, left]
const n_right = [top, bottom, botLt, left, topLt]
const n_botRt = [top, left, topLt]
const n_bottom = [top, topRt, right, left, topLt]
const n_botLt = [top, topRt, right]
const n_left = [top, topRt, right, botRt, bottom]
const n_topLt = [right, botRt, bottom]
const n_center = [top, topRt, right, botRt, bottom, botLt, left, topLt]

createHelpers([top, topRt, right, botRt, bottom, botLt, left, topLt])

export { 
  initGrid, updateGrid, drawGrid, drawShaded, drawOnGrid, eraseOnGrid,
  setShape, setRule, setShadeSeq
}