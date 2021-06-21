let bX, bY, selectedShape

const randomInit = ['random', 'vstripes', 'hstripes', 'rect', 'cross']

const setBounds = (x, y) => {
  bX = x
  bY = y
}

const createGrid = ({ shape, grid }) => {
  selectedShape = shape
  return constructGrid(shape, grid)
}

const createRandom = ({ grid }) => {
  const shape = randomInit[Math.floor(Math.random() * randomInit.length)]
  return createGrid({ shape, grid })
}

const reCreateGrid = ({ grid }) => {
  return constructGrid(selectedShape, grid)
}

const constructGrid = (shape, grid) => {
  switch (shape) {
    case 'clear': return clear()
    case 'fill': return fill()
    case 'invert': return invert(grid)
    case 'random': return random()
    case 'vstripes': return vstripes()
    case 'hstripes': return hstripes()
    case 'rect': return rect()
    case 'cross': return cross()
    case 'checkered': return checkered(grid)
  }
}

const clear = () => create2dArray(() => 0)
const fill = () => create2dArray(() => 1)
const invert = (grid) => create2dArray(({ x, y }) => 1 - grid[y][x])
const random = (threshold = .5) => create2dArray(() => Math.random() > threshold ? 1 : 0)
const vstripes = () => create2dArray(({ x }) => x % 2)
const hstripes = () => create2dArray(({ y }) => y % 2)
const rect = () => create2dArray(({ x, y }) => x === 0 || y === 0 || x === bX - 1 || y === bY - 1 ? 1 : 0)
const cross = () => create2dArray(({ x, y }) => x === Math.floor(bX / 2) || y === Math.floor(bY / 2) ? 1 : 0)
const checkered = (grid) => {
  let check = 0
  const _grid = []
  for (let yi = 0; yi < grid.length; yi++) {
    _grid[yi] = []
    for (let xi = 0; xi < grid[yi].length; xi++) {
      check = yi > 0 && xi === 0 ? 1 - _grid[yi - 1][0] : 1 - check
      _grid[yi][xi] = check
    }
  }
  return _grid
}

const create2dArray = (func) => {
  const array = []
  for (let y = 0; y < bY; y++) {
    array[y] = []
    for (let x = 0; x < bX; x++) {
      array[y][x] = func({ x, y })
    }
  }
  return array
}

export { setBounds, createGrid, reCreateGrid, createRandom }