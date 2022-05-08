let monoShade, shades, isLooped, ages, ageMax, updateAge, selectedShadesSeq, preserveAges

const getShade = (x, y) => shades[ages[y][x]]

const initShades = (grid) => {
  selectedShadesSeq = ["#ffffff"]
  isLooped = false
  resetAges(grid)
  constructShades(selectedShadesSeq)
}

const setShades = ({ shadeSeq, isLoop, grid }) => {
  preserveAges = isLoop && isLooped && selectedShadesSeq.length === shadeSeq
  selectedShadesSeq = shadeSeq
  isLooped = isLoop
  constructShades(shadeSeq, grid)
}

const updateShades = ({ grid }) => {
  resetAges(grid)
  constructShades(selectedShadesSeq)
}

const resetAges = (grid) => ages = grid.map(row => row.map(_ => 0))

const constructShades = (shadeSeq) => {
  if (shadeSeq.length > 1) {
    shades = ['age starts from index 1', ...shadeSeq]
    ageMax = shades.length - 1
    if (!preserveAges) { // if this true than _updateLoopedAge is already selected
      ages = ages.map(row => row.map(age => Math.min(age, ageMax)))
      updateAge = isLooped ? _updateLoopedAge : _updateAge
    }
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

export { monoShade, getShade, initShades, setShades, updateShades, resetAges, updateAge }