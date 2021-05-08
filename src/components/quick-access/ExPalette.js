import { VscChevronLeft, VscChevronRight, VscTrash } from 'react-icons/vsc'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { useState } from 'react'
import { ExCon } from './ex-comps'

const ExPalette = ({ isCurrent, onSelect }) => {
  const [list, setList] = useState([
    { isTint: true, value: '#ffffff' }
  ])

  const updateTint = ({ index, value }) => {
    const updatedList = [...list]
    updatedList[index]['value'] = value
    setList(updatedList)
  }

  const updateSteps = ({ index, value }) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updatedList = [...list]
      updatedList[index]['value'] = parseInt(value)
      setList(updatedList)
    }
  }

  const createGradient = (index) => {
    const g1 = list[index - 1].value
    const g2 = list[index + 1].value
    return `linear-gradient(${g1}, ${g2})`
  }

  const clear = () => setList([
    { isTint: true, value: '#ffffff' }
  ])

  const addTint = () => setList([
    ...list, 
    { isTint: true, value: '#ffffff' }
  ])

  const addGradient = () => setList([
    ...list,
    { isTint: false, value: 20 },
    { isTint: true, value: '#ffffff' }
  ])

  const deleteAtIndex = (index) => {
    if (list.length > 1) {
      const deleteIndices = [index]
      if (index > 0 && !list[index - 1].isTint) deleteIndices.push(index - 1)
      setList(list.filter((_, index) => deleteIndices.indexOf(index) < 0))
    }
  }

  const apply = () => onSelect(generateShades(list))

  return (
    <ExCon title='Palette' isCurrent={isCurrent}>
      <div className='palette-list'>
        {list.map(({ isTint, value }, index) => (
          isTint ? 
          <TintCell color={value} onChange={e => updateTint({ index, value: e.target.value })} onDelete={() => deleteAtIndex(index)} /> : 
          <StepCell steps={value} gradient={createGradient(index)} onChange={value => updateSteps({ index, value })} />
        ))}
      </div>
      <div className='palette-footer'>
        <div className='palette-btn' onClick={clear}>Clear</div>
        <div className='palette-btn' onClick={addTint}>+ Tint</div>
        <div className='palette-btn' onClick={addGradient}>+ Grad</div>
        <div className='palette-btn' onClick={apply}>Apply</div>
      </div>
    </ExCon>
  )
}

const TintCell = ({ color, onChange, onDelete }) => {
  const style = { backgroundColor: color }

  const getAccent = () => {
    const { r, g, b } = hex2rgb(color)
    const bright = (r * 299 + g * 587 + b * 114) / 1000
    return bright < 140 ? '#ffffff' : '#000000'
  }

  const contentStyle = { color: getAccent() }

  return (
    <div className='tint-con' style={style}>
      <div className='tint-icon-con'>
        <IoColorPaletteOutline className='tint-icon center' style={contentStyle} />
        <input className='tint-input' type='color' value={color} onChange={onChange} />
      </div>
      <div className='tint-icon-con tint-trash-con' onClick={onDelete}>
        <VscTrash className='tint-icon center' style={contentStyle} />
      </div>

      <input 
        className='palette-tf tint-tf' type='input' 
        value={color.toUpperCase()} style={contentStyle} 
        onChange={e => {}}
      />
    </div>
  )
}

const StepCell = ({ steps, gradient, onChange }) => {
  const style = { borderImageSource: gradient }
  
  const stepper = (diff) => {
    onChange(`${steps + diff}`)
  }

  return (
    <div className='step-con'>
      <VscChevronLeft className='step-arrow' onClick={_ => stepper(-1)} />
      <VscChevronRight className='step-arrow step-right' onClick={_ => stepper(1)} />

      <input 
        className='palette-tf step-tf' type='input' 
        value={steps} style={style} 
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

const generateShades = (list) => {
  const shades = []

  let index = 0
  while (index < list.length) {
    const { isTint, value } = list[index]

    if (isTint) {
      shades.push(value)
      index += 1
    } else {
      const prev = hex2rgb(list[index - 1].value)
      const next = hex2rgb(list[index + 1].value)
      const steps = value + 1

      const dr = (next.r - prev.r) / steps
      const dg = (next.g - prev.g) / steps
      const db = (next.b - prev.b) / steps

      for (let i = 1; i < steps; i++) {
        shades.push(rgb2hex({ r: prev.r + dr * i, g: prev.g + dg * i, b: prev.b + db * i }))
      }

      shades.push(rgb2hex({ r: next.r, g: next.g, b: next.b }))
      index += 2
    }
  }

  return shades
}

const hex2rgb = (hex) => {
  const bigint = parseInt(hex.substring(1), 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

const rgb2hex = ({ r, g, b }) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7)
}

export default ExPalette