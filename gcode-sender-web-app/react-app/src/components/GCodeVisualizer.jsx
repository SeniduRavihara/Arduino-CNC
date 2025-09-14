import React, { useEffect, useRef, useState } from 'react'

const GCodeVisualizer = ({ gcode, width = 800, height = 400 }) => {
  const canvasRef = useRef(null)
  const [bounds, setBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 })

  useEffect(() => {
    if (!gcode || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Set up coordinate system
    ctx.strokeStyle = 'var(--color-primary)'
    ctx.lineWidth = 2
    ctx.fillStyle = 'var(--color-primary)'
    
    // Parse G-code and find bounds
    const lines = gcode.split('\n')
    let currentX = 0
    let currentY = 0
    let penUp = true
    let minX = 0, maxX = 0, minY = 0, maxY = 0
    const points = []

    lines.forEach(line => {
      const trimmed = line.trim().toUpperCase()
      
      if (trimmed.startsWith('G0') || trimmed.startsWith('G1')) {
        const xMatch = trimmed.match(/X([-\d.]+)/)
        const yMatch = trimmed.match(/Y([-\d.]+)/)
        
        let newX = currentX
        let newY = currentY
        
        if (xMatch) newX = parseFloat(xMatch[1])
        if (yMatch) newY = parseFloat(yMatch[1])
        
        points.push({
          x: newX,
          y: newY,
          isRapid: trimmed.startsWith('G0')
        })
        
        minX = Math.min(minX, newX)
        maxX = Math.max(maxX, newX)
        minY = Math.min(minY, newY)
        maxY = Math.max(maxY, newY)
        
        currentX = newX
        currentY = newY
      }
    })

    setBounds({ minX, maxX, minY, maxY })

    if (points.length === 0) return

    // Calculate scale and offset
    const margin = 20
    const drawWidth = width - 2 * margin
    const drawHeight = height - 2 * margin
    
    const scaleX = drawWidth / Math.max(maxX - minX, 1)
    const scaleY = drawHeight / Math.max(maxY - minY, 1)
    const scale = Math.min(scaleX, scaleY)
    
    const offsetX = margin + (drawWidth - (maxX - minX) * scale) / 2 - minX * scale
    const offsetY = margin + (drawHeight - (maxY - minY) * scale) / 2 - minY * scale

    // Draw grid
    ctx.strokeStyle = 'var(--border-primary)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    
    // Vertical grid lines
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += 10) {
      const screenX = offsetX + x * scale
      ctx.beginPath()
      ctx.moveTo(screenX, margin)
      ctx.lineTo(screenX, height - margin)
      ctx.stroke()
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += 10) {
      const screenY = offsetY + y * scale
      ctx.beginPath()
      ctx.moveTo(margin, screenY)
      ctx.lineTo(width - margin, screenY)
      ctx.stroke()
    }

    // Draw G-code path
    ctx.setLineDash([])
    ctx.strokeStyle = 'var(--color-primary)'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    let isFirstPoint = true
    
    points.forEach((point, index) => {
      const screenX = offsetX + point.x * scale
      const screenY = offsetY + point.y * scale
      
      if (isFirstPoint) {
        ctx.moveTo(screenX, screenY)
        isFirstPoint = false
      } else if (point.isRapid) {
        // Rapid move (pen up)
        ctx.moveTo(screenX, screenY)
      } else {
        // Linear move (pen down)
        ctx.lineTo(screenX, screenY)
      }
    })
    
    ctx.stroke()

    // Draw start point
    if (points.length > 0) {
      const startPoint = points[0]
      const startX = offsetX + startPoint.x * scale
      const startY = offsetY + startPoint.y * scale
      
      ctx.fillStyle = 'var(--color-success)'
      ctx.beginPath()
      ctx.arc(startX, startY, 4, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw end point
    if (points.length > 1) {
      const endPoint = points[points.length - 1]
      const endX = offsetX + endPoint.x * scale
      const endY = offsetY + endPoint.y * scale
      
      ctx.fillStyle = 'var(--color-danger)'
      ctx.beginPath()
      ctx.arc(endX, endY, 4, 0, 2 * Math.PI)
      ctx.fill()
    }

    // Draw coordinate labels
    ctx.fillStyle = 'var(--text-secondary)'
    ctx.font = '12px var(--font-monospace)'
    ctx.textAlign = 'center'
    
    // X axis labels
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += 10) {
      const screenX = offsetX + x * scale
      ctx.fillText(x.toString(), screenX, height - 5)
    }
    
    // Y axis labels
    ctx.textAlign = 'right'
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += 10) {
      const screenY = offsetY + y * scale
      ctx.fillText(y.toString(), 15, screenY + 4)
    }

  }, [gcode, width, height])

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '2px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)',
          display: 'block',
          margin: '0 auto'
        }}
      />
      {gcode && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'var(--bg-overlay)',
          padding: 'var(--space-sm) var(--space-md)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-monospace)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-primary)'
        }}>
          <div>Bounds: X[{bounds.minX.toFixed(1)}, {bounds.maxX.toFixed(1)}]</div>
          <div>Y[{bounds.minY.toFixed(1)}, {bounds.maxY.toFixed(1)}]</div>
          <div>Size: {((bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY)).toFixed(1)} mm²</div>
        </div>
      )}
    </div>
  )
}

export default GCodeVisualizer

