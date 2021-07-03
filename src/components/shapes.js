let bX, bY, selectedFill

const randomInit = [
  'random', 'vstripes', 'hstripes', 'dstripes', 
  'rect','checkered', 'cross', 'mesh', 'wraplines'
]

const setBounds = (x, y) => {
  bX = x
  bY = y
}

const createGrid = ({ fill, grid, args }) => {
  selectedFill = fill
  return constructGrid(fill, grid, args)
}

const createRandom = ({ grid }) => {
  const fill = randomInit[Math.floor(Math.random() * randomInit.length)]
  console.log(`Created random fill: ${fill}`)
  return createGrid({ fill, grid })
}

const reCreateGrid = ({ grid }) => {
  return constructGrid(selectedFill, grid)
}

const constructGrid = (fill, grid, args) => {
  switch (fill) {
    case 'clear': return clear()
    case 'invert': return invert(grid)
    case 'random': return random(args)
    case 'vstripes': return vstripes(args)
    case 'hstripes': return hstripes(args)
    case 'dstripes': return dstripes(args)
    case 'rect': return rect(args)
    case 'checkered': return checkered(args)
    case 'cross': return cross(args)
    case 'mesh': return mesh(args)
    case 'wraplines': return wraplines(args)
  }
}

const clear = () => create2dArray(() => 0)
const invert = (grid) => create2dArray(({ x, y }) => 1 - grid[y][x])

const random = (args = [50]) => create2dArray(() => {
  return Math.random() < args[0] / 100 ? 1 : 0
})

const vstripes = (args = [1, 1]) => {
  const [s, w] = args
  let si, wi, a
  return create2dArray(() => {
    if (a) {
      if (wi < w) { wi += 1; a = 1 } 
      else { si = 1; a = 0 }
    } else {
      if (si < s) { si += 1; a = 0 } 
      else { a = 1; wi = 1 }
    }
    return a
  }, () => {
    a = 0; wi = 0; si = 0
  })
}

const hstripes = (args = [1, 1]) => {
  const [s, h] = args
  let si = 0, hi = 0, a = 0
  return create2dArray(() => {
    return a
  }, () => {
    if (a) {
      if (hi < h) { hi += 1; a = 1 }
      else { si = 1; a = 0 }
    } else {
      if (si < s) { si += 1; a = 0 }
      else { a = 1; hi = 1 }
    }
  })
}

const dstripes = (args = [1, 1]) => {
  /* Lazy code. Need to find better alternative */
  const [s, w] = args
  const snapshot = []
  let wi = 0, si = 0, di = 0, a = 0
  return create2dArray(({ y }) => {
    if (y === 0) snapshot.push({ wi, si, a })
    if (a) {
      if (wi < w) { wi += 1; a = 1 } 
      else { si = 1; a = 0 }
    } else {
      if (si < s) { si += 1; a = 0 } 
      else { a = 1; wi = 1 }
    }
    return a
  }, ({ y }) => {
    if (y > 0) {
      wi = snapshot[y].wi
      si = snapshot[y].si
      a = snapshot[y].a
    }
  })
}

const rect = (args = [bX, bY]) => {
  const [w, h] = args
  const start = { 
    x: Math.floor((bX - w) / 2), 
    y: Math.floor((bY - h) / 2)
  }
  const end = { x: start.x + w - 1, y: start.y + h - 1 }
  const grid = create2dArray(() => 0)
  for (let wi = start.x; wi <= end.x; wi++) {
    grid[start.y][wi] = 1
    grid[end.y][wi] = 1
  }
  for (let hi = start.y; hi <= end.y; hi++) {
    grid[hi][start.x] = 1
    grid[hi][end.x] = 1
  }
  return grid
}

const checkered = (args = [4, 4]) => {
  const [w, h] = args
  let wi = 0, hi = 0, astart = 0, a = astart
  return create2dArray(() => {
    if (wi < w) { wi += 1 }
    else { wi = 1; a = 1 - a }
    return a
  }, () => {
    if (hi < h) { hi += 1 }
    else { hi = 1; astart = 1 - astart }
    a = astart; wi = 0
  })
}

const cross = (args = [0, 0, bX, bY]) => {
  const [xoff, yoff, w, h] = args
  const xstart = Math.floor(bX / 2) + xoff - Math.floor(w / 2)
  const ystart = Math.floor(bY / 2) + yoff - Math.floor(h / 2)
  const grid = create2dArray(() => 0)
  for (let xi = 0; xi < bX; xi++) {
    for (let hi = 0; hi < h; hi++) {
      grid[ystart + hi][xi] = 1
    }
  }
  for (let yi = 0; yi < bY; yi++) {
    for (let wi = 0; wi < w; wi++) {
      grid[yi][xstart + wi] = 1
    }
  }
  return grid
}

const mesh = (args = [1, 1, 1, 1]) => {
  const [sx, sy, w, h] = args
  let sxi, wi, ax
  let syi = 0, hi = 0, ay = 0
  return create2dArray(() => {
    if (ay) {
      return 1
    } else if (ax) {
      if (wi < w) { wi += 1; ax = 1 }
      else { sxi = 1; ax = 0 }
    } else {
      if (sxi < sx) { sxi += 1; ax = 0 }
      else { ax = 1; wi = 1 }
    }
    return ax
  }, () => {
    ax = 0; wi = 0; sxi = 0
    if (ay) {
      if (hi < h) { hi += 1; ay = 1 }
      else { syi = 1; ay = 0 }
    } else {
      if (syi < sy) { syi += 1; ay = 0 }
      else { ay = 1; hi = 1 }
    }
  })
}

const wraplines = (args = [1, 1]) => {
  const [w, s] = args
  let si = 0, wi = 0, a = 0
  return create2dArray(() => {
    if (a) {
      if (wi < w) { wi += 1; a = 1 } 
      else { si = 1; a = 0 }
    } else {
      if (si < s) { si += 1; a = 0 } 
      else { a = 1; wi = 1 }
    }
    return a
  })
}

const create2dArray = (func, yiter = () => {}) => {
  const array = []
  for (let y = 0; y < bY; y++) {
    array[y] = []
    yiter({ y })
    for (let x = 0; x < bX; x++) {
      array[y][x] = func({ x, y })
    }
  }
  return array
}

export { setBounds, createGrid, reCreateGrid, createRandom }