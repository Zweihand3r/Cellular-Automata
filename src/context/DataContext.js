import { createContext, useState } from 'react'

import shapes from '../static/shapes.json'

let gridW = Math.floor(window.innerWidth / 5)
let gridH = Math.floor(window.innerHeight / 5)

const rules = [
  { name: 'Conway\'s Life', b: '3',       s: '23' },
  { name: '2x2',            b: '36',      s: '125' },
  { name: '34 Life',        b: '34',      s: '34' },
  { name: 'Amoeba',         b: '357',     s: '1358' },
  { name: 'Anneal',         b: '4678',    s: '35678' },
  { name: 'Assimilation',   b: '345',     s: '4567' },
  { name: 'Coagulations',   b: '378',     s: '235678' },
  { name: 'Coral',          b: '3',       s: '45678' },
  { name: 'Day & Night',    b: '3678',    s: '34678' },
  { name: 'Diamoeba',       b: '35678',   s: '5678' },
  { name: 'Gnarl',          b: '1',       s: '1' },
  { name: 'High Life',      b: '36',      s: '23' },
  { name: 'Inverse Life',   b: '0123478', s: '34678' },
  { name: 'Life w/ Death',  b: '3',       s: '012345678' },
  { name: 'Long Life',      b: '345',     s: '5' },
  { name: 'Maze',           b: '3',       s: '12345' },
  { name: 'Mazectric',      b: '3',       s: '1234' },
  { name: 'Morley',         b: '368',     s: '245' },
  { name: 'Move',           b: '368',     s: '245' },
  { name: 'Pseudo Life',    b: '357',     s: '238' },
  { name: 'Replicator',     b: '1357',    s: '1357' },
  { name: 'Seeds',          b: '2',       s: '' },
  { name: 'Serviettes',     b: '234',     s: '' },
  { name: 'Stains',         b: '3678',    s: '235678' },
  { name: 'Untitled',       b: '25',      s: '4' },
  { name: 'Walled Cities',  b: '45678',   s: '2345' }
]

const constructFillers = () => {
  return [
    { name: 'Chaotic Random', fill: 'random', config: [
      { name: 'Density', init: 50, range: [1, 99] }
    ]},
    { name: 'Ordered Random', fill: 'wraplines', config: [
      { name: 'Offset A', init: Math.floor(gridW / 20), range: [1, Math.floor(gridW / 2)] },
      { name: 'Offset B', init: Math.floor(gridW / 15), range: [1, Math.floor(gridW / 2)] }
    ]},
    { name: 'Vertical Stripes', fill: 'vstripes', config: [
      { name: 'Spacing', init: 1, range: [1, Math.floor(gridW / 2)] },
      { name: 'Thickness', init: 1, range: [1, Math.floor(gridW / 2)] }
    ]},
    { name: 'Horizontal Stripes', fill: 'hstripes', config: [
      { name: 'Spacing', init: 1, range: [1, Math.floor(gridH / 2)] } ,
      { name: 'Thickness', init: 1, range: [1, Math.floor(gridH / 2)] }
    ]},
    { name: 'Diagonal Stripes', fill: 'dstripes', config: [
      { name: 'Spacing', init: 5, range: [1, Math.floor(Math.min(gridW, gridH) / 2)] },
      { name: 'Thickness', init: 2, range: [1, Math.floor(Math.min(gridW, gridH) / 2)] }
    ]},
    { name: 'Rectangle', fill: 'rect', config: [
      { name: 'Width', init: gridW, range: [2, gridW] }, 
      { name: 'Height', init: gridH, range: [2, gridH] }
    ]},
    { name: 'Checkered', fill: 'checkered', config: [
      { name: 'Width', init: 4, range: [1, Math.floor(gridW / 2)] },
      { name: 'Height', init: 4, range: [1, Math.floor(gridH / 2)] }
    ]},
    { name: 'Cross', fill: 'cross', config: [
      { name: 'X Offset', init: 0, range: [-gridW / 2, gridW / 2 - (1 - gridW % 2)] }, // -1 if gridW is even
      { name: 'Y Offset', init: 0, range: [-gridH / 2, gridH / 2 - (1 - gridH % 2)] }, 
      { name: 'Width', init: 1, range: [1, gridW / 2] }, 
      { name: 'Height', init: 1, range: [1, gridW / 2] }, 
    ]},
    { name: 'Mesh', fill: 'mesh', config: [
      { name: 'X Spacing', init: 5, range: [1, Math.floor(gridW / 2)] },
      { name: 'Y Spacing', init: 5, range: [1, Math.floor(gridH / 2)] },
      { name: 'X Thickness', init: 1, range: [1, Math.floor(gridW / 2)] },
      { name: 'X Thickness', init: 1, range: [1, Math.floor(gridH / 2)] }
    ]},
  ]
}

const fillers = constructFillers()

const contextState = { gridW, gridH, rules, shapes, fillers }
const DataContext = createContext(contextState)

const DataProvider = ({ children }) => {
  const [state, setState] = useState(contextState)

  const setDimensions = (_gridW, _gridH) => {
    gridW = _gridW; gridH = _gridH
    setState({ ...state, fillers: constructFillers() })
  }

  return (
    <DataContext.Provider value={{ ...state, setDimensions }}>
      {children}
    </DataContext.Provider>
  )
}

export { DataContext, DataProvider }