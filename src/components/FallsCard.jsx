import React from 'react'

export default function FallsCard({ sensorData, fallAlerts = [], onResolveFall, isOnline = true }) {
  // Status baseado nos alertas de queda
  const hasFallAlert = fallAlerts.length > 0;
  const fallData = sensorData?.fall_detection || {};
  const isMoving = sensorData?.location?.speed > 0.5; // Considerando movimento acima de 0.5 km/h

  const getStatus = () => {
    if (!isOnline) return { chip: 'warning', icon: '🔌', text: 'Sistema Offline' };
    if (hasFallAlert) return { chip: 'alert', icon: '⚠️', text: 'Queda Detectada' };
    if (isMoving) return { chip: 'safe', icon: '🚶‍♀️', text: 'Em movimento' };
    return { chip: 'safe', icon: '🧍‍♀️', text: 'Estável' };
  };

  const status = getStatus();

  return (
    <article className="card">
      <div className="card-header">
        <h4 className="card-title">Detecção de Quedas</h4>
        <span className={`chip ${status.chip}`}>
          <span>{status.icon}</span>
          {status.text}
        </span>
      </div>
      
      {hasFallAlert ? (
        <div>
          <p className="metric-value">⚠️ {fallAlerts.length} alerta(s) de queda</p>
          <div style={{ marginTop: '12px' }}>
            {fallAlerts.map((alert, index) => (
              <div key={alert.id} style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '8px',
                marginBottom: '8px',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: '600', color: '#dc2626' }}>
                  Queda #{alert.id} - {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
                <div style={{ color: '#991b1b', marginTop: '4px' }}>
                  {alert.message || 'Possível queda detectada pelos sensores'}
                </div>
                <button
                  onClick={() => onResolveFall && onResolveFall(alert.id)}
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  ✅ Confirmar Segurança
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="metric-value">Sem quedas registradas</p>
          <p className="metric-sub">Monitoramento contínuo nas últimas 24 horas</p>
        </div>
      )}
      
      <div className="trend">
        <span>🛡️</span>
        <span>{isOnline ? 'Sistema ativo para alertas imediatos' : 'Aguardando reconexão'}</span>
      </div>
    </article>
  )
}
