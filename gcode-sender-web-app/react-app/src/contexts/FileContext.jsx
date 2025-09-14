import React, { createContext, useContext, useState } from 'react'

const FileContext = createContext()

export const useFile = () => {
  const context = useContext(FileContext)
  if (!context) {
    throw new Error('useFile must be used within a FileProvider')
  }
  return context
}

export const FileProvider = ({ children }) => {
  const [fileName, setFileName] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [fileLastModified, setFileLastModified] = useState('')

  const openFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.gcode,.nc,.tap,.txt'
    
    input.onchange = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFileName(file.name)
          setFileContent(e.target.result)
          setFileLastModified(new Date(file.lastModified).toLocaleString())
        }
        reader.readAsText(file)
      }
    }
    
    input.click()
  }

  const clearFile = () => {
    setFileName('')
    setFileContent('')
    setFileLastModified('')
  }

  const value = {
    fileName,
    fileContent,
    fileLastModified,
    openFile,
    clearFile
  }

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  )
}
