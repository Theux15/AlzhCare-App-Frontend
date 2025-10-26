import React, { useState, useEffect } from 'react'
import configService from '../services/configService'

export default function MapCard({ sensorData, onToggleMap, showMap, isOnline = true }) {
  // Extrair dados GPS dos sensores
  const gpsData = sensorData?.location || {};
  const gpsInfo = {
    latitude: gpsData.latitude || 0,
    longitude: gpsData.longitude || 0,
    altitude: gpsData.altitude || 0,
    velocity: gpsData.speed || 0,
    satellites: gpsData.satellites || 0,
    accuracy: gpsData.accuracy || 0,
    isActive: isOnline && (gpsData.gps_valid || gpsData.satellites > 0)
  };

  // Estado da localização
  const [locationText, setLocationText] = useState('Aguardando localização...');
  const [geofenceInfo, setGeofenceInfo] = useState(null);

  useEffect(() => {
    if (gpsInfo.latitude && gpsInfo.longitude && gpsInfo.isActive) {
      // Verificar geofencing
      const geofence = configService.checkGeofence(gpsInfo.latitude, gpsInfo.longitude);
      setGeofenceInfo(geofence.isInGeofence ? geofence : null);

      // Usar nome do local se estiver em geofence
      if (geofence.isInGeofence) {
        setLocationText(`📍 ${geofence.location} · ${geofence.distance}m do centro`);
      } else {
        // Usar o endereço formatado se disponível, senão mostrar coordenadas
        const address = sensorData?.location?.formatted_address || sensorData?.location?.address?.formatted;
        if (address) {
          setLocationText(`${address} · Última atualização agora`);
        } else {
          setLocationText(`${gpsInfo.latitude.toFixed(6)}, ${gpsInfo.longitude.toFixed(6)} · Última atualização agora`);
        }
      }
    } else {
      setLocationText('Aguardando sinal GPS...');
      setGeofenceInfo(null);
    }
  }, [gpsInfo.latitude, gpsInfo.longitude, gpsInfo.isActive, sensorData?.location?.formatted_address, sensorData?.location?.address?.formatted]);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        minHeight: '140px',
        boxShadow: 'var(--card-shadow)',
        background: geofenceInfo ? 
          'linear-gradient(140deg, rgba(16, 185, 129, 0.35), rgba(5, 150, 105, 0.45))' :
          'linear-gradient(140deg, rgba(186, 160, 211, 0.35), rgba(94, 53, 177, 0.45))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: '#ffffff',
        textAlign: 'center',
        padding: '16px',
        margin: '0 auto',
        transition: 'background 0.3s ease'
      }}
    >
      {/* Indicador de Geofence - canto superior esquerdo */}
      {geofenceInfo && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem',
          background: 'rgba(16, 185, 129, 0.9)',
          padding: '4px 8px',
          borderRadius: '12px',
          fontWeight: '600'
        }}>
          <span>✓</span>
          <span>Em local conhecido</span>
        </div>
      )}

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
        <span style={{ fontWeight: 'bold' }}>{gpsInfo.satellites}</span>
        <span style={{
          color: gpsInfo.isActive ? '#4ade80' : '#f87171',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {gpsInfo.isActive ? 'ativo' : 'inativo'}
        </span>
      </div>

      {/* Conteúdo principal */}
      <div 
        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: onToggleMap ? 'pointer' : 'default' }}
        onClick={onToggleMap}
      >
        <div>
          <strong>{gpsInfo.isActive ? 'Localização GPS' : 'GPS Desconectado'}</strong>
          <p id="locationText" style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
            {locationText}
          </p>
          {onToggleMap && (
            <p style={{ margin: '4px 0 0', fontSize: '0.7rem', opacity: 0.7 }}>
              {showMap ? 'Clique para fechar o mapa' : 'Clique para ver no mapa'}
            </p>
          )}
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
          <span>{gpsInfo.altitude > 0 ? `${gpsInfo.altitude.toFixed(1)}m` : '--'}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.75rem'
        }}>
          <span>🚶‍♂️</span>
          <span>{gpsInfo.velocity > 0 ? `${gpsInfo.velocity.toFixed(1)} km/h` : '--'}</span>
        </div>
        {gpsInfo.accuracy > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem'
          }}>
            <span>📍</span>
            <span>±{gpsInfo.accuracy.toFixed(0)}m</span>
          </div>
        )}
      </div>
    </div>
  )
}
