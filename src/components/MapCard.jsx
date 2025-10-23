import React from 'react'

export default function MapCard() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        minHeight: '220px',
        boxShadow: 'var(--card-shadow)',
        background: 'linear-gradient(140deg, rgba(186, 160, 211, 0.35), rgba(94, 53, 177, 0.45))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        textAlign: 'center',
        padding: '24px',
        margin: '0 auto'
      }}
    >
      <div>
        <strong>Residência monitorada</strong>
        <p id="locationText" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
          Rua das Acácias, 120 · Belo Horizonte · Última atualização há 2 min
        </p>
      </div>
    </div>
  )
}
