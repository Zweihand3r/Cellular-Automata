const helperNames = []
window.helperNames = helperNames

const createHelpers = (helpers) => {
  helpers.forEach(helper => {
    let name = helper.name
    if (window[name]) name = `f${name.charAt(0).toUpperCase()}${name.substring(1)}`
    window[name] = helper
    helperNames.push(name)
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

export { createHelpers }