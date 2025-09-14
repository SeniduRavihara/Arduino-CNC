import React, { useEffect } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import About from './components/About'
import ControlPanel from './components/ControlPanel'
import LoadFile from './components/LoadFile'
import Settings from './components/Settings'
import { FileProvider } from './contexts/FileContext'
import { MachineProvider, useMachine } from './contexts/MachineContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { WarningProvider, useWarning } from './contexts/WarningContext'

function AppNavbar() {
  const { isConnected, isBusy, connect, disconnect } = useMachine()
  const { isDark, toggleTheme } = useTheme()
  const location = useLocation()

  const handleConnect = () => {
    connect(undefined, 115200) // Default baud rate
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="d-flex align-items-center">
          <h1 className="navbar-brand">G-Code Sender</h1>
          <div className="navbar-nav">
            <NavLink 
              to="/control" 
              className={`navbar-link ${location.pathname === '/control' ? 'active' : ''}`}
            >
              Control Panel
            </NavLink>
            <NavLink 
              to="/load" 
              className={`navbar-link ${location.pathname === '/load' ? 'active' : ''}`}
            >
              Load File
            </NavLink>
            <NavLink 
              to="/settings" 
              className={`navbar-link ${location.pathname === '/settings' ? 'active' : ''}`}
            >
              Settings
            </NavLink>
            <NavLink 
              to="/about" 
              className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </NavLink>
          </div>
        </div>
        
        <div className="navbar-actions">
          <button onClick={toggleTheme} className="theme-toggle">
            {isDark ? '☀️' : '🌙'}
          </button>
          {!isConnected ? (
            <button 
              onClick={handleConnect}
              disabled={isBusy}
              className={`btn btn-success ${isBusy ? 'loading' : ''}`}
            >
              {isBusy ? '⏳ Connecting...' : '🔌 Connect'}
            </button>
          ) : (
            <button 
              onClick={disconnect}
              disabled={isBusy}
              className="btn btn-danger"
            >
              🔌 Disconnect
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function WarningDisplay() {
  const { warnings, clearWarnings } = useWarning()
  
  if (warnings.length === 0) return null

  return (
    <div className="container mb-3">
      <div className="alert">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {warnings.map((warning, index) => (
              <div key={index}>{warning}</div>
            ))}
          </div>
          <button onClick={clearWarnings} className="btn btn-secondary small">
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Add keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            window.location.hash = '/control'
            break
          case '2':
            e.preventDefault()
            window.location.hash = '/load'
            break
          case '3':
            e.preventDefault()
            window.location.hash = '/settings'
            break
          case '4':
            e.preventDefault()
            window.location.hash = '/about'
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <>
      <AppNavbar />
      <WarningDisplay />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/control" replace />} />
          <Route path="/control" element={<ControlPanel />} />
          <Route path="/load" element={<LoadFile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <WarningProvider>
          <MachineProvider>
            <FileProvider>
              <AppContent />
            </FileProvider>
          </MachineProvider>
        </WarningProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
