import { VscChevronLeft, VscChevronRight, VscTrash } from 'react-icons/vsc'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { useState, useRef, useEffect } from 'react'
import { ExSubTitle } from '../ex-comps'

let animActive = false, scrollListenerAttached = false
let lastApplied = { isLoop: false, list: [{ isTint: true, value: '#ffffff', outId: '' }] }

const ExPalette = ({ isCurrent, onSelect }) => {
  const [list, setList] = useState([
    { isTint: true, value: '#ffffff', outId: '' }
  ])

  const [isLoop, setIsLoop] = useState(false)
  const [scrollAtEnd, setScrollAtEnd] = useState(false)

  const listRef = useRef(null)

  const updateTint = ({ index, value }) => {
    const updatedList = [...list]
    updatedList[index]['value'] = value
    setList(updatedList)
  }

  const updateSteps = ({ index, value }) => {
    if (/^\d*\.?\d*$/.test(value) && value.length < 5) {
      const updatedList = [...list]
      updatedList[index]['value'] = value === '' ? 0 : parseInt(value)
      setList(updatedList)
    }
  }

  const createGradient = (index) => {
    const g1 = list[index - 1] ? list[index - 1].value : '#ffffff'
    const g2 = list[index + 1] ? list[index + 1].value : '#ffffff'
    return `linear-gradient(${g1}, ${g2})`
  }

  const scrollToEnd = _ => {
    setTimeout(_ => {
      listRef.current.scroll({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }, 60)
  }

  const scrollListener = () => {
    setScrollAtEnd(listRef.current.scrollTop < listRef.current.scrollHeight - listRef.current.clientHeight)
  }

  /* --- Footer Actions --- */

  const clear = () => {
    listRef.current.scrollTop = listRef.current.scrollHeight
    setList([{ isTint: true, value: '#ffffff', outId: '' }])
    setIsLoop(false)
  }

  const reset = () => {
    listRef.current.scrollTop = listRef.current.scrollHeight
    setIsLoop(lastApplied.isLoop)

    /* 
     * --- Some Bizarre react bug (Or prolly me being ignorant of how react works) ---
     * 
     * The following lines seem to set a reference of lastApplied.list to list instead of setting a copy of the lastApplied.list:
     * setList(lastApplied.list) -> This seems obvious
     * setList([...lastApplied.list]) -> Isnt this supposed to create a new array with elements of lastApplied.list?
     * setList(lastApplied.list.slice()) -> Isnt this supposed to create a copy of lastApplied.list?
     * setList(lastApplied.list.map(item => item)) -> Again isnt this supposed to be a completely new array?
     * Seriously WTF is going on?
     * - Could be cause Im not using useRef to store lastApplied. NEED TO TEST.
     * 
     * Only the line below seems to create a copy. I could really use some explaination on this.
     */
    setList(lastApplied.list.map(({ isTint, value, outId }) => ({ isTint, value, outId })))
  }

  const addTint = () => {
    if (!animActive) {
      setList([...list, { isTint: true, value: '#ffffff', outId: '' }])
      scrollToEnd()
    }
  }

  const addGradient = () => {
    if (!animActive) {
      animActive = true

      const _list = [...list, { isTint: false, value: 20, outId: '' }]
      setList(_list)

      setTimeout(_ => {
        setList([..._list, { isTint: true, value: '#ffffff', outId: '' }])
        scrollToEnd()
        animActive = false
      }, 60)
    }
  }

  const addLoop = () => setIsLoop(!isLoop)

  const deleteQueuedAtIndex = index => {
    if (list.length > 1 && !animActive) {
      const deleteIndices = [index]
      if (index > 0 && !list[index - 1].isTint) {
        deleteIndices.push(index - 1)
      } else if (index == 0 && !list[index + 1].isTint) {
        deleteIndices.push(index + 1)
      }

      const _list = [...list]
      _list[deleteIndices[0]].outId = 'pc-out'
      if (deleteIndices.length > 1) {
        _list[deleteIndices[1]].outId = 'pc-out'
      }
      setList(_list)
    }
  }

  const deleteAtIndex = () => {
    setList(list.filter(({ outId }) => outId != 'pc-out'))
  }

  const apply = () => {
    lastApplied = { isLoop, list }
    onSelect({ isLoop, shades: generateShades(list)})
  }

  useEffect(() => {
    if (isCurrent) {
      reset()
    
      if (!scrollListenerAttached) {
        listRef.current.addEventListener('scroll', scrollListener)
        scrollListenerAttached = true
      }
    }
    return () => {
      if (scrollListenerAttached) {
        listRef.current.removeEventListener('scroll', scrollListener)
        scrollListenerAttached = false
      }
    }
  }, [isCurrent])

  const isScrollable = list.length > 8

  return (
    <div className='ex-pg ex-pg2'>
      <div className='palette-list' ref={listRef}>
        {isLoop ? <LoopCell isStart={true} isScrollable={isScrollable} /> : <div />}

        {list.map(({ isTint, outId, value }, index) => (
          isTint ? 
          <TintCell 
            key={index}
            color={value} outId={outId}
            isScrollable={isScrollable}
            onChange={v => updateTint({ index, value: v })} 
            onDeleteQueue={_ => deleteQueuedAtIndex(index)}
            onDeleteFinish={_ => deleteAtIndex(index)}
          /> : 
          <StepCell 
            key={index}
            steps={value} outId={outId}
            isScrollable={isScrollable}
            gradient={createGradient(index)} 
            onChange={value => updateSteps({ index, value })} 
          />
        ))}

        {isLoop ? <LoopCell isStart={false} isScrollable={isScrollable} /> : <div />}

        {list.length > 1 ? <div />:
        <div className='palette-info'><i>Color mode will be converted to Mono on </i><b>Apply</b>.<br/>
        <i>To use Age Based color mode add at least one </i><b>Color</b> <i>or</i> <b>Gradient</b> <i>from the</i> <b>Add</b> <i>menu</i></div>}

        <div style={{ height: isScrollable ? 65 : 0 }} />
      </div>

      <Footer 
        hasBg={isScrollable && scrollAtEnd}
        isLoop={isLoop}
        onClear={clear} onReset={reset} onApply={apply}
        onAddGradient={addGradient} onAddTint={addTint} onAddLoop={addLoop}
      />
    </div>
  )
}

const Footer = ({ 
  hasBg, isLoop,
  onClear, onReset, onApply,
  onAddTint, onAddGradient, onAddLoop 
}) => {
  const [isAdd, setIsAdd] = useState(false)

  const className = `palette-footer ${hasBg ? 'pf-bg' : ''}`
  const loopName = `${isLoop ? '-' : '+'} Loop`

  return (
    <div className={className}>
      <FooterButton name='+ Add' isControl={true} isIn={!isAdd} x={100} onClick={_ => setIsAdd(true)} />
      <FooterButton name='Clear' isControl={true} isIn={!isAdd} x={1} y={22} onClick={onClear} />
      <FooterButton name='Reset' isControl={true} isIn={!isAdd} x={199} y={21} onClick={onReset} />
      <FooterButton name='Apply' isControl={true} isIn={!isAdd} x={100} y={37} onClick={onApply} />

      <FooterButton name='< Controls' isControl={false} isIn={isAdd} x={100} onClick={_ => setIsAdd(false)} />
      <FooterButton name='+ Color'    isControl={false} isIn={isAdd} x={1} y={22} onClick={onAddTint} />
      <FooterButton name='+ Gradient' isControl={false} isIn={isAdd} x={199} y={21} onClick={onAddGradient} />
      <FooterButton name={loopName}   isControl={false} isIn={isAdd} x={100} y={37} onClick={onAddLoop} />
    </div>
  )
}

const FooterButton = ({ name, isControl, isIn, x, y, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const fill = pressed ? '#fff' : '#00000000'
  const stroke = hovered ? '#fff' : '#a2a2a2'
  const textStyle = { color: pressed ? '#000' : stroke }

  const id = isControl ? 1 : 2
  const className = `fb-con fb-${id}-${isIn ? 'in' : 'out'}`

  const mouseLeave = _ => {
    setHovered(false)
    setPressed(false)
  }

  return (
    <div 
      className={className}
      style={{left: x, top: y}}
      onClick={onClick}
      onMouseEnter={_ => setHovered(true)}
      onMouseLeave={mouseLeave}
      onMouseDown={_ => setPressed(true)}
      onMouseUp={_ => setPressed(false)}
    >
      <svg className='fb-svg'>
        <path d='M 0 13 L 10 0 L 94 0 L 104 13 L 94 26 L 10 26 Z' fill={fill} />
        <path d='M 1 13 L 10 0 M 93 0 L 103 13 L 93 26 M 10 26 L 0 13' strokeWidth={1.5} stroke={stroke} fill='#00000000' />
        <path d='M 10 0 L 94 0 M 93 26 L 10 26' strokeWidth={2.5} stroke={stroke} />
      </svg>
      <div className='fb-lbl center' style={textStyle}>{name}</div>
    </div>
  )
}

const TintCell = ({ color, isScrollable, outId, onChange, onDeleteQueue, onDeleteFinish }) => {
  const [hex, setHex] = useState('#FFFFFF')

  const getAccent = () => {
    const { r, g, b } = hex2rgb(color)
    const bright = (r * 299 + g * 587 + b * 114) / 1000
    return bright < 140 ? '#ffffff' : '#000000'
  }

  const animEnded = event => {
    if (event.animationName == 'pc-out-anim') {
      onDeleteFinish()
    }
  }

  const updateHex = e => {
    const text = e.target.value
    if (text.indexOf('#') < 0) {
      setHex(`#${text}`)
    } else if (text.length > hex.length && text.length < 8) {
      if (/^[0-9A-Fa-f]+$/.test(text.substring(1))) setHex(text)
      if (text.length === 7) onChange(text)
    } else if (text.length < hex.length && text.length > 0) {
      setHex(text)
    }
  }

  const editingComplete = () => {
    let _hex = hex
    const padding = 7 - _hex.length
    for (let i = 0; i < padding; i++) {
      _hex += "0"
    }
    setHex(_hex)
    onChange(_hex)
  }

  useEffect(() => setHex(color), [color])

  const style = { backgroundColor: color }
  const contentStyle = { color: getAccent() }
  const className = `tint-con pc-${isScrollable ? 'scrl' : 'con'} ${outId}`

  return (
    <div className={className} style={style} onAnimationEnd={animEnded}>
      <div className='tint-icon-con'>
        <IoColorPaletteOutline className='tint-icon center' style={contentStyle} />
        <input className='tint-input' type='color' value={color} onChange={e => onChange(e.target.value)} />
      </div>
      <div className='tint-icon-con tint-trash-con' onClick={onDeleteQueue}>
        <VscTrash className='tint-icon center' style={contentStyle} />
      </div>

      <input 
        className='palette-tf tint-tf' type='input' 
        value={hex.toUpperCase()} style={contentStyle} 
        onChange={updateHex} onBlur={editingComplete}
      />
    </div>
  )
}

const StepCell = ({ steps, isScrollable, outId, gradient, onChange }) => {
  const style = { borderImageSource: gradient }
  
  const stepper = (diff) => {
    onChange(`${steps + diff}`)
  }

  const className = `step-con pc-${isScrollable ? 'scrl' : 'con'} ${outId}`

  return (
    <div className={className}>
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

const LoopCell = ({ isStart, isScrollable }) => <ExSubTitle 
  subtitle={`LOOP ${isStart ? 'START' : 'END'}`} 
  width={isStart ? 118 : 122} isScrollable={isScrollable}
/>

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