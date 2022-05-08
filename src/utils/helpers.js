window.helperNames = []

const createHelpers = (helpers) => {
  helpers.forEach(helper => {
    let name = helper.name
    if (window[name]) name = `f${name.charAt(0).toUpperCase()}${name.substring(1)}`
    window[name] = helper
    window.helperNames.push(name)
  })
}

window.print2dArray = (arr2d) => {
  let printStr = ""
  for (let y = 0; y < arr2d.length; y++) {
    for (let x = 0; x < arr2d[y].length; x++) {
      printStr += `${arr2d[y][x]} `
    }
    printStr += '\n'
  }
  console.log(printStr)
}

Math.clamp = (x, a, b) => Math.min(Math.max(x, a), b)
Math.lerp = (a, b, x) => a + (b - a) * Math.clamp(x, 0, 1)
Math.inverseLerp = (a, b, x) => Math.clamp((x - a) / (b - a), 0, 1)

export { createHelpers }