import React, { useState } from 'react'
import './splash.css'

const Splash = ({ isMobile, onDismiss }) => {
  const [outPhase, setOutPhase] = useState(false)

  const animEnded = e => {
    if (e.animationName === 'start-out-p2-anim') {
      onDismiss()
    }
  }

  if (isMobile) {
    return (
      <MobileSplash
        onDismiss={onDismiss}
      />
    )
  }

  return (
    <div className='splash-root'>
      <div
        className={`s-start ${outPhase && 's-start-out'}`}
        onClick={() => setOutPhase(true)}
        onAnimationEnd={animEnded}
      >
        <div className={`${outPhase && 's-s-label-out'}`}>
          S T A R T
        </div>
      </div>
    </div>
  )
}

const MobileSplash = ({ onDismiss }) => {
  const [outPhase, setOutPhase] = useState(false)

  const animEnded = e => {
    if (e.animationName === 'fade-out-anim') {
      onDismiss()
    }
  }

  return (
    <div
      className={`splash-root ${outPhase && 'fade-out'}`}
      onClick={() => setOutPhase(true)}
      onAnimationEnd={animEnded}
    >
      <div className='sm-con'>
        <div className='sm-item sm-touch'>
          <div className='sm-t-con'>
            <div className='sm-t-outer sm-hold-outer' />
            <div className='sm-t-inner sm-hold-inner' />
          </div>

          Tap and Hold to bring up Mode Selection
        </div>
        <div className='sm-item sm-swipe'>
          <div className='sm-t-con sm-swipe-con'>
            <div className='sm-t-outer sm-swipe-outer' />
            <div className='sm-t-inner sm-swipe-inner' />
          </div>

          Swipe up from the bottom of the screen to bring up Options Menu
        </div>
        <div className='sm-item sm-start'>
          Tap to Start
        </div>
      </div>
    </div>
  )
}

export default Splash