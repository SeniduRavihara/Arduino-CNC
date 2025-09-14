import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

const defaultSettings = {
  workspace_baud: 115200,
  workspace_show_estop: true,
  workspace_show_home: true,
  workspace_show_zero: true,
  workspace_show_spindle: true
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings)

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('gcodeSettings')
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('gcodeSettings', JSON.stringify(updatedSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('gcodeSettings')
  }

  const value = {
    settings,
    saveSettings,
    resetSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
