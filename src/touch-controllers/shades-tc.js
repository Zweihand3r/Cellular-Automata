import { dynamicShades, monoShades } from "../static/dynamic-shades"
import { generateGradient, hex2rgb, rgb2hex } from "../utils/color-utils"

const STEP_MAX = 100
const PULSE_MAX = 20

let step = 10, pulse = 1, isMono = true
let mi = 0 // Mode Index -> 0 - step, 1 - pulse
let dsi = 0 // dynamic shade index
let msi = 0 // mono shade index

let extendColorMod, shortenColorMod

const init = () => {
  extendColorMod = nextMono
  shortenColorMod = prevMono
}

const applyMods = () => {
  let name, colors, steps
  ({ name, colors } = dynamicShades[dsi])
  if (step === 0) {
    return {
      shades: [
        ...colors.map(color => rgb2hex(color)),
        ...(new Array(pulse).fill('#000000'))
      ],
      notification: `${name} | ${mi ? `Pulse ${pulse}` : `Step ${step}`}`
    }
  }
  ({ colors, steps } = configureColors(colors))
  return {
    shades: generateGradient({ colors, steps }),
    notification: `${name} | ${mi ? `Pulse ${pulse}` : `Step ${step}`}`
  }
}

const configureColors = colors => {
  let steps = []
  if (pulse) {
    if (pulse > 1) {
      colors = [
        { r: 0, g: 0, b: 0 },
        ...colors,
        { r: 0, g: 0, b: 0 },
        { r: 0, g: 0, b: 0 }
      ]
      steps = new Array(colors.length - 1).fill(step)
      steps[steps.length - 1] *= pulse
    } else {
      colors = [
        { r: 0, g: 0, b: 0 },
        ...colors,
        { r: 0, g: 0, b: 0 }
      ]
      steps = new Array(colors.length - 1).fill(step)
    }
  } else {
    colors = [...colors, colors[0]]
    steps = new Array(colors.length - 1).fill(step)
  }
  return { colors, steps }
}

const applyMono = () => {
  const { name, hex } = monoShades[msi]
  return { shades: [hex], notification: `Mono - ${name}` }
}

const extendSeq = () => {
  if (step < STEP_MAX) {
    step += 1
  }
  return applyMods()
}

const shortenSeq = () => {
  if (step > 0) {
    step -= 1
  }
  return applyMods()
}

const extendPulse = () => {
  if (pulse < PULSE_MAX) {
    pulse += 1
  }
  return applyMods()
}

const shortenPulse = () => {
  if (pulse > 0) {
    pulse -= 1
  }
  return applyMods()
} 

const nextMono = () => {
  if (msi < monoShades.length - 1) {
    msi += 1
  } else {
    msi = 0
  }
  return applyMono()
}

const prevMono = () => {
  if (msi > 0) {
    msi -= 1
  } else {
    msi = monoShades.length - 1
  }
  return applyMono()
}

const nextSeq = () => {
  if (dsi < dynamicShades.length - 1) {
    dsi += 1
    if (isMono) {
      isMono = false
      extendColorMod = mi ? extendPulse : extendSeq
      shortenColorMod = mi ? shortenPulse : shortenSeq
    }
  }
  return applyMods()
}

const prevSeq = () => {
  if (dsi > 0) {
    dsi -= 1
  }
  if (dsi === 0) {
    if (!isMono) {
      isMono = true
      extendColorMod = nextMono
      shortenColorMod = prevMono
    }
    return applyMono()
  }
  return applyMods()
}

const switchColorSubMod = () => {
  if (dsi > 0) {
    mi = 1 - mi
    extendColorMod = mi ? extendPulse : extendSeq
    shortenColorMod = mi ? shortenPulse : shortenSeq
    return { 
      notification: `Selected ↑↓ Modifier - ${mi ? 'Pulse' : 'Step'}` 
    }
  }
  return { notification: '' }
}

init()

export { extendColorMod, shortenColorMod, nextSeq, prevSeq, switchColorSubMod }


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
