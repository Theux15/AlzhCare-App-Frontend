import React, { useState, useEffect } from 'react'

export default function MapCard() {
  // Mock data - em uma aplicação real, estes dados viriam de props ou context
  const [gpsData, setGpsData] = useState({
    altitude: 850.2,
    velocity: 0.8,
    satellites: 8,
    isActive: true
  })

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        minHeight: '140px',
        boxShadow: 'var(--card-shadow)',
        background: 'linear-gradient(140deg, rgba(186, 160, 211, 0.35), rgba(94, 53, 177, 0.45))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#ffffff',
        textAlign: 'center',
        padding: '16px',
        margin: '0 auto'
      }}
    >
      {/* Status dos satélites - canto superior direito */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.75rem',
        opacity: 0.9
      }}>
        <span>🛰️</span>
        <span style={{ fontWeight: 'bold' }}>{gpsData.satellites}</span>
        <span style={{
          color: gpsData.isActive ? '#4ade80' : '#f87171',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {gpsData.isActive ? 'ativo' : 'inativo'}
        </span>
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <strong>Residência monitorada</strong>
          <p id="locationText" style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
            Rua das Acácias, 120 · Belo Horizonte · Última atualização há 2 min
          </p>
        </div>
      </div>

      {/* Informações secundárias - parte inferior */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '12px',
        opacity: 0.8
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem'
        }}>
          <span>📏</span>
          <span>{gpsData.altitude.toFixed(1)}m</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem'
        }}>
          <span>🚶‍♂️</span>
          <span>{gpsData.velocity.toFixed(1)} km/h</span>
        </div>
      </div>
    </div>
  )
}
