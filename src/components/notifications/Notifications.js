import { useState, useEffect } from 'react'
import "./notifications.css"

const AUTO_HIDE_DELAY = 5000

let tid

// message => string | JSX

const Notifications = ({ message, timeout, messageIndex }) => {
  const [show, setShow] = useState(false)
  const [outPhase, setOutPhase] = useState(false)

  const animEnded = e => {
    if (e.animationName === "fade-out-anim") {
      setShow(false)
      setOutPhase(false)
    }
  }

  useEffect(() => {
    if (message) {
      if (!show) {
        setShow(true)
      }

      if (outPhase) {
        setOutPhase(false)
      }
      
      if (tid) {
        clearTimeout(tid)
      }
      tid = setTimeout(() => {
        setOutPhase(true)
        tid = undefined
      }, timeout * 1000 || AUTO_HIDE_DELAY)

      return () => {
        if (tid) {
          clearTimeout(tid)
        }
      }
    } else {
      setShow(false)
      setOutPhase(false)
    }
  }, [message, messageIndex])

  return (
    <div>
      {show && (
        <div className='notification-container'>
          <div 
            className={`notification-bubble ${outPhase && 'bubble-out'}`}
            onAnimationEnd={animEnded}
          >
            {message}
          </div>
        </div>
      )}
    </div>
  )
}

export const RuleNotification = ({ b, s, highlightS }) => (
  <div>
    <span className={highlightS ? "text-dim" : ""}>B{b}</span>{" "}
    <span className={!highlightS ? "text-dim" : ""}>S{s}</span>
  </div>
)

export default Notifications