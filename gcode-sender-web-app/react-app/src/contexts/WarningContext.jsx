import React, { createContext, useContext, useState } from 'react'

const WarningContext = createContext()

export const useWarning = () => {
  const context = useContext(WarningContext)
  if (!context) {
    throw new Error('useWarning must be used within a WarningProvider')
  }
  return context
}

export const WarningProvider = ({ children }) => {
  const [warnings, setWarnings] = useState([])

  const addWarning = (warning) => {
    setWarnings(prev => [...prev, warning])
  }

  const clearWarnings = () => {
    setWarnings([])
  }

  const value = {
    warnings,
    addWarning,
    clearWarnings
  }

  return (
    <WarningContext.Provider value={value}>
      {children}
    </WarningContext.Provider>
  )
}
