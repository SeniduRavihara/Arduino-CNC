import React from 'react'
import { useFile } from '../contexts/FileContext'
import { useMachine } from '../contexts/MachineContext'
import GCodeVisualizer from './GCodeVisualizer'

const LoadFile = () => {
  const { fileName, fileContent, fileLastModified, openFile } = useFile()
  const { isConnected, enqueueCommands } = useMachine()

  // G-code visualization is now handled by the GCodeVisualizer component

  const sendFileToMachine = () => {
    if (!fileContent || !isConnected) return

    const lines = fileContent.split('\n')
    const commands = lines
      .map(line => line.trim())
      .filter(line => line && !line.startsWith(';') && !line.startsWith('('))
      .map(line => line + '\n')

    enqueueCommands(commands)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        // This would need to be handled by the FileContext
        console.log('File dropped:', file.name, event.target.result)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="container animate-fade-in">
      <div className="card-modern">
        <div className="card-header-modern">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {!fileName && <em className="text-muted">Empty workspace</em>}
              {fileName && (
                <div>
                  <span className="font-semibold text-primary">{fileName}</span>
                  <span className="text-muted ms-2 small">
                    (last modified {fileLastModified})
                  </span>
                </div>
              )}
            </div>
            <div className="d-flex" style={{ gap: 'var(--space-sm)' }}>
              <button 
                onClick={openFile}
                className="btn-primary-modern"
              >
                📁 Open Local File
              </button>
              <button
                onClick={sendFileToMachine}
                disabled={!isConnected || !fileContent}
                className="btn-success-modern"
                style={{ opacity: (!isConnected || !fileContent) ? 0.5 : 1, cursor: (!isConnected || !fileContent) ? 'not-allowed' : 'pointer' }}
              >
                📤 Send to Machine
              </button>
            </div>
          </div>
        </div>
        <div 
          className="card-body-modern"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ minHeight: '400px' }}
        >
          <div id="warnings-render" className="alert-modern hidden"></div>
          {fileContent ? (
            <GCodeVisualizer gcode={fileContent} width={800} height={400} />
          ) : (
            <div className="text-center text-muted mt-5">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ fontSize: '3rem' }}>📄</div>
                <div>
                  <p className="text-lg font-semibold">Drag and drop a G-code file here or use the "Open Local File" button</p>
                  <p className="small">Supported formats: .gcode, .nc, .tap, .txt</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ 
          padding: 'var(--space-lg) var(--space-xl)', 
          background: 'var(--bg-tertiary)', 
          borderTop: '1px solid var(--border-primary)' 
        }}>
          <div className="text-muted small">
            {fileContent && (
              <span>
                Lines: {fileContent.split('\n').length} | 
                Size: {new Blob([fileContent]).size} bytes
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadFile
