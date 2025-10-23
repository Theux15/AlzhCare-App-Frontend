import React from 'react'

export default function Hero({ lastUpdate }) {
  return (
    <section
      className="relative mt-5 overflow-hidden text-white"
      style={{
        borderRadius: '28px',
        background: 'linear-gradient(145deg, rgba(186, 160, 211, 0.85), rgba(94, 53, 177, 0.75))',
        padding: '32px 26px 28px',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <h2 style={{ fontSize: '1.55rem', margin: '0 0 12px', letterSpacing: '0.01em' }}>
        Monitoramento em tempo real
      </h2>

      <div style={{
        marginTop: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 18px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.18)'
      }}>
        <div style={{ fontSize: '1.3rem', lineHeight: 1 }}>🟢</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.78rem', opacity: 0.88, letterSpacing: '0.02em' }}>
            Última atualização
          </span>
          <strong id="lastUpdate" style={{ fontSize: '1.05rem', letterSpacing: '0.01em' }}>
            {lastUpdate}
          </strong>
        </div>
      </div>
    </section>
  )
}
