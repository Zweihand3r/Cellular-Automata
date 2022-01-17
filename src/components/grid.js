import { createHelpers } from './helpers'
import { setBounds, setShape, getShape, createGrid, reCreateGrid, createRandom } from './shapes'
import { setRule, checkSurvival, checkBirth } from './rules'
import { monoShade, getShade, setShades, updateShades, resetAges, updateAge } from './shades'

let gridW, gridH, size, brushSize
let grid, neighbours, wrapEnabled
let pCells, pOutOfBounds, pX, pY // pX, pY = Current preview cell coordinates
let inverseBg, alphaBg, background, drawBackground, isClearCanvas // background = inverseBg + alphaBg


/* --- Exports --- */

const initGrid = () => {
  size = 5
  brushSize = 25
  calculateDimensions()

  wrapEnabled = false

  grid = createRandom({ grid })
  generateNeighbours(gridW, gridH)

  alphaBg = '00'
  background = inverseBg + alphaBg // inverseBg initialised in World init
  setShades({ shadeSeq: ['#ffffff'], grid })

  isClearCanvas = true
  updateDrawBackground()
}

const reInitGrid = () => {
  calculateDimensions()
  grid = reCreateGrid({ grid })
  updateShades({ grid })
  generateNeighbours(gridW, gridH)

  return { gridW, gridH }
}

const updateGrid = () => {
  let isAlive
  const pop = []
  for (let yi = 0; yi < grid.length; yi++) {
    const row = []
    for (let xi = 0; xi < grid[yi].length; xi++) {
      const alive = neighbours[yi][xi](xi, yi)
      if (grid[yi][xi]) {
        isAlive = checkSurvival(alive, xi, yi)
      } else {
        isAlive = checkBirth(alive, xi, yi)
      }
      row.push(isAlive)
      updateAge(isAlive, xi, yi)
    }
    pop.push(row)
  }
  grid = pop
}

const drawGrid = (ctx) => {
  drawBackground(ctx)
  ctx.fillStyle = monoShade
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.fillRect(xi * size, yi * size, size, size)
      }
    }
  }
}

const drawInverse = (ctx) => {
  ctx.fillStyle = inverseBg
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.clearRect(xi * size, yi * size, size, size)
      }
    }
  }
}

const drawShaded = (ctx) => {
  drawBackground(ctx)
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.fillStyle = getShade(xi, yi)
        ctx.fillRect(xi * size, yi * size, size, size)
      }
    }
  }
}

const drawShapes = (ctx) => {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#a2a2a2'
  for (let yi = 0; yi < grid.length; yi++) {
    for (let xi = 0; xi < grid[yi].length; xi++) {
      if (grid[yi][xi]) {
        ctx.fillRect(xi * size, yi * size, size, size)
      }
    }
  }
  ctx.fillStyle = pOutOfBounds ? '#ff3434' : '#ffffff'
  for (let i = 0; i < pCells.length; i++) {
    const [x, y] = pCells[i]
    ctx.fillRect(x * size, y * size, size, size)
  }
}

const setBrushSize = bsz => brushSize = bsz

const drawOnGrid = (x, y) => applyBrush(x, y, 1)
const eraseOnGrid = (x, y) => applyBrush(x, y, 0)

const paint = () => {
  if (!pOutOfBounds) {
    for (let i = 0; i < pCells.length; i++) {
      const [x, y] = pCells[i]
      grid[y][x] = 1
    }
  }
}

const preview = (x, y) => { 
  const cx = Math.min(Math.floor(x / size), gridW - 1)
  const cy = Math.min(Math.floor(y / size), gridH - 1)
  if (cx !== pX || cy !== pY) {
    pX = cx; pY = cy
    const { cells, outOfBounds } = getShape(cx, cy)
    pCells = cells; pOutOfBounds = outOfBounds
  }
}

const setSize = (sz) => {
  if (sz !== size) {
    size = sz
    reInitGrid()
  }

  return { gridW, gridH }
}

