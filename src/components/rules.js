let global_S = [2, 3]
let global_B = [3]

const setRule = ({ b, s }) => {
  global_B = b.split('').map(i => parseInt(i))
  global_S = s.split('').map(i => parseInt(i))
}

const globalSurvivalTrigger = (alive, x, y) => {
  return global_S.indexOf(alive) > -1 ? 1 : 0
}

const globalBirthTrigger = (alive, x, y) => {
  return global_B.indexOf(alive) > -1 ? 1 : 0
}

const localSurvivalTrigger = (alive, x, y) => {

}

const localBirthTrigger = (alive, x, y) => {

}

let checkSurvival = globalSurvivalTrigger
let checkBirth = globalBirthTrigger

export { setRule, checkSurvival, checkBirth }