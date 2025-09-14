import React, { createContext, useContext, useEffect, useState } from "react";
import { useWarning } from "./WarningContext";

const MachineContext = createContext();

export const useMachine = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error("useMachine must be used within a MachineProvider");
  }
  return context;
};

export const MachineProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isRelativeMode, setIsRelativeMode] = useState(false);
  const [isMm, setIsMm] = useState(false);
  const [pendingAck, setPendingAck] = useState(false);
  const [logs, setLogs] = useState([]);
  const [commandQueue, setCommandQueue] = useState([]);

  // Add lookback character like the original
  const [incomingCommandLookbackChar, setIncomingCommandLookbackChar] =
    useState("");

  const { addWarning } = useWarning();

  // Web Serial API variables
  const [serialPort, setSerialPort] = useState(null);
  const [serialReader, setSerialReader] = useState(null);
  const [serialWriter, setSerialWriter] = useState(null);
  const [keepReading, setKeepReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const CONSOLE_MAX_SCROLLBACK = 120;

  // Convert string to ArrayBuffer
  const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  // Convert ArrayBuffer to string
  const ab2str = (buf) => {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  };

  // Make string human readable
  const makeHumanReadable = (str) => {
    const parts = [];
    for (let j = 0; j < str.length; j++) {
      const d = str.charCodeAt(j);
      if (d < 32) {
        parts.push(`\\x${d.toString(16)}`);
      } else {
        parts.push(str.charAt(j));
      }
    }
    return parts.join("");
  };

  // Log command to console
  const logCommand = (cmd, isSend) => {
    setLogs((prevLogs) => {
      const newLogs = [...prevLogs];
      let nodeToWriteTo;
      const lastChild = newLogs[newLogs.length - 1];

      if (
        !isSend &&
        lastChild &&
        lastChild.remoteSource &&
        incomingCommandLookbackChar !== "\n"
      ) {
        nodeToWriteTo = lastChild;
      } else if (lastChild && !lastChild.msg) {
        lastChild.remoteSource = !isSend;
        nodeToWriteTo = lastChild;
      } else {
        nodeToWriteTo = { remoteSource: !isSend, msg: "" };
        newLogs.push(nodeToWriteTo);
      }

      // Check for 'ok' to clear command block
      if (!isSend) {
        if ((incomingCommandLookbackChar + cmd).indexOf("ok") !== -1) {
          setPendingAck(false);
          window.currentPendingAck = false;
        }
        if (cmd.length > 0) {
          setIncomingCommandLookbackChar(cmd.charAt(cmd.length - 1));
        }
      }

      // Add each line to console output
      const lines = cmd.split("\n");
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].replace("\r", "");
        nodeToWriteTo.msg = nodeToWriteTo.msg + makeHumanReadable(line);

        if (!isSend) {
          nodeToWriteTo.isAck = nodeToWriteTo.msg === "ok";
          // Clear pending ack when we receive "ok" (like original)
          if (nodeToWriteTo.msg === "ok") {
            setPendingAck(false);
            window.currentPendingAck = false;
          }
        }

        if (i < lines.length - 1) {
          nodeToWriteTo = { remoteSource: !isSend, msg: "" };
          newLogs.push(nodeToWriteTo);
        }
      }

      // Limit history
      while (newLogs.length > CONSOLE_MAX_SCROLLBACK) {
        newLogs.shift();
      }

      return newLogs;
    });
  };

  // Send command to serial connection
  const sendCommandToSerialConnection = async (cmd) => {
    if (cmd.indexOf("G90") !== -1) {
      setIsRelativeMode(false);
    } else if (cmd.indexOf("G91") !== -1) {
      setIsRelativeMode(true);
    } else if (cmd.indexOf("G20") !== -1) {
      setIsMm(false);
    } else if (cmd.indexOf("G21") !== -1) {
      setIsMm(true);
    }

    const writer = window.currentSerialWriter;
    if (!writer) {
      addWarning("No device connection available.");
      return;
    }

    try {
      // DON'T log here - the original doesn't log in sendCommandToSerialConnection
      await writer.write(str2ab(cmd));
    } catch (err) {
      addWarning(`Failed to send command: ${err}`);
      // If send fails, we should clear pending ack
      setPendingAck(false);
      window.currentPendingAck = false;
    }
  };

  // Process command queue
  const processCommandQueue = () => {
    // Use direct references to avoid React state timing issues
    const currentQueue = window.currentCommandQueue || [];
    const currentPendingAck = window.currentPendingAck || false;

    console.log("Processing command queue:", {
      queueLength: currentQueue.length,
      hasPort: !!window.currentSerialPort,
      pendingAck: currentPendingAck,
      queue: currentQueue,
    });

    if (
      currentQueue.length === 0 ||
      !window.currentSerialPort ||
      currentPendingAck ||
      window.currentIsPaused
    ) {
      return;
    }

    window.currentPendingAck = true;
    setPendingAck(true);

    // Pop the first element off the queue and send it to the serial line (like original)
    const nextCommand = currentQueue.shift();
    window.currentCommandQueue = currentQueue;
    setCommandQueue((prev) => prev.slice(1));

    console.log("Sending command:", nextCommand);

    // Log the command before sending (like original)
    logCommand(nextCommand, true);
    sendCommandToSerialConnection(nextCommand);
  };

  // Read serial loop - exactly like the original
  const readSerialLoop = async () => {
    console.log("Starting serial read loop...");
    const reader = window.currentSerialReader;
    let keepReadingFlag = window.currentKeepReading;

    while (keepReadingFlag && reader) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          console.log("Serial reader done");
          break;
        }
        if (value) {
          const str = ab2str(value);
          console.log("Received serial data:", str);
          logCommand(str, false);
        }
      } catch (err) {
        console.error("Serial read error:", err);
        if (keepReadingFlag) {
          addWarning(`Read error: ${err}`);
        }
        break;
      }
    }
    console.log("Serial read loop ended");
  };

  // Connect to serial port
  const connect = async (port, baud = 9600) => {
    console.log("Connecting to serial port with baud rate:", baud);
    setIsBusy(true);
    try {
      let portToUse = port;
      if (!portToUse) {
        if ("serial" in navigator) {
          portToUse = await navigator.serial.requestPort();
        } else {
          throw new Error("Web Serial API not supported");
        }
      }

      console.log("Opening serial port...");
      await portToUse.open({ baudRate: baud });
      console.log("Serial port opened successfully");

      const writer = portToUse.writable.getWriter();
      const reader = portToUse.readable.getReader();

      // Set all state at once to avoid timing issues
      setSerialPort(portToUse);
      setSerialWriter(writer);
      setSerialReader(reader);
      setKeepReading(true);
      setIsBusy(false);
      setIsConnected(true);
      setCommandQueue([]);
      setPendingAck(false);

      // Store references for immediate use (like the original)
      window.currentSerialReader = reader;
      window.currentSerialWriter = writer;
      window.currentSerialPort = portToUse;
      window.currentCommandQueue = [];
      window.currentPendingAck = false;
      window.currentKeepReading = true;
      window.currentIsPaused = false;

      // Monitor port for disconnection
      portToUse.addEventListener("disconnect", () => {
        addWarning("Serial port disconnected");
        disconnect();
      });

      // Start reading loop - exactly like the original
      console.log("Starting read loop...");
      readSerialLoop();
    } catch (err) {
      console.error("Connection error:", err);
      addWarning(`Unable to connect: ${err}`);
      setIsBusy(false);
      setIsConnected(false);
    }
  };

  // Disconnect from serial port
  const disconnect = async () => {
    setCommandQueue([]);
    window.currentCommandQueue = [];

    if (serialReader) {
      setKeepReading(false);
      try {
        await serialReader.cancel();
      } catch (e) {
        // Ignore cancel errors
      }
      serialReader.releaseLock();
      setSerialReader(null);
    }

    if (serialWriter) {
      serialWriter.releaseLock();
      setSerialWriter(null);
    }

    if (serialPort) {
      await serialPort.close();
      setSerialPort(null);
    }

    // Clear direct references
    window.currentSerialReader = null;
    window.currentSerialWriter = null;
    window.currentSerialPort = null;
    window.currentCommandQueue = [];
    window.currentPendingAck = false;
    window.currentKeepReading = false;
    window.currentIsPaused = false;

    setIsConnected(false);
    setIsBusy(false);
  };

  // Enqueue commands
  const enqueueCommands = (cmds) => {
    console.log("Enqueueing commands:", cmds);
    setCommandQueue((prev) => {
      const newQueue = [...prev, ...cmds];
      window.currentCommandQueue = newQueue;
      console.log("New command queue:", newQueue);
      return newQueue;
    });
  };

  // Emergency stop
  // Pause command processing
  const pause = () => {
    setIsPaused(true);
    window.currentIsPaused = true;
    console.log("Machine paused");
  };

  // Resume command processing
  const resume = () => {
    setIsPaused(false);
    window.currentIsPaused = false;
    console.log("Machine resumed");
  };

  const emergencyStop = async () => {
    console.error("!!!emergency stop activated!!!");

    // Clear the command queue immediately
    setCommandQueue([]);
    window.currentCommandQueue = [];

    // Send emergency stop commands without waiting for ACK (like original)
    try {
      if (serialWriter) {
        await serialWriter.write(str2ab("M112\n"));
        await serialWriter.write(str2ab("\x18\n"));
      }
    } catch (err) {
      console.error("Emergency stop command failed:", err);
    }

    // Note: Original doesn't disconnect automatically after emergency stop
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Clear command queue
  const clearCommandQueue = () => {
    setCommandQueue([]);
  };

  // Process command queue every 50ms - exactly like the original
  useEffect(() => {
    const interval = setInterval(processCommandQueue, 50);
    return () => clearInterval(interval);
  }, []); // Empty dependency array like the original

  const value = {
    isConnected,
    isBusy,
    isRelativeMode,
    isMm,
    pendingAck,
    isPaused,
    logs,
    commandQueue,
    connect,
    disconnect,
    enqueueCommands,
    pause,
    resume,
    emergencyStop,
    clearLogs,
    clearCommandQueue,
    sendCommandToSerialConnection,
  };

  return (
    <MachineContext.Provider value={value}>{children}</MachineContext.Provider>
  );
};
