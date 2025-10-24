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
        {history.slice(0, 10).map((item, idx) => {
          // Para data/hora, vamos usar a data atual com a hora fornecida
          const today = new Date();
          const [hours, minutes] = (item.time || '00:00').split(':');
          const timestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
          
          const hasAlert = item.sos || item.fall;

          return (
            <article className="card" key={idx}>
              <div className="card-header">
                <h4 className="card-title">
                  {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
                </h4>
                <span className={`chip ${hasAlert ? 'alert' : 'safe'}`}>
                  <span>{hasAlert ? '⚠️' : '✅'}</span>
                  {hasAlert ? 'Alerta' : 'Normal'}
                </span>
              </div>
              
              <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                <div style={{ color: '#6b7280' }}>
                  {item.summary || 'Evento registrado'}
                </div>
                {item.resolved && (
                  <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '4px' }}>
                    ✅ Resolvido
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
