let bX, bY

const setBounds = (x, y) => {
  bX = x
  bY = y
}

const shapes = {
  random: (threshold = .5) => create2dArray(() => Math.random() > threshold ? 1 : 0)
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

export { shapes, setBounds }