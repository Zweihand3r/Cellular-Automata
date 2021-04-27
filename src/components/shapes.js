let bX, bY

const setBounds = (x, y) => {
  bX = x
  bY = y
}

const createGrid = ({ shape, grid }) => {
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
const checkered = (grid) => grid

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

export { setBounds, createGrid }