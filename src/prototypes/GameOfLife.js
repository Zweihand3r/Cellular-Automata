import { useRef, useState, useEffect } from 'react'

import './prototypes.css'

let playActive = true

let size = 5

let tw = Math.floor(window.innerWidth / 5)
let th = Math.floor(window.innerHeight / size)

let gw = tw
let gh = th

let cw = gw - 1
let ch = gh - 1

let speed = 4

let grid = []
let neighbours = []

let icIndex = 0

let cond_S = [2, 3]
let cond_B = [3]

const conditionPresets = [
  {name: 'Life', b: '3', s: '23'},
  {name: 'Replicator', b: '1357', s: '1357'},
  {name: 'Seeds', b: '2', s: ''},
  {name: 'Untitled', b: '25', s: '4'},
  {name: 'Life w/ Death', b: '3', s: '012345678'},
  {name: '34 Life', b: '34', s: '34'},
  {name: 'Diamoeba', b: '35678', s: '5678'},
  {name: '2x2', b: '36', s: '125'},
  {name: 'HighLife', b: '36', s: '23'},
  {name: 'Day & Night', b: '3678', s: '34678'},
  {name: 'Morley', b: '368', s: '245'},
  {name: 'Anneal', b: '4678', s: '35678'}
]

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

const _top = (x, y) => grid[y - 1][x]
const _topRt = (x, y) => grid[y - 1][x + 1]
const _right = (x, y) => grid[y][x + 1]
const _botRt = (x, y) => grid[y + 1][x + 1]
const _bottom = (x, y) => grid[y + 1][x]
const _botLt = (x, y) => grid[y + 1][x - 1]
const _left = (x, y) => grid[y][x - 1]
const _topLt = (x, y) => grid[y - 1][x - 1]
const _outOfBounds = () => 0

const reset = () => {
  updateIndex = 0
  totalTimeElapsed = 0

  if (tw !== gw) { gw = tw; cw = gw - 1 }
  if (th !== gh) { gh = th; ch = gh - 1 }

  switch (icIndex) {
    case 0: fillRandom(.25); break
    case 1: fillHStripe(); break
    case 2: fillVStripe(); break
    case 3: fillHStripes(); break
    case 4: fillVStripes(); break
    case 5: fillCheckered(); break
    case 6: fillRect(); break
    case 7: fillCross(); break
    case 8: fillGliderGun(); break
  }
}

const fill = (fillRule) => {
  const mat = []
  const nei = []
  for (let y = 0; y < gh; y++) {
    mat[y] = []
    nei[y] = []
    for (let x = 0; x < gw; x++) {
      mat[y][x] = fillRule(x, y)

      if (x === 0 && y === 0) nei[y][x] = n_topLt
      else if (x === cw && y === 0) nei[y][x] = n_topRt
      else if (x === cw && y === ch) nei[y][x] = n_botRt
      else if (x === 0 && y === ch) nei[y][x] = n_botLt
      else if (y === 0) nei[y][x] = n_top
      else if (x === cw) nei[y][x] = n_right
      else if (y === ch) nei[y][x] = n_bottom
      else if (x === 0) nei[y][x] = n_left
      else nei[y][x] = n_center
    }
  }
  grid = mat
  neighbours = nei
}

const fillRandom = (selector = .5) => fill(() => Math.random() > (1 - selector) ? 1 : 0)
const fillVStripe = (index = Math.floor(gw / 2)) => fill((x) => index === x ? 1 : 0)
const fillHStripe = (index = Math.floor(gh / 2)) => fill((x, y) => index === y ? 1 : 0)
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

const fillRect = () => fill((x, y) => x === 20 || y === 20 || x === cw - 20 || y === ch - 20 ? 1 : 0)
const fillCross = () => fill((x, y) => x === Math.floor(gw / 2) || y === Math.floor(gh / 2) ? 1 : 0)

const fillGliderGun = (sx = 34, sy = 10) => {
  const mat = []
  for (let y = 0; y < gh; y++) {
    mat[y] = []
    for (let x = 0; x < gw; x++) {
      mat[y][x] = 0
    }
  }

  sx -= 24

  mat[sy][sx + 24] = 1

  sy += 1
  mat[sy][sx + 22] = 1
  mat[sy][sx + 24] = 1

  sy += 1
  mat[sy][sx + 12] = 1
  mat[sy][sx + 13] = 1
  mat[sy][sx + 20] = 1
  mat[sy][sx + 21] = 1
  mat[sy][sx + 34] = 1
  mat[sy][sx + 35] = 1

  sy += 1
  mat[sy][sx + 11] = 1
  mat[sy][sx + 15] = 1
  mat[sy][sx + 20] = 1
  mat[sy][sx + 21] = 1
  mat[sy][sx + 34] = 1
  mat[sy][sx + 35] = 1

  sy += 1
  mat[sy][sx] = 1
  mat[sy][sx + 1] = 1
  mat[sy][sx + 10] = 1
  mat[sy][sx + 16] = 1
  mat[sy][sx + 20] = 1
  mat[sy][sx + 21] = 1

  sy += 1
  mat[sy][sx] = 1
  mat[sy][sx + 1] = 1
  mat[sy][sx + 10] = 1
  mat[sy][sx + 14] = 1
  mat[sy][sx + 16] = 1
  mat[sy][sx + 17] = 1
  mat[sy][sx + 22] = 1
  mat[sy][sx + 24] = 1

  sy += 1
  mat[sy][sx + 10] = 1
  mat[sy][sx + 16] = 1
  mat[sy][sx + 24] = 1

  sy += 1
  mat[sy][sx + 11] = 1
  mat[sy][sx + 15] = 1

  sy += 1
  mat[sy][sx + 12] = 1
  mat[sy][sx + 13] = 1

  grid = mat
}

