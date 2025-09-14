# G-Code Sender React App

A modern React web application for sending G-code commands to CNC machines and 3D printers using the Web Serial API.

## Features

- **Serial Communication**: Direct communication with CNC machines via Web Serial API
- **Control Panel**: Manual jog controls with keyboard shortcuts
- **File Management**: Load and visualize G-code files
- **Real-time Console**: Command logging and queue management
- **Emergency Stop**: Safety controls for machine operation
- **Configurable Settings**: Customizable baud rates and UI options

## Requirements

- Modern browser with Web Serial API support:
  - Chrome 89+ (desktop)
  - Edge 89+ (desktop)
  - Opera 75+ (desktop)
- Node.js 16+ for development

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Usage

1. **Connect**: Click the "Connect" button to select your serial device
2. **Control**: Use the jog controls or keyboard shortcuts to move axes
3. **Load Files**: Drag and drop G-code files or use the file picker
4. **Send Commands**: Execute G-code manually or send entire files

## Keyboard Shortcuts

- `←`, `j` - Jog X axis negative
- `→`, `l` - Jog X axis positive  
- `↓`, `k` - Jog Y axis negative
- `↑`, `i` - Jog Y axis positive
- `z` - Jog Z axis negative
- `a` - Jog Z axis positive
- `+` - Increase step size by 10x
- `-` - Decrease step size by 10x
- `3` - Spindle clockwise
- `4` - Spindle counter-clockwise
- `5` - Spindle off
- `/` - Focus command input
- `Esc` - Blur command input

## Architecture

The application uses React with Context API for state management:

- **MachineContext**: Serial communication and command queue
- **FileContext**: G-code file management
- **SettingsContext**: Application configuration
- **WarningContext**: Error and notification handling

## Components

- **ControlPanel**: Manual machine control and console
- **LoadFile**: File loading and G-code visualization
- **Settings**: Configuration interface
- **About**: Application information and help

## Development

The app is built with:
- React 18
- React Router for navigation
- React Bootstrap for UI components
- Vite for build tooling

## Browser Security

Due to Web Serial API security requirements:
- HTTPS is required in production
- User gesture required for serial port access
- Cross-origin restrictions apply

## License

This project maintains the same open-source spirit as the original Chrome extension.
