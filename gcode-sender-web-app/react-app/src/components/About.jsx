import React from 'react'

const About = () => {
  return (
    <div className="container animate-fade-in">
      <div className="card-modern" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header-modern">
          <h2 className="text-xl font-semibold text-primary">About G-Code Sender</h2>
        </div>
        <div className="card-body-modern" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">What is this?</h3>
            <p className="text-secondary">
              <strong>G-Code Sender</strong> is a React web application capable of sending{' '}
              <a 
                href="http://en.wikipedia.org/wiki/Gcode" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary"
                style={{ textDecoration: 'underline' }}
              >
                G-code
              </a>{' '}
              commands to a USB G-code interpreter (hobby CNC machines / 3D printers) using the Web Serial API.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Why React?</h3>
            <p className="text-secondary">
              This React version provides a modern, component-based architecture that's easier to maintain
              and extend. It uses the same Web Serial API for communication but with a more modular design
              using React Context for state management.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Keyboard Shortcuts</h3>
            <p className="text-secondary mb-4">The control panel supports the following keyboard shortcuts:</p>
            <div className="font-monospace small" style={{ 
              background: 'var(--bg-tertiary)', 
              padding: 'var(--space-lg)', 
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)'
            }}>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>←</kbd>
                <span className="text-muted">,</span>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>j</kbd>
                <span className="text-secondary">- jog X axis -N</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>→</kbd>
                <span className="text-muted">,</span>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>l</kbd>
                <span className="text-secondary">- jog X axis +N</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>↓</kbd>
                <span className="text-muted">,</span>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>k</kbd>
                <span className="text-secondary">- jog Y axis -N</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>↑</kbd>
                <span className="text-muted">,</span>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>i</kbd>
                <span className="text-secondary">- jog Y axis +N</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>z</kbd>
                <span className="text-secondary">- jog Z axis -N</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>a</kbd>
                <span className="text-secondary">- jog Z axis +N</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>+</kbd>
                <span className="text-secondary">- increment jump size by 10x</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>-</kbd>
                <span className="text-secondary">- decrement jump size by 10x</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>3</kbd>
                <span className="text-secondary">- spindle clockwise</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>4</kbd>
                <span className="text-secondary">- spindle counter-clockwise</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>5</kbd>
                <span className="text-secondary">- spindle off</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>/</kbd>
                <span className="text-secondary">- focus command input</span>
              </div>
              <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
                <kbd style={{ 
                  padding: 'var(--space-xs) var(--space-sm)', 
                  background: 'var(--bg-card)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)'
                }}>Esc</kbd>
                <span className="text-secondary">- blur command input</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Libraries Used</h3>
            <ul style={{ 
              listStyle: 'disc', 
              listStylePosition: 'inside', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-xs)' 
            }} className="text-secondary">
              <li><strong>React</strong> - Modern JavaScript library for building user interfaces</li>
              <li><strong>React Router</strong> - Client-side routing</li>
              <li><strong>CSS Variables</strong> - Modern CSS custom properties for theming</li>
              <li><strong>Paper.js</strong> - Canvas rendering library (for G-code visualization)</li>
              <li><strong>Web Serial API</strong> - Browser API for serial communication</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Browser Compatibility</h3>
            <p className="text-secondary mb-2">
              This application requires a browser that supports the Web Serial API. Currently supported browsers include:
            </p>
            <ul style={{ 
              listStyle: 'disc', 
              listStylePosition: 'inside', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-xs)' 
            }} className="text-secondary">
              <li>Chrome 89+ (desktop)</li>
              <li>Edge 89+ (desktop)</li>
              <li>Opera 75+ (desktop)</li>
            </ul>
            <div style={{ 
              marginTop: 'var(--space-md)', 
              padding: 'var(--space-md)', 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))', 
              border: '2px solid var(--color-warning)', 
              borderRadius: 'var(--radius-lg)' 
            }}>
              <p className="text-warning">
                <strong>Note:</strong> Firefox and Safari do not currently support the Web Serial API.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Features</h3>
            <ul style={{ 
              listStyle: 'disc', 
              listStylePosition: 'inside', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-xs)' 
            }} className="text-secondary">
              <li>Serial communication with CNC machines and 3D printers</li>
              <li>Manual jog controls with keyboard shortcuts</li>
              <li>G-code file loading and visualization</li>
              <li>Command queue management</li>
              <li>Emergency stop functionality</li>
              <li>Configurable settings</li>
              <li>Real-time console logging</li>
              <li>Dark/light theme toggle</li>
            </ul>
          </div>
        </div>
        <div style={{ 
          padding: 'var(--space-lg) var(--space-xl)', 
          background: 'var(--bg-tertiary)', 
          borderTop: '1px solid var(--border-primary)' 
        }}>
          <p className="text-center text-muted">
            Built with React • Web Serial API • Modern CSS
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