const setupPreview = shape => {
  setShape(shape)
  pX = -1; pY = -1
  pCells = []; pOutOfBounds = false
}

const setGridWrap = wrap => {
  wrapEnabled = wrap
  generateNeighbours(gridW, gridH)
}

const setFill = (fill, args) => {
  grid = createGrid({ fill, grid, args })
  resetAges()
}

const setInverseBg = invbg => {
  inverseBg = invbg
  background = inverseBg + alphaBg
}

const setShadeSeq = ({ shades, isLoop }) => {
  setShades({ shadeSeq: shades, isLoop, grid })
}

const setTrails = i => {
  i = 255 - i
  alphaBg = `${i < 16 ? '0' : ''}${i.toString(16)}`
  background = inverseBg + alphaBg

  if (i < 255) {
    if (isClearCanvas) {
      isClearCanvas = false
      updateDrawBackground()
    }
  } else {
    /* Cause you can hit 255 only once */
    isClearCanvas = true
    updateDrawBackground()
  }
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

const updateDrawBackground = () => {
  drawBackground = isClearCanvas ? ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  } : ctx => {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

const applyBrush = (x, y, b) => {
  const bsz = Math.max(1, Math.floor(brushSize / size))
  const cx = Math.min(Math.floor(x / size), gridW - 1)
  const cy = Math.min(Math.floor(y / size), gridH - 1)
  if (bsz > 1) {
    const hf = Math.floor(bsz / 2)
    const ox = cx - hf
    const oy = cy - hf
    for (let xi = 0; xi < bsz; xi++) {
      for (let yi = 0; yi < bsz; yi++) {
        const _x = ox + xi
        const _y = oy + yi
        if (checkBounds(_x, _y)) {
          grid[_y][_x] = b
        }
      }
    }
  } else {
    grid[cy][cx] = b
  }
}

const generateNeighbours = (bX, bY) => {
  const cX = bX - 1
  const cY = bY - 1
  const nei = []
  const generation = (tl, tr, br, bl, t, r, b, l) => {
    for (let y = 0; y < bY; y++) {
      nei[y] = []
      for (let x = 0; x < bX; x++) {
        if (x === 0 && y === 0) nei[y][x] = tl
        else if (x === cX && y === 0) nei[y][x] = tr
        else if (x === cX && y === cY) nei[y][x] = br
        else if (x === 0 && y === cY) nei[y][x] = bl
        else if (y === 0) nei[y][x] = t
        else if (x === cX) nei[y][x] = r
        else if (y === cY) nei[y][x] = b
        else if (x === 0) nei[y][x] = l
        else nei[y][x] = n_center
      }
    }
  }
  if (!wrapEnabled) generation(n_topLt, n_topRt, n_botRt, n_botLt, n_top, n_right, n_bottom, n_left)
  else generation(n_topLtW, n_topRtW, n_botRtW, n_botLtW, n_topW, n_rightW, n_bottomW, n_leftW) 
  neighbours = nei
}

/* --- NAMING ---
 * topRt    - Top Right
 * topRtW   - Top Right Wraped
 * topRtWC  - Top Right Wraped Corner 
 * rtTopW   - Right Top Wraped
 * 'Corners' and 'topRtW/rtTopW separations' are extra checks that arise because of wraping
 */

const top = (x, y) => grid[y - 1][x]
const topRt = (x, y) => grid[y - 1][x + 1]
const right = (x, y) => grid[y][x + 1]
const botRt = (x, y) => grid[y + 1][x + 1]
const bottom = (x, y) => grid[y + 1][x]
const botLt = (x, y) => grid[y + 1][x - 1]
const left = (x, y) => grid[y][x - 1]
const topLt = (x, y) => grid[y - 1][x - 1]

const topW = (x) => grid[gridH - 1][x]
const topRtW = (x) => grid[gridH - 1][x + 1]
const topRtWC = () => grid[gridH - 1][0]
const rtTopW = (_, y) => grid[y - 1][0]
const rightW = (_, y) => grid[y][0]
const rtBotW = (_, y) => grid[y + 1][0]
const botRtWC = () => grid[0][0]
const botRtW = (x) => grid[0][x + 1]
const bottomW = (x) => grid[0][x]
const botLtW = (x) => grid[0][x - 1]
const botLtWC = () => grid[0][gridW - 1]
const ltBotW = (_, y) => grid[y + 1][gridW - 1]
const leftW = (_, y) => grid[y][gridW - 1]
const ltTopW = (_, y) => grid[y - 1][gridW - 1]
const topLtWC = () => grid[gridH - 1][gridW - 1]
const topLtW = (x) => grid[gridH - 1][x - 1]

const n_top = (x, y) => right(x, y) + botRt(x, y) + bottom(x, y) + botLt(x, y) + left(x, y)
const n_topRt = (x, y) => bottom(x, y) + botLt(x, y) + left(x, y)
const n_right = (x, y) => top(x, y) + bottom(x, y) + botLt(x, y) + left(x, y) + topLt(x, y)
const n_botRt = (x, y) => top(x, y) + left(x, y) + topLt(x, y)
const n_bottom = (x, y) => top(x, y) + topRt(x, y) + right(x, y) + left(x, y) + topLt(x, y)
const n_botLt = (x, y) => top(x, y) + topRt(x, y) + right(x, y)
const n_left = (x, y) => top(x, y) + topRt(x, y) + right(x, y) + botRt(x, y) + bottom(x, y)
const n_topLt = (x, y) => right(x, y) + botRt(x, y) + bottom(x, y)
const n_center = (x, y) => top(x, y) + topRt(x, y) + right(x, y) + botRt(x, y) + bottom(x, y) + botLt(x, y) + left(x, y) + topLt(x, y)

const n_topW = (x, y) => topW(x, y) + topRtW(x, y) + right(x, y) + botRt(x, y) + bottom(x, y) + botLt(x, y) + left(x, y) + topLtW(x, y)
const n_topRtW = (x, y) => topW(x, y) + topRtWC(x, y) + rightW(x, y) + rtBotW(x, y) + bottom(x, y) + botLt(x, y) + left(x, y) + topLtW(x, y)
const n_rightW = (x, y) => top(x, y) + rtTopW(x, y) + rightW(x, y) + rtBotW(x, y) + bottom(x, y) + botLt(x, y) + left(x, y) + topLt(x, y)
const n_botRtW = (x, y) => top(x, y) + rtTopW(x, y) + rightW(x, y) + botRtWC(x, y) + bottomW(x, y) + botLtW(x, y) + left(x, y) + topLt(x, y)
const n_bottomW = (x, y) => top(x, y) + topRt(x, y) + right(x, y) + botRtW(x, y) + bottomW(x, y) + botLtW(x, y) + left(x, y) + topLt(x, y)
const n_botLtW = (x, y) => top(x, y) + topRt(x, y) + right(x, y) + botRtW(x, y) + bottomW(x, y) + botLtWC(x, y) + leftW(x, y) + ltTopW(x, y)
const n_leftW = (x, y) => top(x, y) + topRt(x, y) + right(x, y) + botRt(x, y) + bottom(x, y) + ltBotW(x, y) + leftW(x, y) + ltTopW(x, y)
const n_topLtW = (x, y) => topW(x, y) + topRtW(x, y) + right(x, y) + botRt(x, y) + bottom(x, y) + ltBotW(x, y) + leftW(x, y) + topLtWC(x, y)

const checkBounds = (x, y) => x > -1 && y > -1 && x < gridW && y < gridH

// createHelpers([])

export { 
  initGrid, reInitGrid, updateGrid, drawGrid, drawInverse, drawShaded, drawShapes, drawOnGrid, eraseOnGrid, paint, preview,
  setBrushSize, setSize, setupPreview, setFill, setGridWrap, setRule, setShadeSeq, setInverseBg, setTrails
}