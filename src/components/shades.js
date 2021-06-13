let monoShade, shades, isLooped, ages, ageMax, updateAge, selectedShadesSeq

const getShade = (x, y) => shades[ages[y][x]]

const setShades = ({ shadeSeq, isLoop, grid }) => {
  selectedShadesSeq = shadeSeq
  isLooped = isLoop
  constructShades(shadeSeq, grid)
}

const updateShades = ({ grid }) => {
  constructShades(selectedShadesSeq, grid)
}

const resetAges = () => ages = ages ? ages.map(row => row.map(_ => 0)) : []

const constructShades = (shadeSeq, grid) => {
  if (shadeSeq.length > 1) {
    shades = ['age starts from index 1', ...shadeSeq]
    ageMax = shades.length - 1
    ages = grid.map(row => row.map(i => 0))
    updateAge = isLooped ? _updateLoopedAge : _updateAge
  } else {
    monoShade = shadeSeq[0]
    updateAge = () => {}
  }
}

const _incrementAge = (x, y) => {
  if (ages[y][x] < ageMax) {
    ages[y][x] += 1
  }
}

const _incrementLoopedAge = (x, y) => {
  if (ages[y][x] < ageMax) {
    ages[y][x] += 1
  } else {
    ages[y][x] = 0
  }
}

const _resetAge = (x, y) => {
  if (ages[y][x] > 0) {
    ages[y][x] = 0
  }
}

const _updateAge = (isAlive, x, y) => {
  if (isAlive) _incrementAge(x, y)
  else _resetAge(x, y)
}

const _updateLoopedAge = (isAlive, x, y) => {
  if (isAlive) _incrementLoopedAge(x, y)
  else _resetAge(x, y)
}

export { monoShade, getShade, setShades, updateShades, resetAges, updateAge }