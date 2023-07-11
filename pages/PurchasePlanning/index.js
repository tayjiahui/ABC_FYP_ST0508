import React from 'react'
import { createRoot } from 'react-dom/client'
import CalendarDisplay from './Calendar'

document.addEventListener('DOMContentLoaded', function() {
  createRoot(document.body.appendChild(document.createElement('div')))
    .render(<CalendarDisplay />)
})