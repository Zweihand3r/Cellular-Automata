import { HiOutlineAdjustments } from 'react-icons/hi'
import { IoChevronUp } from 'react-icons/io5'

import { useState, useEffect, useRef, useContext } from 'react'
import { DataContext } from '../../context/DataContext'

import { ExCon, ExHexButton, ExSubTitle } from './ex-comps'

const ExShapes = ({ isCurrent, onShapeSelect, onFillSelect, onClear, onSliding }) => {
  const [isShapes, setIsShapes] = useState(true)
  const { shapes, fillers } = useContext(DataContext)

  const className = `shape-con ${isShapes ? '' : 'shape-up'}`

  return (
    <ExCon title='Patterns' isCurrent={isCurrent}>
      <div className={className}>
        <Fillers fillers={fillers} onSelect={onFillSelect} onSliding={onSliding} />

        <div className='shape-mid'>
          <ExHexButton name='Clear'   x={1}   y={6} onClick={onClear} />
          <ExHexButton name='Invert'  x={159} y={6} onClick={() => onFillSelect('invert')} />

          <MidIndic y={4} visible={!isShapes} onClick={_ => setIsShapes(true)} paths={[
            'M 1 1 L 10 12 L 19 1', 'M 0 0 L 20 0'
          ]} />

          <MidIndic y={17} visible={isShapes} onClick={_ => setIsShapes(false)} paths={[
            'M 1 12 L 10 1 L 19 12', 'M 0 13 L 20 13'
          ]} />
        </div>

        <Shapes shapes={shapes} onSelect={onShapeSelect} />
      </div>
    </ExCon>
  )
}

const Shapes = ({ shapes, onSelect }) => {
  return (
    <div className='shape-list'>
      <div className='shape-info'>
        The patterns listed below are meant to be used in<br/>
        conjuction with <b>Conway's Life (B3-S23)</b> rule.
      </div>
      {shapes.map(({ name, shapes }, icat) => (
        <div key={icat}>
          <div className='shape-item-pad' />
          <ExSubTitle subtitle={name} width={132 - name.length * 2} isScrollable={true} />

          {shapes.map(({ name, shape }, ishape) => (
            <div className='sc-con' key={ishape} onClick={() => onSelect(shape)} >
              <div className='sc-lbl center'>{name}</div>
            </div>
          ))}
        </div>
      ))}

    </div>
  )
}

const Fillers = ({ fillers, onSelect, onSliding }) => {
  const [currentIndex, setCurrentIndex] = useState(-1)

  const exAction = (index) => setCurrentIndex(index === currentIndex ? -1 : index)

  return (
    <div className='shape-list'>
      <div className='shape-item-pad' />

      {fillers.map(({ name, fill, config }, index) =>
        <FillCell 
          key={index}
          name={name} 
          config={config} 
          ex={currentIndex === index} 
          onSelect={args => onSelect(fill, args)} 
          onSliding={onSliding}
          onExpanded={() => exAction(index)}
        />)}
    </div>
  )
}

const FillCell = ({ name, config, ex, onSelect, onSliding, onExpanded }) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const args = useRef(config.map(({init}) => init))

  const style = {
    height: ex ? 32 + 24 * config.length : 30,
    backgroundColor: pressed && !ex ? '#ffffff' : '#00000000',
    color: ex || pressed ? '#000000' : (hovered ? '#ffffff' : '#a2a2a2'),
    borderColor: ex ? '#a2a2a2' : (hovered ? '#ffffff' : '#00000000')
  }

  const configAction = e => {
    e.stopPropagation()
    onExpanded()
  }

  const moded = (value, index) => {
    args.current[index] = value
    onSelect(args.current)
  }

  const select = () => onSelect(args.current)
  
  const labelClass = `fc-lbl-con ${ex ? 'fc-lbl-con-ex' : ''}`
  const iconClass = `fc-icon ${ex ? 'fc-icon-ex' : `${hovered ? '' : 'fc-icon-hid'}`}`

  return (
    <div 
      className='fc-con' 
      style={style} 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <div className={labelClass} onClick={select}>
        <div className='fc-lbl center'>{name}</div>
      </div>
      
      {ex ? 
      <IoChevronUp className={iconClass} onClick={configAction} /> :
      <HiOutlineAdjustments className={iconClass} onClick={configAction} onMouseDown={e => e.stopPropagation()} />}

      <div className='fc-ex'>
        {config.map(({ name, init, range }, index) => <FSlide 
          key={index}
          name={name} init={init} range={range} 
          onChange={(value) => moded(value, index)}
          onDown={() => onSliding(true)}
          onUp={() => onSliding(false)} 
        />)}
      </div>
    </div>
  )
}

const FSlide = ({ name, init, range, onChange, onDown, onUp }) => {
  const [hov, setHov] = useState(false)
  const [value, setValue] = useState(1)

  const slideAction = e => {
    const v = parseInt(e.target.value)
    setValue(v)
    onChange(v)
  }

  useEffect(() => {
    setValue(init)
  }, [])

  const slideClass = `fslide ${hov ? 'fslide-hov' : ''}`

  return (
    <div className='fslide-con'>
      <div className='fslide-lbl'>{name} (<b>{value}</b>)</div>
      <input 
        className={slideClass} 
        type='range'
        value={value}
        step={1}
        min={range[0]} max={range[1]}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onChange={slideAction}
      ></input>
      {/* <div className='fslide-val'>{value}</div> */}
    </div>
  )
}

const MidIndic = ({ paths, visible, y, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const mouseLeave = _ => {
    setHovered(false)
    setPressed(false)
  }

  const fill = pressed ? '#fff' : '#00000000'
  const stroke = hovered ? '#fff' : '#a2a2a2'
  const className = `mi-con ${visible ? '' : 'mi-not'}`

  return (
    <div
      className={className}
      style={{top: y}}
      onClick={onClick}
      onMouseEnter={_ => setHovered(true)}
      onMouseLeave={mouseLeave}
      onMouseDown={_ => setPressed(true)}
      onMouseUp={_ => setPressed(false)}
    >
      <svg className='mi-svg'>
        <path d={paths[0]} strokeWidth={1.5} stroke={stroke} fill={fill} />
        <path d={paths[1]} strokeWidth={2.5} stroke={stroke} />
      </svg>
    </div>
  )
}

export default ExShapes