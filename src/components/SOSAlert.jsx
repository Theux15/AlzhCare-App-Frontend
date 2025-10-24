import React, { useState, useEffect } from 'react'

export default function SOSAlert({ isActive = false }) {
  const [timePressed, setTimePressed] = useState(null)
  const [blinking, setBlinking] = useState(true)

  useEffect(() => {
    if (isActive) {
      setTimePressed(new Date())
      setBlinking(true)
      
      // Para o piscar após 10 segundos
      const blinkTimer = setTimeout(() => {
        setBlinking(false)
      }, 10000)

      return () => clearTimeout(blinkTimer)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: blinking ? 
        'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 
        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)',
      animation: blinking ? 'sosAlert 1s infinite' : 'none',
      borderBottom: '3px solid #991b1b'
    }}>
      <style>{`
        @keyframes sosAlert {
          0%, 50% { opacity: 1; }
          25%, 75% { opacity: 0.7; }
        }
      `}</style>
      
      <div style={{
        maxWidth: '335px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '1.5rem',
            animation: blinking ? 'pulse 0.5s infinite alternate' : 'none'
          }}>
            🆘
          </div>
          <div>
            <div style={{
              fontWeight: 'bold',
              fontSize: '1rem',
              marginBottom: '2px'
            }}>
              ALERTA SOS ATIVADO
            </div>
            <div style={{
              fontSize: '0.75rem',
              opacity: 0.9
            }}>
              {timePressed && `Acionado às ${timePressed.toLocaleTimeString('pt-BR')}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}