const fillCustom = () => {
  
}

const n_top = [_right, _botRt, _bottom, _botLt, _left]
const n_topRt = [_bottom, _botLt, _left]
const n_right = [_top, _bottom, _botLt, _left, _topLt]
const n_botRt = [_top, _left, _topLt]
const n_bottom = [_top, _topRt, _right, _left, _topLt]
const n_botLt = [_top, _topRt, _right]
const n_left = [_top, _topRt, _right, _botRt, _bottom]
const n_topLt = [_right, _botRt, _bottom]
const n_center = [_top, _topRt, _right, _botRt, _bottom, _botLt, _left, _topLt]

const neighbour_checks = [top, topRt, right, botRt, bottom, botLt, left, topLt]

let updateIndex = 0
let totalTimeElapsed = 0

const update = (findex) => {
  if (findex % speed === 0) {
    // const start = Date.now()
    const pop = []

    for (let yi = 0; yi < grid.length; yi++) {
      const row = []
      for (let xi = 0; xi < grid[yi].length; xi++) {
        let alive = 0
        for (let n of neighbours[yi][xi]) {
          alive += n(xi, yi)
        }

        if (grid[yi][xi]) {
          /* Survival */
          row.push(cond_S.indexOf(alive) > -1)
        } else {
          /* New */
          row.push(cond_B.indexOf(alive) > -1)
        }
      }

      pop.push(row)
    }

    grid = pop
    updateIndex += 1
    // const timeElapsed = Date.now() - start
    // totalTimeElapsed += timeElapsed

    // console.log(`timeElapsed: ${timeElapsed}, avg: ${totalTimeElapsed / updateIndex}`)
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
      fillRandom(.5)

      canvas.setAttribute('width', window.innerWidth)
      canvas.setAttribute('height', window.innerHeight)
    }

    const render = () => {
      findex += 1
      if (playActive) {
        update(findex)
        draw(context)
      }
      // console.log("FPS: " + (findex / (Date.now() - startTime) * 1000))
      animationFrameId = window.requestAnimationFrame(render)
    }

    init()
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <div className='life-container'>
      <canvas ref={canvasRef} {...props} />

      <Controls />
    </div>
  )
}

const Controls = () => {
  const [isPlaying, setIsPlaying] = useState(true)

  const toggleIsPlaying = () => {
    playActive = !isPlaying
    setIsPlaying(playActive)
  }

  const updateIcIndex = (event) => {
    icIndex = event.target.selectedIndex
  }

  const updateConditions = (event) => {
    const {b, s} = conditionPresets[event.target.selectedIndex]
    cond_S = s.split('').map(cond => parseInt(cond))
    cond_B = b.split('').map(cond => parseInt(cond))
    console.log(`Selected conditions: B: ${cond_B}, S: ${cond_S}`)
  }

  const updateTw = (event) => {
    tw = Math.clamp(event.target.value, 10, 1000)
  }

  const updateTh = (event) => {
    th = Math.clamp(event.target.value, 10, 1000)
  }

  const updateSize = (event) => {
    size = Math.clamp(event.target.value, 2, 50)
  }

  const updateSpeed = (event) => {
    speed = 41 - Math.clamp(event.target.value, 1, 40)
  }

  return (
    <div className='life-controls'>
      <Text fontSize={30} fontWeight={900} padVert={8}>CONTROLS</Text>

      <Button width={148} text={isPlaying ? 'Pause' : 'Play'} onClick={toggleIsPlaying} />

      <div />

      <Button width={148} marginBot={8} text='Reset' onClick={reset} />

      <Text >Initial Condition: *</Text>
      <select onChange={updateIcIndex}>
        <option>Random</option>
        <option>Hori Stripe</option>
        <option>Vert Stripe</option>
        <option>Hori Stripes</option>
        <option>Vert Stripes</option>
        <option>Checkered</option>
        <option>Rect Kinda</option>
        <option>Cross</option>
        <option>Glider Gun</option>
      </select>

      <Text padTop={8}>Rules:</Text>
      <select onChange={updateConditions}>
        {conditionPresets.map(({name}) => <option key={name}>{name}</option>)}
      </select>
      
      <Text padTop={8}>Width: *</Text>
      <input defaultValue={gw} onChange={updateTw}></input>

      <Text padTop={8}>Height: *</Text>
      <input defaultValue={gh} onChange={updateTh}></input>

      <Text padTop={8}>Size:</Text>
      <input defaultValue={size} onChange={updateSize}></input>

      <Text padTop={8}>Speed:</Text>
      <input defaultValue={41 - speed} onChange={updateSpeed} ></input>

      <Text fontSize={12} padTop={8}>* <i>These changes will only be visible on a reset</i></Text>
    </div>
  )
}

const Text = ({ children, fontSize, fontWeight, color, padVert, padTop, padBot }) => {
  return (
    <div style={{
      fontSize: fontSize || 15,
      fontWeight: fontWeight || 500,
      color: color || '#f7f7f7',
      paddingTop: padVert || padTop || 0,
      paddingBottom: padVert || padBot || 0
    }}>{children}</div>
  )
}

const Button = ({ text, onClick, width, marginTop, marginBot }) => {
  return (
    <input type="button" value={text} style={{
      height: 24, width: width || 'auto', marginTop: marginTop || 0, marginBottom: marginBot || 0
    }} onClick={onClick} />
  )
}

Math.clamp = (x, a, b) => Math.min(Math.max(x, a), b)

export default GameOfLife