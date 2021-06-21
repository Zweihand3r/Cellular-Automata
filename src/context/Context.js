import { createContext, useReducer } from 'react'
import Reducer from './Reducer'

const initialState = {
  rules: [
    { name: 'Conway\'s Life', b: '3',         s: '23' },
    { name: '2x2',            b: '36',        s: '125' },
    { name: '34 Life',        b: '34',        s: '34' },
    { name: 'Amoeba',         b: '357',       s: '1358' },
    { name: 'Anneal',         b: '4678',      s: '35678' },
    { name: 'Assimilation',   b: '345',       s: '4567' },
    { name: 'Coagulations',   b: '378',       s: '235678' },
    { name: 'Coral',          b: '3',         s: '45678' },
    { name: 'Day & Night',    b: '3678',      s: '34678' },
    { name: 'Diamoeba',       b: '35678',     s: '5678' },
    { name: 'Gnarl',          b: '1',         s: '1' },
    { name: 'High Life',      b: '36',        s: '23' },
    { name: 'Inverse Life',   b: '0123478',   s: '34678' },
    { name: 'Life w/ Death',  b: '3',         s: '012345678' },
    { name: 'Long Life',      b: '345',       s: '5' },
    { name: 'Maze',           b: '3',         s: '12345' },
    { name: 'Mazectric',      b: '3',         s: '1234' },
    { name: 'Morley',         b: '368',       s: '245' },
    { name: 'Move',           b: '368',       s: '245' },
    { name: 'Pseudo Life',    b: '357',       s: '238' },
    { name: 'Replicator',     b: '1357',      s: '1357' },
    { name: 'Seeds',          b: '2',         s: '' },
    { name: 'Serviettes',     b: '234',       s: '' },
    { name: 'Stains',         b: '3678',      s: '235678' },
    { name: 'Untitled',       b: '25',        s: '4' },
    { name: 'Walled Cities',  b: '45678',     s: '2345' }
  ],

  shapes: [
    { name: 'Fill', shape: 'fill' },
    { name: 'Clear', shape: 'clear' },
    { name: 'Invert', shape: 'invert' },
    { name: 'Random', shape: 'random' },
    { name: 'Vertical Stripes', shape: 'vstripes' },
    { name: 'Horizontal Stripes', shape: 'hstripes' },
    { name: 'Rectangle', shape: 'rect' },
    { name: 'Checkered', shape: 'checkered' },
    { name: 'Cross', shape: 'cross' },
  ]
}

const Context = createContext(initialState)

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState)
  return (
    <Context.Provider value={{
      rules: state.rules,
      shapes: state.shapes
    }}>
      {children}
    </Context.Provider>
  )
}

export { Context, Provider }