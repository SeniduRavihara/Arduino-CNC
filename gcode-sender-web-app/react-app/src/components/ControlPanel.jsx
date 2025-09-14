import React, { useEffect, useRef, useState } from "react";
import { useMachine } from "../contexts/MachineContext";
import { useSettings } from "../contexts/SettingsContext";

const ControlPanel = () => {
  const {
    isConnected,
    isRelativeMode,
    isMm,
    logs,
    commandQueue,
    pendingAck,
    enqueueCommands,
    emergencyStop,
    clearLogs,
    clearCommandQueue,
    sendCommandToSerialConnection,
  } = useMachine();

  const { settings } = useSettings();
  const [stepSize, setStepSize] = useState(100);
  const [manualCommand, setManualCommand] = useState("");
  const consoleRef = useRef(null);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  // Keyboard shortcuts for jog controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (document.activeElement.tagName === "INPUT") return;

      switch (e.key) {
        case "ArrowLeft":
        case "j":
          e.preventDefault();
          relativeMove("X-");
          break;
        case "ArrowRight":
        case "l":
          e.preventDefault();
          relativeMove("X");
          break;
        case "ArrowDown":
        case "k":
          e.preventDefault();
          relativeMove("Y-");
          break;
        case "ArrowUp":
        case "i":
          e.preventDefault();
          relativeMove("Y");
          break;
        case "z":
          e.preventDefault();
          relativeMove("Z-");
          break;
        case "a":
          e.preventDefault();
          relativeMove("Z");
          break;
        case "+":
          e.preventDefault();
          setStepSize((prev) => prev * 10);
          break;
        case "-":
          e.preventDefault();
          setStepSize((prev) => prev / 10);
          break;
        case "3":
          e.preventDefault();
          sendCommands(["M3\n"]);
          break;
        case "4":
          e.preventDefault();
          sendCommands(["M4\n"]);
          break;
        case "5":
          e.preventDefault();
          sendCommands(["M5\n"]);
          break;
        case "/":
          e.preventDefault();
          document.getElementById("input-control-cmd")?.focus();
          break;
        case "Escape":
          e.preventDefault();
          document.getElementById("input-control-cmd")?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [stepSize]);

  const shouldSendCommands = () => {
    return isConnected && commandQueue.length === 0;
  };

  const relativeMove = (axis) => {
    if (!shouldSendCommands()) return;

    const commands = [];

    // Check if we need to set relative mode
    if (!isRelativeMode) {
      commands.push("G91\n");
    }

    // Check if we need to set mm mode
    if (!isMm) {
      commands.push("G21\n");
    }

    // Build the move command with proper feedrate
    const feedrate = settings.workspace_jog_feedrate;
    let mv = "G1";
    if (settings.workspace_jog_rapid) {
      mv = "G0";
    } else if (feedrate && feedrate > 0) {
      mv += " F" + feedrate;
    }
    mv += " " + axis + stepSize;
    commands.push(mv + "\n");

    sendCommands(commands);
  };

  const sendCommands = (commands) => {
    if (!shouldSendCommands()) return;
    enqueueCommands(commands);
  };

  const sendManualCommand = (e) => {
    e.preventDefault();
    if (!manualCommand.trim() || !isConnected) return;

    const command = manualCommand.trim() + "\n";
    sendCommands([command]);
    setManualCommand("");
  };

  const handleEmergencyStop = () => {
    emergencyStop();
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        display: "flex",
        height: "calc(100vh - 200px)",
        gap: "var(--space-lg)",
      }}
    >
      {/* Left Controls */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "0 var(--space-md)",
          maxWidth: "40%",
        }}
      >
        {settings.workspace_show_estop && (
          <div className="control-section">
            <h4>Emergency Stop</h4>
            <div className="d-flex lonely-centered">
              <button
                className="btn btn-estop"
                onClick={handleEmergencyStop}
                disabled={!isConnected}
              >
                ⚠
              </button>
            </div>
          </div>
        )}

        <div className="control-section">
          <h4>Jog Controls</h4>
          <div className="jog-controls mb-3">
            <div className="jog-stack">
              <button
                className="jog-button flex mb-1"
                onClick={() => relativeMove("Z")}
                disabled={!isConnected}
              >
                ↑ +Z
              </button>
              <button
                className="jog-button flex"
                onClick={() => relativeMove("Z-")}
                disabled={!isConnected}
              >
                ↓ -Z
              </button>
            </div>

            <div className="jog-block">
              <div className="jog-stack">
                <button
                  className="jog-button"
                  onClick={() => relativeMove("X-")}
                  disabled={!isConnected}
                >
                  ← -X
                </button>
              </div>
              <div className="jog-stack">
                <button
                  className="jog-button mb-1"
                  onClick={() => relativeMove("Y")}
                  disabled={!isConnected}
                >
                  ↑ +Y
                </button>
                <button
                  className="jog-button"
                  onClick={() => relativeMove("Y-")}
                  disabled={!isConnected}
                >
                  ↓ -Y
                </button>
              </div>
              <div className="jog-stack">
                <button
                  className="jog-button"
                  onClick={() => relativeMove("X")}
                  disabled={!isConnected}
                >
                  → +X
                </button>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Step Size ({stepSize})</label>
            <input
              type="number"
              className="form-control"
              value={stepSize}
              onChange={(e) => setStepSize(parseFloat(e.target.value) || 0.01)}
              min="0.01"
              step="any"
              disabled={!isConnected}
              style={{
                fontFamily: "var(--font-monospace)",
                fontWeight: "600",
              }}
            />
          </div>
        </div>

        {settings.workspace_show_home && (
          <div className="control-section">
            <h4>Home Controls</h4>
            <div
              className="d-flex justify-content-between"
              style={{ gap: "var(--space-sm)" }}
            >
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["G28 X0\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                🏠 Home X
              </button>
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["G28 Y0\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                🏠 Home Y
              </button>
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["G28 Z0\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                🏠 Home Z
              </button>
            </div>
          </div>
        )}

        {settings.workspace_show_zero && (
          <div className="control-section">
            <h4>Zero Controls</h4>
            <div
              className="d-flex justify-content-between"
              style={{ gap: "var(--space-sm)" }}
            >
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["G92 X0\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                🎯 Zero X
              </button>
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["G92 Y0\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                🎯 Zero Y
              </button>
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["G92 Z0\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                🎯 Zero Z
              </button>
            </div>
          </div>
        )}

        {settings.workspace_show_spindle && (
          <div className="control-section">
            <h4>Spindle Controls</h4>
            <div
              className="d-flex justify-content-between"
              style={{ gap: "var(--space-sm)" }}
            >
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["M3\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                ↻ CW
              </button>
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["M4\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                ↺ CCW
              </button>
              <button
                className="btn btn-secondary flex"
                onClick={() => sendCommands(["M5\n"])}
                disabled={!isConnected}
                style={{ minWidth: "80px" }}
              >
                ⊘ OFF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Console Sidebar */}
      <div style={{ flex: 1, minWidth: "500px" }}>
        <div
          className="card"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <strong>Console</strong>
                <small className="text-muted ms-2">
                  ({commandQueue.length} enqueued commands)
                </small>
                {pendingAck && <span className="ms-1 text-warning">⏳</span>}
              </span>
              <div className="d-flex" style={{ gap: "var(--space-sm)" }}>
                <button className="btn btn-secondary small" onClick={clearLogs}>
                  🗑️ Clear Log
                </button>
                <button
                  className="btn btn-secondary small"
                  onClick={clearCommandQueue}
                >
                  📋 Clear Queue
                </button>
              </div>
            </div>
          </div>
          <div
            className="card-body"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            <div
              className="console-log"
              ref={consoleRef}
              style={{ flex: 1, overflow: "auto", padding: "var(--space-md)" }}
            >
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${log.isAck ? "is-ack" : ""} ${
                    log.remoteSource ? "log-remote-entry" : "log-user-entry"
                  }`}
                >
                  {log.msg}
                </div>
              ))}
            </div>
            <form
              onSubmit={sendManualCommand}
              style={{
                padding: "var(--space-md)",
                borderTop: "1px solid var(--border-primary)",
              }}
            >
              <div className="input-group">
                <input
                  id="input-control-cmd"
                  type="text"
                  value={manualCommand}
                  onChange={(e) => setManualCommand(e.target.value)}
                  disabled={!isConnected}
                  className="form-control font-monospace"
                  placeholder="Enter G-code command..."
                  style={{
                    fontFamily: "var(--font-monospace)",
                    fontWeight: "600",
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isConnected}
                >
                  📤 Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
