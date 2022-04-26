import { createContext, useState } from "react"
import Notifications from "../components/notifications/Notifications"

const NotificationContext = createContext({})

const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("")
  const [timeout, setTimeout] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)

  const showNotification = (message, timeout = 0) => {
    setMessage(message)
    setTimeout(timeout)
    setMessageIndex(pv => pv + 1)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notifications 
        message={message} 
        timeout={timeout}
        messageIndex={messageIndex} 
      />
    </NotificationContext.Provider>
  )
}

export { NotificationContext, NotificationProvider }