import React, { createContext, useContext, useState, useEffect } from 'react'
import { useWarning } from './WarningContext'

const MachineContext = createContext()

export const useMachine = () => {
  const context = useContext(MachineContext)
  if (!context) {
    throw new Error('useMachine must be used within a MachineProvider')
  }
  return context
}

export const MachineProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [isRelativeMode, setIsRelativeMode] = useState(false)
  const [isMm, setIsMm] = useState(false)
  const [pendingAck, setPendingAck] = useState(false)
  const [logs, setLogs] = useState([])
  const [commandQueue, setCommandQueue] = useState([])
  
  const { addWarning } = useWarning()
  
  // Web Serial API variables
  const [serialPort, setSerialPort] = useState(null)
  const [serialReader, setSerialReader] = useState(null)
  const [serialWriter, setSerialWriter] = useState(null)
  const [keepReading, setKeepReading] = useState(false)

  const CONSOLE_MAX_SCROLLBACK = 120

  // Convert string to ArrayBuffer
  const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  }

  // Convert ArrayBuffer to string
  const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint8Array(buf))
  }

  // Make string human readable
  const makeHumanReadable = (str) => {
    const parts = []
    for (let j = 0; j < str.length; j++) {
      const d = str.charCodeAt(j)
      if (d < 32) {
        parts.push(`\\x${d.toString(16)}`)
      } else {
        parts.push(str.charAt(j))
      }
    }
    return parts.join('')
  }

  let incomingCommandLookbackChar = ''

  // Log command to console
  const logCommand = (cmd, isSend) => {
    setLogs(prevLogs => {
      const newLogs = [...prevLogs]
      let nodeToWriteTo
      const lastChild = newLogs[newLogs.length - 1]

      if (!isSend && lastChild && lastChild.remoteSource && incomingCommandLookbackChar !== '\n') {
        nodeToWriteTo = lastChild
      } else if (lastChild && !lastChild.msg) {
        lastChild.remoteSource = !isSend
        nodeToWriteTo = lastChild
      } else {
        nodeToWriteTo = { remoteSource: !isSend, msg: '' }
        newLogs.push(nodeToWriteTo)
      }

      // Check for 'ok' to clear command block
      if (!isSend) {
        if ((incomingCommandLookbackChar + cmd).indexOf('ok') !== -1) {
          setPendingAck(false)
        }
        if (cmd.length > 0) {
          incomingCommandLookbackChar = cmd.charAt(cmd.length - 1)
        }
      }

      // Add each line to console output
      const lines = cmd.split('\n')
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].replace('\r', '')
        nodeToWriteTo.msg = nodeToWriteTo.msg + makeHumanReadable(line)

        if (!isSend) {
          nodeToWriteTo.isAck = nodeToWriteTo.msg === 'ok'
        }

        if (i < lines.length - 1) {
          nodeToWriteTo = { remoteSource: !isSend, msg: '' }
          newLogs.push(nodeToWriteTo)
        }
      }

      // Limit history
      while (newLogs.length > CONSOLE_MAX_SCROLLBACK) {
        newLogs.shift()
      }

      return newLogs
    })
  }

  // Send command to serial connection
  const sendCommandToSerialConnection = async (cmd) => {
    if (cmd.indexOf('G90') !== -1) {
      setIsRelativeMode(false)
    } else if (cmd.indexOf('G91') !== -1) {
      setIsRelativeMode(true)
    } else if (cmd.indexOf('G20') !== -1) {
      setIsMm(false)
    } else if (cmd.indexOf('G21') !== -1) {
      setIsMm(true)
    }

    if (!serialPort || !serialWriter) {
      addWarning('No device connection available.')
      return
    }

    try {
      await serialWriter.write(str2ab(cmd))
      logCommand(cmd, true)
    } catch (err) {
      addWarning(`Failed to send command: ${err}`)
    }
  }

  // Process command queue
  const processCommandQueue = () => {
    if (commandQueue.length === 0 || !serialPort || pendingAck) {
      return
    }

    setPendingAck(true)
    const nextCommand = commandQueue[0]
    setCommandQueue(prev => prev.slice(1))
    sendCommandToSerialConnection(nextCommand)
  }

  // Read serial loop
  const readSerialLoop = async () => {
    while (keepReading && serialReader) {
      try {
        const { value, done } = await serialReader.read()
        if (done) break
        if (value) {
          const str = ab2str(value)
          logCommand(str, false)
        }
      } catch (err) {
        if (keepReading) {
          addWarning(`Read error: ${err}`)
        }
        break
      }
    }
  }

  // Connect to serial port
  const connect = async (port, baud = 115200) => {
    setIsBusy(true)
    try {
      let portToUse = port
      if (!portToUse) {
        if ('serial' in navigator) {
          portToUse = await navigator.serial.requestPort()
        } else {
          throw new Error('Web Serial API not supported')
        }
      }
      
      await portToUse.open({ baudRate: baud })
      
      const writer = portToUse.writable.getWriter()
      const reader = portToUse.readable.getReader()
      
      setSerialPort(portToUse)
      setSerialWriter(writer)
      setSerialReader(reader)
      setKeepReading(true)
      setIsBusy(false)
      setIsConnected(true)
      setCommandQueue([])
      setPendingAck(false)
      
      // Start reading loop
      readSerialLoop()
    } catch (err) {
      addWarning(`Unable to connect: ${err}`)
      setIsBusy(false)
      setIsConnected(false)
    }
  }

  // Disconnect from serial port
  const disconnect = async () => {
    setCommandQueue([])
    
    if (serialReader) {
      setKeepReading(false)
      try {
        await serialReader.cancel()
      } catch (e) {
        // Ignore cancel errors
      }
      serialReader.releaseLock()
      setSerialReader(null)
    }
    
    if (serialWriter) {
      serialWriter.releaseLock()
      setSerialWriter(null)
    }
    
    if (serialPort) {
      await serialPort.close()
      setSerialPort(null)
    }
    
    setIsConnected(false)
    setIsBusy(false)
  }

  // Enqueue commands
  const enqueueCommands = (cmds) => {
    setCommandQueue(prev => [...prev, ...cmds])
  }

  // Emergency stop
  const emergencyStop = () => {
    console.error('!!!emergency stop activated!!!')
    setCommandQueue([])
    sendCommandToSerialConnection('M112\n')
    sendCommandToSerialConnection('\x18\n')
  }

  // Clear logs
  const clearLogs = () => {
    setLogs([])
  }

  // Clear command queue
  const clearCommandQueue = () => {
    setCommandQueue([])
  }

  // Process command queue every 50ms
  useEffect(() => {
    const interval = setInterval(processCommandQueue, 50)
    return () => clearInterval(interval)
  }, [commandQueue, serialPort, pendingAck])

  const value = {
    isConnected,
    isBusy,
    isRelativeMode,
    isMm,
    pendingAck,
    logs,
    commandQueue,
    connect,
    disconnect,
    enqueueCommands,
    emergencyStop,
    clearLogs,
    clearCommandQueue,
    sendCommandToSerialConnection
  }

  return (
    <MachineContext.Provider value={value}>
      {children}
    </MachineContext.Provider>
  )
}
