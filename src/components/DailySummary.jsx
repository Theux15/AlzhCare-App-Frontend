import React, { useState } from 'react'

export default function DailySummary({ summary, isOnline = true }) {
  const [showVitalsAlerts, setShowVitalsAlerts] = useState(true);
  
  // Dados padrão se não houver summary
  const defaultSummary = {
    date: new Date().toISOString().split('T')[0],
    fallsCount: 0,
    vitalsAlertsCount: 0,
    locationsCount: 0,
    sosCount: 0,
    vitalsAlerts: [],
    locations: [],
    falls: [],
    sosEvents: []
  };

  const dailyData = summary || defaultSummary;
  
  // Formatação da data
  const displayDate = new Date(dailyData.date).toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '22px',
      padding: '24px',
      boxShadow: 'var(--card-shadow)',
      margin: '0 auto'
    }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          margin: '0 0 4px 0', 
          color: 'var(--text-high)',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          📊 Resumo do dia
        </h3>
        <p style={{ 
          margin: 0, 
          color: 'var(--text-medium)', 
          fontSize: '0.85rem',
          textTransform: 'capitalize'
        }}>
          {displayDate}
        </p>
      </div>

      {/* Cards de alertas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Quedas */}
        <div style={{
          background: dailyData.fallsCount > 0 ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${dailyData.fallsCount > 0 ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
            {dailyData.fallsCount > 0 ? '⚠️' : '✅'}
          </div>
          <div style={{ 
            fontSize: '0.7rem', 
            color: dailyData.fallsCount > 0 ? '#dc2626' : '#16a34a',
            fontWeight: '600'
          }}>
            {dailyData.fallsCount} quedas
          </div>
        </div>

        {/* SOS */}
        <div style={{
          background: dailyData.sosCount > 0 ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${dailyData.sosCount > 0 ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
            {dailyData.sosCount > 0 ? '🆘' : '✅'}
          </div>
          <div style={{ 
            fontSize: '0.7rem', 
            color: dailyData.sosCount > 0 ? '#dc2626' : '#16a34a',
            fontWeight: '600'
          }}>
            {dailyData.sosCount} SOS
          </div>
        </div>

        {/* Sinais vitais */}
        <div style={{
          background: dailyData.vitalsAlertsCount > 0 ? '#fef3cd' : '#f0fdf4',
          border: `1px solid ${dailyData.vitalsAlertsCount > 0 ? '#fde68a' : '#bbf7d0'}`,
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
            {dailyData.vitalsAlertsCount > 0 ? '🟡' : '✅'}
          </div>
          <div style={{ 
            fontSize: '0.7rem', 
            color: dailyData.vitalsAlertsCount > 0 ? '#d97706' : '#16a34a',
            fontWeight: '600'
          }}>
            {dailyData.vitalsAlertsCount} alertas
          </div>
        </div>

        {/* Localizações */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          padding: '12px 8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📍</div>
          <div style={{ 
            fontSize: '0.7rem', 
            color: '#0284c7',
            fontWeight: '600'
          }}>
            {dailyData.locationsCount} locais
          </div>
        </div>
      </div>

      {/* Eventos de quedas */}
      {dailyData.falls && dailyData.falls.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '0.9rem',
            color: 'var(--text-high)',
            fontWeight: '600'
          }}>
            ⚠️ Quedas detectadas
          </h4>
          {dailyData.falls.map((fall, index) => (
            <div key={fall.id || index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '6px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '600' }}>
                  {new Date(fall.detected_at || fall.timestamp).toLocaleTimeString('pt-BR')}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#991b1b', marginLeft: '8px' }}>
                  Queda detectada
                </span>
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                color: fall.resolved ? '#16a34a' : '#dc2626',
                background: fall.resolved ? '#f0fdf4' : '#fef2f2',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '600'
              }}>
                {fall.resolved ? 'Resolvido' : 'Ativo'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Eventos SOS */}
      {dailyData.sosEvents && dailyData.sosEvents.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            fontSize: '0.9rem',
            color: 'var(--text-high)',
            fontWeight: '600'
          }}>
            🆘 Acionamentos SOS
          </h4>
          {dailyData.sosEvents.map((sos, index) => (
            <div key={sos.id || index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '6px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '600' }}>
                  {new Date(sos.activated_at || sos.timestamp).toLocaleTimeString('pt-BR')}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#991b1b', marginLeft: '8px' }}>
                  {sos.message || 'Botão SOS acionado'}
                </span>
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                color: sos.resolved ? '#16a34a' : '#dc2626',
                background: sos.resolved ? '#f0fdf4' : '#fef2f2',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {sos.resolved ? 'Resolvido' : 'Ativo'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Eventos de sinais vitais */}
      {dailyData.vitalsAlerts && dailyData.vitalsAlerts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'var(--text-high)',
              fontWeight: '600'
            }}>
              🩺 Alertas de Sinais Vitais
            </h4>
            <button
              onClick={() => setShowVitalsAlerts(!showVitalsAlerts)}
              style={{
                background: showVitalsAlerts ? '#fde68a' : '#e5e7eb',
                border: 'none',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: showVitalsAlerts ? '#92400e' : '#6b7280',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {showVitalsAlerts ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {showVitalsAlerts && dailyData.vitalsAlerts.map((alert, index) => {
            const timestamp = new Date(alert.timestamp);
            const isGrouped = alert.occurrences && alert.occurrences > 1;
            const durationMinutes = alert.duration ? Math.floor(alert.duration / 60) : 0;
            
            return (
              <div key={alert.id || index} style={{
                padding: '10px 12px',
                background: '#fef3cd',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                marginBottom: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '600' }}>
                    {timestamp.toLocaleTimeString('pt-BR')}
                    {isGrouped && (
                      <span style={{ fontSize: '0.7rem', color: '#d97706', marginLeft: '6px' }}>
                        ({alert.occurrences}x em {durationMinutes}min)
                      </span>
                    )}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#92400e',
                    background: '#fde68a',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontWeight: '600'
                  }}>
                    {alert.alertType?.toUpperCase() || 'ALERTA'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350f' }}>
                  BPM: {alert.vitals?.bpm || 'N/A'} | 
                  SpO2: {alert.vitals?.spo2 ? `${alert.vitals.spo2}%` : 'N/A'} | 
                  Temp: {alert.vitals?.temperature ? `${alert.vitals.temperature}°C` : 'N/A'}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Histórico de localizações */}
      <div>
        <h4 style={{
          margin: '0 0 12px 0',
          fontSize: '0.9rem',
          color: 'var(--text-high)',
          fontWeight: '600'
        }}>
          📍 Localizações do dia
        </h4>
        {dailyData.locations && dailyData.locations.length > 0 ? (
          dailyData.locations.map((location, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '6px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '600' }}>
                  {new Date(location.timestamp || location.arrived_at).toLocaleTimeString('pt-BR')}
                </span>
                <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                  {location.address?.formatted || location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
                </div>
              </div>
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#64748b',
                background: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {location.address?.components?.neighborhood || location.neighborhood || 'Localização'}
              </span>
            </div>
          ))
        ) : (
          <div style={{
            padding: '16px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.85rem'
          }}>
            {isOnline ? 'Nenhuma mudança de localização hoje' : 'Sistema offline'}
          </div>
        )}
      </div>
    </div>
  )
}