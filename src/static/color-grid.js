const COLOR_GRID = []

const hsl2rgb = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const kStep = 100 / 17
for (let k = 0; k < 17; k++) {
  COLOR_GRID.push(hsl2rgb(0, 0, k * kStep))
}
COLOR_GRID.push("#ffffff")

const iStep = 360 / 16
const jStep = 80 / 18
for (let i = 0; i < 16; i++) {
  for (let j = 0; j < 18; j++) {
    COLOR_GRID.push(hsl2rgb(i * iStep, 100, 10 + j * jStep))
  }
}

export default COLOR_GRID