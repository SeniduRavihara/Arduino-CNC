import React from "react";
import { useSettings } from "../contexts/SettingsContext";

const Settings = () => {
  const { settings, saveSettings, resetSettings } = useSettings();

  const handleChange = (key, value) => {
    saveSettings({ [key]: value });
  };

  const handleReset = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to defaults?")
    ) {
      resetSettings();
    }
  };

  return (
    <div className="container animate-fade-in">
      <div
        className="card-modern"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="card-header-modern">
          <h2 className="text-xl font-semibold text-primary">Settings</h2>
        </div>
        <div className="card-body-modern">
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xl)",
            }}
          >
            <div>
              <h3 className="text-lg font-medium text-primary mb-4">
                Serial Communication
              </h3>
              <label className="form-label">Baud Rate</label>
              <select
                className="input-modern"
                value={settings.workspace_baud}
                onChange={(e) =>
                  handleChange("workspace_baud", parseInt(e.target.value))
                }
              >
                <option value={9600}>9600</option>
                <option value={19200}>19200</option>
                <option value={38400}>38400</option>
                <option value={57600}>57600</option>
                <option value={115200}>115200</option>
                <option value={230400}>230400</option>
                <option value={250000}>250000</option>
              </select>
            </div>

            <hr style={{ border: "1px solid var(--border-primary)" }} />

            <div>
              <h3 className="text-lg font-medium text-primary mb-4">
                Control Panel Display Options
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-lg)",
                }}
              >
                <label className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={settings.workspace_show_estop}
                    onChange={(e) =>
                      handleChange("workspace_show_estop", e.target.checked)
                    }
                    style={{
                      marginRight: "var(--space-md)",
                      transform: "scale(1.2)",
                      accentColor: "var(--color-primary)",
                    }}
                  />
                  <span className="small text-primary">
                    Show Emergency Stop Button
                  </span>
                </label>

                <label className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={settings.workspace_show_home}
                    onChange={(e) =>
                      handleChange("workspace_show_home", e.target.checked)
                    }
                    style={{
                      marginRight: "var(--space-md)",
                      transform: "scale(1.2)",
                      accentColor: "var(--color-primary)",
                    }}
                  />
                  <span className="small text-primary">Show Home Controls</span>
                </label>

                <label className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={settings.workspace_show_zero}
                    onChange={(e) =>
                      handleChange("workspace_show_zero", e.target.checked)
                    }
                    style={{
                      marginRight: "var(--space-md)",
                      transform: "scale(1.2)",
                      accentColor: "var(--color-primary)",
                    }}
                  />
                  <span className="small text-primary">Show Zero Controls</span>
                </label>

                <label className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={settings.workspace_show_spindle}
                    onChange={(e) =>
                      handleChange("workspace_show_spindle", e.target.checked)
                    }
                    style={{
                      marginRight: "var(--space-md)",
                      transform: "scale(1.2)",
                      accentColor: "var(--color-primary)",
                    }}
                  />
                  <span className="small text-primary">
                    Show Spindle Controls
                  </span>
                </label>
              </div>
            </div>

            <hr style={{ border: "1px solid var(--border-primary)" }} />

            <div>
              <button
                type="button"
                onClick={handleReset}
                className="btn-danger-modern"
                style={{ width: "100%" }}
              >
                Reset All Settings to Default
              </button>
            </div>
          </form>
        </div>
        <div
          style={{
            padding: "var(--space-lg) var(--space-xl)",
            background: "var(--bg-tertiary)",
            borderTop: "1px solid var(--border-primary)",
          }}
        >
          <p className="small text-muted">
            Settings are automatically saved to your browser's local storage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
