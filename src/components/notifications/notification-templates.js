import React from 'react'
import "./notifications.css"

export const NotificationWithBody = ({ title, body }) => (
  <span>
    {title}<br/>
    <span className='text-light'>{body}</span>
  </span>
)