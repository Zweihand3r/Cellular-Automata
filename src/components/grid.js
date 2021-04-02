import { shapes, setBounds } from './shapes.js'
import { checkSurvival, checkBirth } from './rules'

let gridW, gridH, size
let grid, neighbours, shades

window.aliveCount = (x, y) => {
  let alive = 0
  for (let n of neighbours[y][x]) {
    alive += n(x, y)
  }
  return alive
}

const initGrid = () => {
  size = 5
  calculateDimensions()

  grid = shapes.random()
  generateNeighbours(gridW, gridH)
}

const updateGrid = () => {
  const pop = []
  for (let yi = 0; yi < grid.length; yi++) {
    const row = []
    for (let xi = 0; xi < grid[yi].length; xi++) {
      let alive = 0
      for (let n of neighbours[yi][xi]) {
        alive += n(xi, yi)
      }

      if (grid[yi][xi]) {
        row.push(checkSurvival(alive, xi, yi))
      } else {
        row.push(checkBirth(alive, xi, yi))
      }
    }
    pop.push(row)
  }
  grid = pop
}

const drawGrid = (ctx) => {
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

export { initGrid, updateGrid, drawGrid }