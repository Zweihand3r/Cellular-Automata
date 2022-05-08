/**
 * list = [{ isTint, value }]
 * value = hex if isTint else gradient-step
 * isTint needs to alternate between true/false
 */

export const generateShadesFromList = list => {
  const colors = [], steps = []

  let index = 0
  while (index < list.length) {
    const { isTint, value } = list[index]

    if (isTint) {
      colors.push(hex2rgb(value))
    } else {
      steps.push(value)
    }
    
    index += 1
  }

  return generateGradient({ colors, steps })
}

/* colors = [{ r, g, b }] */
export const generateGradient = ({ colors, steps }) => {
  const gradient = []

  if (colors.length - steps.length !== 1) {
    throw new Error('Length of colors must be one more than steps')
  } else {
    let index = 1
    while (index < colors.length) {
      const prev = colors[index - 1]
      const next = colors[index]
      const step = steps[index - 1] - 1

      const dr = (next.r - prev.r) / step
      const dg = (next.g - prev.g) / step
      const db = (next.b - prev.b) / step

      gradient.push(rgb2hex(prev))

      for (let i = 1; i < step; i++) {
        gradient.push(rgb2hex({ r: prev.r + dr * i, g: prev.g + dg * i, b: prev.b + db * i }))
      }

      gradient.push(rgb2hex(next))
      index += 1
    }
  }

  return gradient
}

export const hex2rgb = (hex) => {
  const bigint = parseInt(hex.substring(1), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

export const rgb2hex = ({ r, g, b }) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7)
}