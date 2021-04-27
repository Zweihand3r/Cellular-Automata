import { createContext, useReducer } from 'react'
import Reducer from './Reducer'

const initialState = {
  rules: [
    { name: 'Life', b: '3', s: '23' },
    { name: 'Replicator', b: '1357', s: '1357' },
    { name: 'Seeds', b: '2', s: '' },
    { name: 'Untitled', b: '25', s: '4' },
    { name: 'Life w/ Death', b: '3', s: '012345678' },
    { name: '34 Life', b: '34', s: '34' },
    { name: 'Diamoeba', b: '35678', s: '5678' },
    { name: '2x2', b: '36', s: '125' },
    { name: 'HighLife', b: '36', s: '23' },
    { name: 'Day & Night', b: '3678', s: '34678' },
    { name: 'Morley', b: '368', s: '245' },
    { name: 'Anneal', b: '4678', s: '35678' }
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