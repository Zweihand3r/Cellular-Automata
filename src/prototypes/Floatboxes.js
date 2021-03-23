import { useState, useEffect } from 'react'

import './prototypes.css'

const rows = 24
const columns = 50
const gridCount = rows * columns

const initPop = []
for (let i = 0; i < gridCount; i++) {
  initPop[i] = 1
}

const sequence = []

let updateCounter = 0

const Floatboxes = () => {
  const [pop, setPop] = useState(initPop)

  const updateLoop = () => {
    setTimeout(() => {
      _setPop((index) => {
        return Math.random() > .5 ? 1 : 0
      })

      updateLoop()
    }, 480)
  }

  const _setPop = (fillRule) => {
    setPop(filler(fillRule))
  }

  const filler = (fillRule) => {
    const pop = []
    for (let i = 0; i < gridCount; i++) {
      pop[i] = fillRule(i)
    }

    return pop
  }

  const getCoords = (index) => {
    return { 
      x: index % columns, 
      y: Math.floor(index / columns) 
    }
  }

  const getIndex = (x, y) => {
    return y * columns + x
  }

  const getMidCoords = () => {
    const midCoords = []
    const midXs = []
    const midYs = []

    if (columns % 2 === 0) {
      midXs.push(columns / 2 - 1, columns / 2)
    } else {
      midXs.push((columns - 1) / 2)
    }

    if (rows % 2 === 0) {
      midYs.push(rows / 2 - 1, rows / 2)
    } else {
      midYs.push((rows - 1) / 2)
    }

    midXs.forEach((x) => {
      midYs.forEach((y) => {
        midCoords.push({ x, y })
      })
    })
    
    return midCoords
  }

  const getMidIndices = () => {
    const midIndices = []
    const midCoords = getMidCoords()

    midCoords.forEach(({ x, y }) => {
      midIndices.push(getIndex(x, y))
    })

    return midIndices
  }

  const init = () => {
    const pop = filler(() => 0)
    const midIndices = getMidIndices()
    const midCoords = getMidCoords()
    
    const side = Math.max(rows, columns)
    const max = Math.floor(side)
    
    sequence.push(midCoords)

    for (let index = 1; index < max; index++) {
      
    }

    const test = [...midIndices]

    test.forEach((index) => {
      pop[index] = 1
    })

    setPop(pop)
  }

  // useEffect(updateLoop, [null])
  useEffect(init, [null])

  return (
    <div className='prot-cont fill'>
      {pop.map((status, index) => (<Cell key={index} status={status} />))}
    </div>
  )
}

const Cell = ({ status }) => {
  const contentStyle = { transform: `scale(${status})` }

  return (
    <div className='cell'>
      <div className='cell-content' style={contentStyle} />
    </div>
  )
}

export default Floatboxes