import React from 'react'

export default function FallsCard({ sensorData, fallAlerts = [], onResolveFall, isOnline = true }) {
  // Status baseado nos alertas de queda e dados dos sensores
  const currentFallDetected = sensorData?.fall_detection?.fall_detected || sensorData?.esp32?.fall;
  const isMoving = sensorData?.location?.speed > 0.5; // Considerando movimento acima de 0.5 km/h
  
  // Última localização conhecida para usar como fallback
  const lastKnownLocation = sensorData?.location;

  // Separar quedas ativas das já resolvidas (baseado no localStorage)
  const activeFalls = fallAlerts.filter(alert => !alert.resolved);
  const resolvedFalls = fallAlerts.filter(alert => alert.resolved);
  const totalFallsToday = fallAlerts.length;

  const getStatus = () => {
    if (!isOnline) return { chip: 'warning', icon: '🔌', text: 'Sistema Offline' };
    if (currentFallDetected || activeFalls.length > 0) return { chip: 'alert', icon: '⚠️', text: 'Queda Detectada' };
    if (totalFallsToday > 0) return { chip: 'warning', icon: '📋', text: `${totalFallsToday} quedas hoje` };
    if (isMoving) return { chip: 'safe', icon: '🚶‍♀️', text: 'Em movimento' };
    return { chip: 'safe', icon: '🧍‍♀️', text: 'Estável' };
  };

  // Função local para marcar como resolvido
  const handleResolveFall = (fallId) => {
    console.log('🔄 Iniciando resolução da queda:', fallId);
    console.log('📋 Quedas ativas disponíveis:', activeFalls.map(f => ({ id: f.id, resolved: f.resolved })));
    
    if (onResolveFall) {
      onResolveFall(fallId);
    } else {
      console.error('❌ onResolveFall não está disponível');
    }
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
      
      {activeFalls.length > 0 ? (
        <div>
          <p className="metric-value">⚠️ {activeFalls.length} queda(s) ativa(s)</p>
          <div style={{ marginTop: '12px' }}>
            {activeFalls.map((alert, index) => {
              const fallDate = new Date(alert.detected_at || alert.timestamp);
              const fallLocation = alert.location || lastKnownLocation;
              const uniqueKey = `active-${alert.id || index}-${alert.timestamp || Date.now()}`;
              
              return (
                <div key={uniqueKey} style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '8px',
                  fontSize: '0.85rem'
                }}>
                  {/* Data e horário */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: '600', color: '#dc2626' }}>
                      📅 {fallDate.toLocaleDateString('pt-BR')} - {fallDate.toLocaleTimeString('pt-BR')}
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: '#991b1b',
                      background: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      ATIVA
                    </span>
                  </div>

                  {/* Descrição */}
                  <div style={{ color: '#991b1b', marginBottom: '8px' }}>
                    <strong>🚨 Queda Detectada:</strong> {alert.message || 'Possível queda detectada pelos sensores'}
                  </div>

                  {/* Localização */}
                  <div style={{ marginBottom: '8px', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: '600', color: '#7c2d12' }}>
                      📍 Localização: 
                    </span>
                    <span style={{ color: '#991b1b', marginLeft: '4px' }}>
                      {(() => {
                        if (fallLocation?.address?.formatted) {
                          return fallLocation.address.formatted;
                        }
                        if (fallLocation?.latitude && fallLocation?.longitude) {
                          return `${fallLocation.latitude.toFixed(6)}, ${fallLocation.longitude.toFixed(6)}`;
                        }
                        return 'Localização não disponível';
                      })()}
                    </span>
                  </div>

                  {/* ID da queda */}
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '8px' }}>
                    ID: {alert.id}
                  </div>

                  {/* Botão de resolução */}
                  <button
                    onClick={() => handleResolveFall(alert.id)}
                    style={{
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    ✅ Confirmar Segurança
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : totalFallsToday > 0 ? (
        <div>
          <p className="metric-value">📋 {totalFallsToday} queda(s) registrada(s) hoje</p>
          <div style={{ marginTop: '12px' }}>
            {fallAlerts.slice(0, 3).map((alert, index) => {
              const fallDate = new Date(alert.detected_at || alert.timestamp);
              const fallLocation = alert.location || lastKnownLocation;
              const uniqueKey = `resolved-${alert.id || index}-${alert.timestamp || Date.now()}`;
              
              return (
                <div key={uniqueKey} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px',
                  marginBottom: '6px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#374151' }}>
                        📅 {fallDate.toLocaleDateString('pt-BR')} - {fallDate.toLocaleTimeString('pt-BR')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                        📍 {(() => {
                          if (fallLocation?.address?.formatted) {
                            return fallLocation.address.formatted;
                          }
                          if (fallLocation?.latitude && fallLocation?.longitude) {
                            return `${fallLocation.latitude.toFixed(4)}, ${fallLocation.longitude.toFixed(4)}`;
                          }
                          return 'Localização não disponível';
                        })()}
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: '#16a34a',
                      background: '#f0fdf4',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}>
                      RESOLVIDA
                    </span>
                  </div>
                </div>
              );
            })}
            {fallAlerts.length > 3 && (
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', marginTop: '8px' }}>
                ... e mais {fallAlerts.length - 3} queda(s)
              </div>
            )}
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
