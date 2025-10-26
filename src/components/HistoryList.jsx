import React from 'react'

export default function HistoryList({ history = [], isOnline = true }) {
  // Se não há dados históricos
  if (!history || history.length === 0) {
    return (
      <article className="card">
        <div className="card-header">
          <h4 className="card-title">Histórico de Leituras</h4>
          <span className={`chip ${isOnline ? 'warning' : 'alert'}`}>
            <span>{isOnline ? '📭' : '🔌'}</span>
            {isOnline ? 'Sem dados' : 'Offline'}
          </span>
        </div>
        <p className="metric-sub">
          {isOnline ? 
            'Aguardando primeiras leituras dos sensores...' : 
            'Sistema desconectado. Verifique a conexão.'
          }
        </p>
      </article>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#374151' }}>
        Histórico de Leituras ({history.length})
      </h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {history.map((reading, idx) => {
          const timestamp = new Date(reading.timestamp);
          const hasAlert = reading.status === 'alert';
          const isGrouped = reading.occurrences && reading.occurrences > 1;
          const durationMinutes = reading.duration ? Math.floor(reading.duration / 60) : 0;

          return (
            <article className="card" key={reading.id || idx}>
              <div className="card-header">
                <h4 className="card-title">
                  {timestamp.toLocaleTimeString('pt-BR')} - {timestamp.toLocaleDateString('pt-BR')}
                  {isGrouped && (
                    <span style={{ fontSize: '0.75rem', color: '#d97706', marginLeft: '8px' }}>
                      ({reading.occurrences}x em {durationMinutes}min)
                    </span>
                  )}
                </h4>
                <span className={`chip ${hasAlert ? 'alert' : 'safe'}`}>
                  <span>{hasAlert ? '⚠️' : '✅'}</span>
                  {hasAlert ? 'Alerta' : 'Normal'}
                </span>
              </div>
              
              <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>BPM</div>
                    <div style={{ fontWeight: '600', color: hasAlert ? '#dc2626' : '#059669' }}>
                      {reading.vitals?.bpm || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>SpO2</div>
                    <div style={{ fontWeight: '600', color: hasAlert ? '#dc2626' : '#059669' }}>
                      {reading.vitals?.spo2 ? `${reading.vitals.spo2}%` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Temperatura</div>
                    <div style={{ fontWeight: '600', color: hasAlert ? '#dc2626' : '#059669' }}>
                      {reading.vitals?.temperature ? `${reading.vitals.temperature}°C` : 'N/A'}
                    </div>
                  </div>
                </div>
                
                {isGrouped && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '6px 8px', 
                    background: '#fef3cd', 
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#92400e'
                  }}>
                    ℹ️ Alerta repetido {reading.occurrences} vezes durante {durationMinutes} minutos
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  )
}
