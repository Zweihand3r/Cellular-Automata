import { dynamicRules } from "../static/dynamic-rules"

let dynRules_b = [], dynRules_s = [], bi = 0, si = 0

const init = () => {
  dynRules_b = [...dynamicRules]
  dynRules_s = dynamicRules.filter(r => r !== "")
  bi = dynRules_b.indexOf("3")
  si = dynRules_s.indexOf("23")
}

const currBRl = () => dynRules_b[bi]
const currSRl = () => dynRules_s[si]

const nextBRl = () => {
  if (bi < dynRules_b.length - 1) {
    bi += 1
  } else {
    bi = 0
  }
  return dynRules_b[bi]
}

const prevBRl = () => {
  if (bi > 0) {
    bi -= 1
  } else {
    bi = dynRules_b.length - 1
  }
  return dynRules_b[bi]
}

const nextSRl = () => {
  if (si < dynRules_s.length - 1) {
    si += 1
  } else {
    si = 0
  }
  return dynRules_s[si]
}

const prevSRl = () => {
  if (si > 0) {
    si -= 1
  } else {
    si = dynRules_s.length - 1
  }
  return dynRules_s[si]
}

init()

export { currBRl, currSRl, nextBRl, prevBRl, nextSRl, prevSRl }