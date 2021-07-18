import { HiOutlineAdjustments } from 'react-icons/hi'
import { IoChevronUp } from 'react-icons/io5'

import { useState, useEffect, useRef, useContext } from 'react'
import { Context } from '../../context/Context'

import { ExCon, ExSubTitle } from './ex-comps'

const ExShapes = ({ isCurrent, onShapeSelect, onFillSelect, onSliding }) => {
  const [isShapes, setIsShapes] = useState(true)
  const { shapes, fillers } = useContext(Context)

  const className = `shape-con ${isShapes ? '' : 'shape-up'}`

  return (
    <ExCon title='Patterns' isCurrent={isCurrent}>
      <div className={className}>
        <Shapes shapes={shapes} onSelect={onShapeSelect} />

        <div className='shape-mid'>
          <MidButton name='Clear'   x={1}   y={6} onClick={() => onFillSelect('clear')} />
          <MidButton name='Invert'  x={159} y={6} onClick={() => onFillSelect('invert')} />

          <MidIndic y={4} visible={!isShapes} onClick={_ => setIsShapes(true)} paths={[
            'M 1 1 L 10 12 L 19 1', 'M 0 0 L 20 0'
          ]} />

          <MidIndic y={17} visible={isShapes} onClick={_ => setIsShapes(false)} paths={[
            'M 1 12 L 10 1 L 19 12', 'M 0 13 L 20 13'
          ]} />
        </div>

        <ExSubTitle subtitle='DYNAMIC' width={120} />
        <Fillers fillers={fillers} onSelect={onFillSelect} onSliding={onSliding} />
      </div>
    </ExCon>
  )
}

const Shapes = ({ shapes, onSelect }) => {
  return (
    <div className='shape-l1 shape-scroll'>
      {shapes.map(({ name, shapes }, icat) => (
        <div key={icat}>
          <div className='shape-item-pad' />
          <ExSubTitle subtitle={name} width={132 - name.length * 2} isScrollable={true} />

          {shapes.map(({ name, shape }, ishape) => (
            <div className='sc-con' key={ishape} onClick={() => onSelect(shape)} >{name}</div>
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
    <div className='shape-l2 shape-scroll'>
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

      <div className='shape-item-pad' />
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
  
  const labelClass = `fc-lbl ${ex ? 'fc-lbl-ex' : ''}`
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
      <div className={labelClass} onClick={select}>{name}</div>
      
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

const MidButton = ({ name, x, y, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const mouseLeave = _ => {
    setHovered(false)
    setPressed(false)
  }

  const fill = pressed ? '#fff' : '#00000000'
  const stroke = hovered ? '#fff' : '#a2a2a2'
  const textStyle = { color: pressed ? '#000' : stroke }

  return (
    <div
      className='mb-con'
      style={{left: x, top: y}}
      onMouseEnter={_ => setHovered(true)}
      onMouseLeave={mouseLeave}
      onMouseDown={_ => setPressed(true)}
      onMouseUp={_ => setPressed(false)}
      onClick={onClick}
    >
      <svg className='mb-svg'>
        <path d='M 0 13 L 10 0 L 134 0 L 144 13 L 134 26 L 10 26 Z' fill={fill} />
        <path d='M 1 13 L 10 0 M 133 0 L 142 13 L 133 26 M 10 26 L 0 13' strokeWidth={1.5} stroke={stroke} fill='#00000000' />
        <path d='M 10 0 L 134 0 M 133 26 L 10 26' strokeWidth={2.5} stroke={stroke} />
      </svg>
      <div className='fb-lbl center' style={textStyle}>{name}</div>
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