import { dynamicShades } from "../static/dynamic-shades"
import { generateGradient, hex2rgb, rgb2hex } from "../utils/color-utils"

let step = 10
let dsi = 0 // dynamic shade index

const init = () => {
  
}

const applySteps = () => {
  const { name, colors } = dynamicShades[dsi]
  if (colors.length === 1) {
    return {
      name, step, shades: [rgb2hex(colors[0])]
    }
  }
  if (step === 0) {
    return {
      name, step, shades: colors.map(color => rgb2hex(color))
    }
  }
  return {
    name, step,
    shades: generateGradient({
      colors, steps: new Array(colors.length - 1).fill(step)
    })
  }
}

const extendSeq = () => {
  if (step < 100) {
    step += 1
  }
  return applySteps()
}

const shortenSeq = () => {
  if (step > 0) {
    step -= 1
  }
  return applySteps()
}

const nextSeq = () => {
  if (dsi < dynamicShades.length - 1) {
    dsi += 1
  }
  return applySteps()
}

const prevSeq = () => {
  if (dsi > 0) {
    dsi -= 1
  }
  return applySteps()
}

init()

export { extendSeq, shortenSeq, nextSeq, prevSeq }


// HELPERS

const converti = (inpStr) => {
  const inputArr = inpStr.split("-")
  const name = inputArr[0]
  const hexes = inputArr[1].split(" ")
  let outStr = `\n{\n  name: "${name}",\n  colors: [\n    { r: 0, g: 0, b: 0 },\n`
  hexes.forEach((hex, i) => {
    const { r, g, b } = hex2rgb(hex)
    outStr += `    { r: ${r}, g: ${g}, b: ${b} },\n`
    if (i === hexes.length - 1) {
      outStr += '    { r: 0, g: 0, b: 0 }\n  ]\n},\n\n'
    }
  })
  console.log(outStr)
  return 0
}

window.createHelpers([converti])
