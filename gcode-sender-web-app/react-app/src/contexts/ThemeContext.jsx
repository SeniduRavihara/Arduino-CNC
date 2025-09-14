import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  // Load theme from localStorage or system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('gcodeTheme')
      if (savedTheme) {
        setIsDark(savedTheme === 'dark')
      } else {
        // Check system preference
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
  }, [])

  // Apply theme class to body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('gcodeTheme', newTheme ? 'dark' : 'light')
  }

  const setTheme = (theme) => {
    const isDarkTheme = theme === 'dark'
    setIsDark(isDarkTheme)
    localStorage.setItem('gcodeTheme', theme)
  }

  const value = {
    isDark,
    toggleTheme,
    setTheme,
    theme: isDark ? 'dark' : 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
